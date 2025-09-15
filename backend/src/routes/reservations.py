from flask import Blueprint, request, jsonify
from src.models.rental_models import db, Reservation, RentalSpace, User, ReservationStatus
from datetime import datetime, timedelta
from sqlalchemy import and_, or_

reservations_bp = Blueprint('reservations', __name__)

@reservations_bp.route('/reservations', methods=['GET'])
def get_reservations():
    """Get reservations with optional filtering"""
    try:
        # Get query parameters
        user_id = request.args.get('user_id')
        space_id = request.args.get('space_id')
        status = request.args.get('status')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # Build query
        query = db.session.query(Reservation, User, RentalSpace).join(User).join(RentalSpace)
        
        # Apply filters
        if user_id:
            query = query.filter(Reservation.user_id == user_id)
        if space_id:
            query = query.filter(Reservation.space_id == space_id)
        if status:
            try:
                status_enum = ReservationStatus(status)
                query = query.filter(Reservation.status == status_enum)
            except ValueError:
                return jsonify({
                    'success': False,
                    'error': f'Invalid status: {status}'
                }), 400
        if start_date:
            try:
                start_dt = datetime.fromisoformat(start_date)
                query = query.filter(Reservation.start_time >= start_dt)
            except ValueError:
                return jsonify({
                    'success': False,
                    'error': 'Invalid start_date format. Use ISO format.'
                }), 400
        if end_date:
            try:
                end_dt = datetime.fromisoformat(end_date)
                query = query.filter(Reservation.end_time <= end_dt)
            except ValueError:
                return jsonify({
                    'success': False,
                    'error': 'Invalid end_date format. Use ISO format.'
                }), 400
        
        # Execute query
        reservations = query.order_by(Reservation.start_time.desc()).all()
        
        reservations_data = []
        for reservation, user, space in reservations:
            reservation_dict = reservation.to_dict()
            reservation_dict['user_name'] = user.full_name
            reservation_dict['user_email'] = user.email
            reservation_dict['space_name'] = space.name
            reservations_data.append(reservation_dict)
        
        return jsonify({
            'success': True,
            'data': reservations_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@reservations_bp.route('/reservations/<reservation_id>', methods=['GET'])
def get_reservation(reservation_id):
    """Get a specific reservation by ID"""
    try:
        reservation_data = db.session.query(Reservation, User, RentalSpace).join(User).join(RentalSpace).filter(
            Reservation.id == reservation_id
        ).first()
        
        if not reservation_data:
            return jsonify({
                'success': False,
                'error': 'Reservation not found'
            }), 404
        
        reservation, user, space = reservation_data
        reservation_dict = reservation.to_dict()
        reservation_dict['user_name'] = user.full_name
        reservation_dict['user_email'] = user.email
        reservation_dict['space_name'] = space.name
        reservation_dict['space_description'] = space.description
        reservation_dict['space_capacity'] = space.capacity
        
        return jsonify({
            'success': True,
            'data': reservation_dict
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@reservations_bp.route('/reservations', methods=['POST'])
def create_reservation():
    """Create a new reservation"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['user_id', 'space_id', 'start_time', 'end_time']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Parse datetime strings
        try:
            start_time = datetime.fromisoformat(data['start_time'])
            end_time = datetime.fromisoformat(data['end_time'])
        except ValueError:
            return jsonify({
                'success': False,
                'error': 'Invalid datetime format. Use ISO format.'
            }), 400
        
        # Validate time range
        if start_time >= end_time:
            return jsonify({
                'success': False,
                'error': 'End time must be after start time'
            }), 400
        
        if start_time < datetime.now():
            return jsonify({
                'success': False,
                'error': 'Start time cannot be in the past'
            }), 400
        
        # Verify user and space exist
        user = User.query.get(data['user_id'])
        if not user:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        space = RentalSpace.query.get(data['space_id'])
        if not space:
            return jsonify({
                'success': False,
                'error': 'Space not found'
            }), 404
        
        # Check for conflicting reservations
        conflicting_reservation = Reservation.query.filter(
            Reservation.space_id == data['space_id'],
            Reservation.status.in_([ReservationStatus.PENDING, ReservationStatus.CONFIRMED]),
            or_(
                and_(Reservation.start_time <= start_time, Reservation.end_time > start_time),
                and_(Reservation.start_time < end_time, Reservation.end_time >= end_time),
                and_(Reservation.start_time >= start_time, Reservation.end_time <= end_time)
            )
        ).first()
        
        if conflicting_reservation:
            return jsonify({
                'success': False,
                'error': 'Space is not available during the requested time'
            }), 409
        
        # Calculate total price
        duration_hours = (end_time - start_time).total_seconds() / 3600
        total_price = float(space.price_per_hour) * duration_hours
        
        # Create reservation
        reservation = Reservation(
            user_id=data['user_id'],
            space_id=data['space_id'],
            start_time=start_time,
            end_time=end_time,
            total_price=total_price,
            status=ReservationStatus.PENDING
        )
        
        db.session.add(reservation)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': reservation.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@reservations_bp.route('/reservations/<reservation_id>', methods=['PUT'])
def update_reservation(reservation_id):
    """Update a reservation"""
    try:
        reservation = Reservation.query.get(reservation_id)
        if not reservation:
            return jsonify({
                'success': False,
                'error': 'Reservation not found'
            }), 404
        
        data = request.get_json()
        
        # Update status if provided
        if 'status' in data:
            try:
                new_status = ReservationStatus(data['status'])
                reservation.status = new_status
            except ValueError:
                return jsonify({
                    'success': False,
                    'error': f'Invalid status: {data["status"]}'
                }), 400
        
        # Update times if provided (only for pending reservations)
        if reservation.status == ReservationStatus.PENDING:
            if 'start_time' in data or 'end_time' in data:
                try:
                    start_time = datetime.fromisoformat(data.get('start_time', reservation.start_time.isoformat()))
                    end_time = datetime.fromisoformat(data.get('end_time', reservation.end_time.isoformat()))
                except ValueError:
                    return jsonify({
                        'success': False,
                        'error': 'Invalid datetime format. Use ISO format.'
                    }), 400
                
                # Validate time range
                if start_time >= end_time:
                    return jsonify({
                        'success': False,
                        'error': 'End time must be after start time'
                    }), 400
                
                # Check for conflicts (excluding current reservation)
                conflicting_reservation = Reservation.query.filter(
                    Reservation.space_id == reservation.space_id,
                    Reservation.id != reservation.id,
                    Reservation.status.in_([ReservationStatus.PENDING, ReservationStatus.CONFIRMED]),
                    or_(
                        and_(Reservation.start_time <= start_time, Reservation.end_time > start_time),
                        and_(Reservation.start_time < end_time, Reservation.end_time >= end_time),
                        and_(Reservation.start_time >= start_time, Reservation.end_time <= end_time)
                    )
                ).first()
                
                if conflicting_reservation:
                    return jsonify({
                        'success': False,
                        'error': 'Space is not available during the requested time'
                    }), 409
                
                # Update times and recalculate price
                reservation.start_time = start_time
                reservation.end_time = end_time
                
                space = RentalSpace.query.get(reservation.space_id)
                duration_hours = (end_time - start_time).total_seconds() / 3600
                reservation.total_price = float(space.price_per_hour) * duration_hours
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': reservation.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@reservations_bp.route('/reservations/<reservation_id>', methods=['DELETE'])
def cancel_reservation(reservation_id):
    """Cancel a reservation"""
    try:
        reservation = Reservation.query.get(reservation_id)
        if not reservation:
            return jsonify({
                'success': False,
                'error': 'Reservation not found'
            }), 404
        
        # Only allow cancellation of pending or confirmed reservations
        if reservation.status == ReservationStatus.CANCELLED:
            return jsonify({
                'success': False,
                'error': 'Reservation is already cancelled'
            }), 400
        
        reservation.status = ReservationStatus.CANCELLED
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Reservation cancelled successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@reservations_bp.route('/spaces/<space_id>/availability', methods=['GET'])
def check_availability(space_id):
    """Check availability for a space within a date range"""
    try:
        # Get query parameters
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        if not start_date or not end_date:
            return jsonify({
                'success': False,
                'error': 'start_date and end_date parameters are required'
            }), 400
        
        try:
            start_dt = datetime.fromisoformat(start_date)
            end_dt = datetime.fromisoformat(end_date)
        except ValueError:
            return jsonify({
                'success': False,
                'error': 'Invalid date format. Use ISO format.'
            }), 400
        
        # Verify space exists
        space = RentalSpace.query.get(space_id)
        if not space:
            return jsonify({
                'success': False,
                'error': 'Space not found'
            }), 404
        
        # Get existing reservations in the date range
        reservations = Reservation.query.filter(
            Reservation.space_id == space_id,
            Reservation.status.in_([ReservationStatus.PENDING, ReservationStatus.CONFIRMED]),
            Reservation.start_time < end_dt,
            Reservation.end_time > start_dt
        ).all()
        
        unavailable_slots = []
        for reservation in reservations:
            unavailable_slots.append({
                'start_time': reservation.start_time.isoformat(),
                'end_time': reservation.end_time.isoformat(),
                'reservation_id': reservation.id
            })
        
        return jsonify({
            'success': True,
            'data': {
                'space_id': space_id,
                'space_name': space.name,
                'query_start': start_dt.isoformat(),
                'query_end': end_dt.isoformat(),
                'unavailable_slots': unavailable_slots
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
