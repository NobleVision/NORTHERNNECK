from flask import Blueprint, request, jsonify
from src.models.rental_models import db, RentalSpace, Review
from sqlalchemy import func

spaces_bp = Blueprint('spaces', __name__)

@spaces_bp.route('/spaces', methods=['GET'])
def get_spaces():
    """Get all rental spaces with optional filtering"""
    try:
        spaces = RentalSpace.query.all()
        spaces_data = []
        
        for space in spaces:
            space_dict = space.to_dict()
            
            # Add average rating and review count
            avg_rating = db.session.query(func.avg(Review.rating)).filter_by(space_id=space.id).scalar()
            review_count = db.session.query(func.count(Review.id)).filter_by(space_id=space.id).scalar()
            
            space_dict['average_rating'] = float(avg_rating) if avg_rating else 0
            space_dict['review_count'] = review_count or 0
            
            spaces_data.append(space_dict)
        
        return jsonify({
            'success': True,
            'data': spaces_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@spaces_bp.route('/spaces/<space_id>', methods=['GET'])
def get_space(space_id):
    """Get a specific rental space by ID"""
    try:
        space = RentalSpace.query.get(space_id)
        if not space:
            return jsonify({
                'success': False,
                'error': 'Space not found'
            }), 404
        
        space_dict = space.to_dict()
        
        # Add average rating and review count
        avg_rating = db.session.query(func.avg(Review.rating)).filter_by(space_id=space.id).scalar()
        review_count = db.session.query(func.count(Review.id)).filter_by(space_id=space.id).scalar()
        
        space_dict['average_rating'] = float(avg_rating) if avg_rating else 0
        space_dict['review_count'] = review_count or 0
        
        return jsonify({
            'success': True,
            'data': space_dict
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@spaces_bp.route('/spaces', methods=['POST'])
def create_space():
    """Create a new rental space (admin only)"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'price_per_hour']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        space = RentalSpace(
            name=data['name'],
            description=data.get('description'),
            price_per_hour=data['price_per_hour'],
            capacity=data.get('capacity'),
            photos=data.get('photos', [])
        )
        
        db.session.add(space)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': space.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@spaces_bp.route('/spaces/<space_id>', methods=['PUT'])
def update_space(space_id):
    """Update a rental space (admin only)"""
    try:
        space = RentalSpace.query.get(space_id)
        if not space:
            return jsonify({
                'success': False,
                'error': 'Space not found'
            }), 404
        
        data = request.get_json()
        
        # Update fields if provided
        if 'name' in data:
            space.name = data['name']
        if 'description' in data:
            space.description = data['description']
        if 'price_per_hour' in data:
            space.price_per_hour = data['price_per_hour']
        if 'capacity' in data:
            space.capacity = data['capacity']
        if 'photos' in data:
            space.photos = data['photos']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': space.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@spaces_bp.route('/spaces/<space_id>', methods=['DELETE'])
def delete_space(space_id):
    """Delete a rental space (admin only)"""
    try:
        space = RentalSpace.query.get(space_id)
        if not space:
            return jsonify({
                'success': False,
                'error': 'Space not found'
            }), 404
        
        db.session.delete(space)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Space deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
