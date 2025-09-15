from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from sqlalchemy import func, desc
from src.models.rental_models import db, User, RentalSpace, Reservation, Payment, Review

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """Get overview statistics for admin dashboard"""
    try:
        # Calculate date ranges
        today = datetime.now().date()
        last_month = today - timedelta(days=30)
        
        # Total revenue
        total_revenue = db.session.query(func.sum(Payment.amount)).filter(
            Payment.status == 'completed'
        ).scalar() or 0
        
        # Revenue last month for comparison
        last_month_revenue = db.session.query(func.sum(Payment.amount)).filter(
            Payment.status == 'completed',
            Payment.created_at >= last_month
        ).scalar() or 0
        
        # Total bookings
        total_bookings = db.session.query(func.count(Reservation.id)).scalar() or 0
        
        # Bookings last month
        last_month_bookings = db.session.query(func.count(Reservation.id)).filter(
            Reservation.created_at >= last_month
        ).scalar() or 0
        
        # Active spaces (using total count since status field doesn't exist)
        total_spaces = db.session.query(func.count(RentalSpace.id)).scalar() or 0
        active_spaces = total_spaces  # All spaces are considered active
        
        # Maintenance spaces (placeholder since status field doesn't exist)
        maintenance_spaces = 0
        
        # Average rating
        avg_rating = db.session.query(func.avg(Review.rating)).scalar() or 0
        total_reviews = db.session.query(func.count(Review.id)).scalar() or 0
        
        # Calculate percentage changes
        revenue_change = 0
        if total_revenue > 0:
            revenue_change = ((last_month_revenue / total_revenue) * 100) if total_revenue > 0 else 0
        
        booking_change = 0
        if total_bookings > 0:
            booking_change = ((last_month_bookings / total_bookings) * 100) if total_bookings > 0 else 0
        
        return jsonify({
            'total_revenue': float(total_revenue),
            'revenue_change': round(revenue_change, 1),
            'total_bookings': total_bookings,
            'booking_change': round(booking_change, 1),
            'active_spaces': active_spaces,
            'maintenance_spaces': maintenance_spaces,
            'avg_rating': round(float(avg_rating), 1) if avg_rating else 0,
            'total_reviews': total_reviews
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/spaces/performance', methods=['GET'])
def get_space_performance():
    """Get performance metrics for all spaces"""
    try:
        # Query space performance data
        space_stats = db.session.query(
            RentalSpace.id,
            RentalSpace.name,
            RentalSpace.capacity,
            RentalSpace.price_per_hour,
            func.count(Reservation.id).label('booking_count'),
            func.sum(Payment.amount).label('total_revenue')
        ).outerjoin(Reservation, RentalSpace.id == Reservation.space_id)\
         .outerjoin(Payment, Reservation.id == Payment.reservation_id)\
         .filter(Payment.status == 'succeeded')\
         .group_by(RentalSpace.id, RentalSpace.name, RentalSpace.capacity, RentalSpace.price_per_hour)\
         .all()
        
        spaces = []
        for stat in space_stats:
            spaces.append({
                'id': str(stat.id),
                'name': stat.name,
                'capacity': stat.capacity,
                'price': float(stat.price_per_hour),
                'status': 'active',  # Default status since field doesn't exist
                'bookings': stat.booking_count or 0,
                'revenue': float(stat.total_revenue or 0)
            })
        
        return jsonify(spaces)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/reservations/recent', methods=['GET'])
def get_recent_reservations():
    """Get recent reservations with customer and space details"""
    try:
        limit = request.args.get('limit', 10, type=int)
        
        reservations = db.session.query(Reservation)\
            .join(User, Reservation.user_id == User.id)\
            .join(RentalSpace, Reservation.space_id == RentalSpace.id)\
            .order_by(desc(Reservation.created_at))\
            .limit(limit)\
            .all()
        
        result = []
        for reservation in reservations:
            # Get payment info
            payment = db.session.query(Payment).filter(
                Payment.reservation_id == reservation.id
            ).first()
            
            result.append({
                'id': str(reservation.id),
                'space': reservation.space.name,
                'customer': reservation.user.full_name,
                'date': reservation.start_time.date().isoformat(),
                'time': f"{reservation.start_time.strftime('%H:%M')}-{reservation.end_time.strftime('%H:%M')}",
                'status': reservation.status.value,
                'amount': float(payment.amount) if payment else 0,
                'created_at': reservation.created_at.isoformat()
            })
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users/summary', methods=['GET'])
def get_users_summary():
    """Get user summary with booking and spending statistics"""
    try:
        # Query users with their booking and spending stats
        user_stats = db.session.query(
            User.id,
            User.full_name,
            User.email,
            User.created_at,
            func.count(Reservation.id).label('booking_count'),
            func.sum(Payment.amount).label('total_spent')
        ).outerjoin(Reservation, User.id == Reservation.user_id)\
         .outerjoin(Payment, Reservation.id == Payment.reservation_id)\
         .filter(Payment.status == 'succeeded')\
         .group_by(User.id, User.full_name, User.email, User.created_at)\
         .all()
        
        users = []
        for stat in user_stats:
            users.append({
                'id': str(stat.id),
                'name': stat.full_name,
                'email': stat.email,
                'phone': '',  # Phone field doesn't exist in model
                'bookings': stat.booking_count or 0,
                'totalSpent': float(stat.total_spent or 0),
                'joinDate': stat.created_at.strftime('%Y-%m-%d')
            })
        
        return jsonify(users)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/reviews/recent', methods=['GET'])
def get_recent_reviews():
    """Get recent reviews with customer and space details"""
    try:
        limit = request.args.get('limit', 10, type=int)
        
        reviews = db.session.query(Review)\
            .join(User, Review.user_id == User.id)\
            .join(RentalSpace, Review.space_id == RentalSpace.id)\
            .order_by(desc(Review.created_at))\
            .limit(limit)\
            .all()
        
        result = []
        for review in reviews:
            result.append({
                'id': str(review.id),
                'space': review.space.name,
                'customer': review.user.full_name,
                'rating': review.rating,
                'comment': review.comment,
                'date': review.created_at.strftime('%Y-%m-%d'),
                'created_at': review.created_at.isoformat()
            })
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/spaces/<space_id>', methods=['PUT'])
def update_space(space_id):
    """Update space details"""
    try:
        space = db.session.query(RentalSpace).filter(RentalSpace.id == space_id).first()
        if not space:
            return jsonify({'error': 'Space not found'}), 404
        
        data = request.get_json()
        
        # Update space fields
        if 'name' in data:
            space.name = data['name']
        if 'description' in data:
            space.description = data['description']
        if 'capacity' in data:
            space.capacity = data['capacity']
        if 'price_per_hour' in data:
            space.price_per_hour = data['price_per_hour']
        
        space.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'id': str(space.id),
            'name': space.name,
            'description': space.description,
            'capacity': space.capacity,
            'price_per_hour': float(space.price_per_hour)
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/reservations/<reservation_id>/status', methods=['PUT'])
def update_reservation_status(reservation_id):
    """Update reservation status"""
    try:
        reservation = db.session.query(Reservation).filter(
            Reservation.id == reservation_id
        ).first()
        
        if not reservation:
            return jsonify({'error': 'Reservation not found'}), 404
        
        data = request.get_json()
        new_status = data.get('status')
        
        if new_status not in ['pending', 'confirmed', 'cancelled', 'completed']:
            return jsonify({'error': 'Invalid status'}), 400
        
        reservation.status = new_status
        reservation.updated_at = datetime.utcnow()
        
        # If cancelling, update payment status
        if new_status == 'cancelled':
            payment = db.session.query(Payment).filter(
                Payment.reservation_id == reservation.id
            ).first()
            if payment and payment.status.value == 'succeeded':
                payment.status = 'failed'  # Use available enum value
        
        db.session.commit()
        
        return jsonify({
            'id': str(reservation.id),
            'status': reservation.status,
            'updated_at': reservation.updated_at.isoformat()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/reviews/<review_id>', methods=['DELETE'])
def delete_review(review_id):
    """Delete a review"""
    try:
        review = db.session.query(Review).filter(Review.id == review_id).first()
        if not review:
            return jsonify({'error': 'Review not found'}), 404
        
        db.session.delete(review)
        db.session.commit()
        
        return jsonify({'message': 'Review deleted successfully'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/export/reservations', methods=['GET'])
def export_reservations():
    """Export reservations data as CSV"""
    try:
        from io import StringIO
        import csv
        
        # Get date range from query params
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        query = db.session.query(Reservation)\
            .join(User, Reservation.user_id == User.id)\
            .join(RentalSpace, Reservation.space_id == RentalSpace.id)
        
        if start_date:
            query = query.filter(Reservation.start_time >= start_date)
        if end_date:
            query = query.filter(Reservation.start_time <= end_date)
        
        reservations = query.order_by(desc(Reservation.created_at)).all()
        
        # Create CSV
        output = StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow([
            'Reservation ID', 'Customer Name', 'Customer Email', 'Space Name',
            'Event Date', 'Start Time', 'End Time', 'Status', 'Total Amount',
            'Created Date'
        ])
        
        # Write data
        for reservation in reservations:
            payment = db.session.query(Payment).filter(
                Payment.reservation_id == reservation.id
            ).first()
            
            writer.writerow([
                str(reservation.id),
                reservation.user.full_name,
                reservation.user.email,
                reservation.space.name,
                reservation.start_time.date().isoformat(),
                reservation.start_time.strftime('%H:%M'),
                reservation.end_time.strftime('%H:%M'),
                reservation.status.value,
                float(payment.amount) if payment else 0,
                reservation.created_at.strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        output.seek(0)
        
        return jsonify({
            'csv_data': output.getvalue(),
            'filename': f'reservations_{datetime.now().strftime("%Y%m%d")}.csv'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
