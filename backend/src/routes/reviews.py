from flask import Blueprint, request, jsonify
from src.models.rental_models import db, Review, Reservation, User, RentalSpace
from sqlalchemy import func, desc

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('/spaces/<space_id>/reviews', methods=['GET'])
def get_space_reviews(space_id):
    """Get all reviews for a specific space"""
    try:
        # Verify space exists
        space = RentalSpace.query.get(space_id)
        if not space:
            return jsonify({
                'success': False,
                'error': 'Space not found'
            }), 404
        
        # Get reviews with user information
        reviews = db.session.query(Review, User).join(User).filter(
            Review.space_id == space_id
        ).order_by(desc(Review.created_at)).all()
        
        reviews_data = []
        for review, user in reviews:
            review_dict = review.to_dict()
            review_dict['user_name'] = user.full_name
            reviews_data.append(review_dict)
        
        # Calculate summary statistics
        avg_rating = db.session.query(func.avg(Review.rating)).filter_by(space_id=space_id).scalar()
        review_count = len(reviews_data)
        
        # Calculate rating distribution
        rating_distribution = {}
        for i in range(1, 6):
            count = db.session.query(func.count(Review.id)).filter(
                Review.space_id == space_id,
                Review.rating == i
            ).scalar()
            rating_distribution[str(i)] = count or 0
        
        return jsonify({
            'success': True,
            'data': {
                'reviews': reviews_data,
                'summary': {
                    'average_rating': float(avg_rating) if avg_rating else 0,
                    'total_reviews': review_count,
                    'rating_distribution': rating_distribution
                }
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@reviews_bp.route('/reviews', methods=['POST'])
def create_review():
    """Create a new review for a completed reservation"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['reservation_id', 'rating']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Validate rating range
        rating = data['rating']
        if not isinstance(rating, int) or rating < 1 or rating > 5:
            return jsonify({
                'success': False,
                'error': 'Rating must be an integer between 1 and 5'
            }), 400
        
        # Verify reservation exists and is completed
        reservation = Reservation.query.get(data['reservation_id'])
        if not reservation:
            return jsonify({
                'success': False,
                'error': 'Reservation not found'
            }), 404
        
        # Check if review already exists for this reservation
        existing_review = Review.query.filter_by(reservation_id=data['reservation_id']).first()
        if existing_review:
            return jsonify({
                'success': False,
                'error': 'Review already exists for this reservation'
            }), 400
        
        # Create new review
        review = Review(
            reservation_id=data['reservation_id'],
            user_id=reservation.user_id,
            space_id=reservation.space_id,
            rating=rating,
            comment=data.get('comment', '').strip() or None
        )
        
        db.session.add(review)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': review.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@reviews_bp.route('/reviews/<review_id>', methods=['PUT'])
def update_review(review_id):
    """Update an existing review (only by the review author)"""
    try:
        review = Review.query.get(review_id)
        if not review:
            return jsonify({
                'success': False,
                'error': 'Review not found'
            }), 404
        
        data = request.get_json()
        
        # Update rating if provided
        if 'rating' in data:
            rating = data['rating']
            if not isinstance(rating, int) or rating < 1 or rating > 5:
                return jsonify({
                    'success': False,
                    'error': 'Rating must be an integer between 1 and 5'
                }), 400
            review.rating = rating
        
        # Update comment if provided
        if 'comment' in data:
            review.comment = data['comment'].strip() or None
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': review.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@reviews_bp.route('/reviews/<review_id>', methods=['DELETE'])
def delete_review(review_id):
    """Delete a review (only by the review author or admin)"""
    try:
        review = Review.query.get(review_id)
        if not review:
            return jsonify({
                'success': False,
                'error': 'Review not found'
            }), 404
        
        db.session.delete(review)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Review deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@reviews_bp.route('/users/<user_id>/reviews', methods=['GET'])
def get_user_reviews(user_id):
    """Get all reviews by a specific user"""
    try:
        # Verify user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        # Get user's reviews with space information
        reviews = db.session.query(Review, RentalSpace).join(RentalSpace).filter(
            Review.user_id == user_id
        ).order_by(desc(Review.created_at)).all()
        
        reviews_data = []
        for review, space in reviews:
            review_dict = review.to_dict()
            review_dict['space_name'] = space.name
            reviews_data.append(review_dict)
        
        return jsonify({
            'success': True,
            'data': reviews_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
