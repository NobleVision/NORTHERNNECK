#!/usr/bin/env python3
"""
Script to populate the database with sample data for the JR Graham Center booking system
"""

import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash
from src.main import app
from src.models.rental_models import (
    db, User, RentalSpace, Reservation, Review, 
    UserRole, ReservationStatus
)

def populate_database():
    """Populate the database with sample data"""
    
    with app.app_context():
        # Clear existing data
        print("Clearing existing data...")
        db.drop_all()
        db.create_all()
        
        # Create sample users
        print("Creating sample users...")
        
        # Admin user
        admin = User(
            full_name="Admin User",
            email="admin@jrgrahamcenter.org",
            password_hash=generate_password_hash("admin123"),
            role=UserRole.ADMIN
        )
        
        # Customer users
        customers = [
            User(
                full_name="Sarah Johnson",
                email="sarah.johnson@email.com",
                password_hash=generate_password_hash("password123"),
                role=UserRole.CUSTOMER
            ),
            User(
                full_name="Michael Davis",
                email="michael.davis@email.com",
                password_hash=generate_password_hash("password123"),
                role=UserRole.CUSTOMER
            ),
            User(
                full_name="Emily Rodriguez",
                email="emily.rodriguez@email.com",
                password_hash=generate_password_hash("password123"),
                role=UserRole.CUSTOMER
            ),
            User(
                full_name="David Thompson",
                email="david.thompson@email.com",
                password_hash=generate_password_hash("password123"),
                role=UserRole.CUSTOMER
            ),
            User(
                full_name="Lisa Chen",
                email="lisa.chen@email.com",
                password_hash=generate_password_hash("password123"),
                role=UserRole.CUSTOMER
            )
        ]
        
        db.session.add(admin)
        for customer in customers:
            db.session.add(customer)
        
        # Create sample rental spaces
        print("Creating sample rental spaces...")
        
        spaces = [
            RentalSpace(
                name="Main Fellowship Hall",
                description="A spacious fellowship hall perfect for community events, workshops, and gatherings. Features excellent acoustics, modern lighting, and flexible seating arrangements.",
                price_per_hour=75.00,
                capacity=150,
                photos=[
                    "https://res.cloudinary.com/demo/image/upload/v1234567890/fellowship_hall_1.jpg",
                    "https://res.cloudinary.com/demo/image/upload/v1234567890/fellowship_hall_2.jpg"
                ]
            ),
            RentalSpace(
                name="Outdoor Pavilion",
                description="Covered outdoor pavilion ideal for picnics, barbecues, and outdoor celebrations. Includes picnic tables and electrical outlets.",
                price_per_hour=50.00,
                capacity=100,
                photos=[
                    "https://res.cloudinary.com/demo/image/upload/v1234567890/pavilion_1.jpg"
                ]
            ),
            RentalSpace(
                name="Conference Room",
                description="Professional conference room equipped with presentation technology, perfect for business meetings and workshops.",
                price_per_hour=40.00,
                capacity=25,
                photos=[
                    "https://res.cloudinary.com/demo/image/upload/v1234567890/conference_room_1.jpg"
                ]
            ),
            RentalSpace(
                name="Softball Field",
                description="Full-size softball field with dugouts and bleacher seating. Perfect for tournaments and recreational games.",
                price_per_hour=30.00,
                capacity=200,
                photos=[
                    "https://res.cloudinary.com/demo/image/upload/v1234567890/softball_field_1.jpg"
                ]
            ),
            RentalSpace(
                name="Kitchen Facility",
                description="Commercial-grade kitchen facility available for catering and food preparation. Includes all necessary equipment and utensils.",
                price_per_hour=60.00,
                capacity=10,
                photos=[
                    "https://res.cloudinary.com/demo/image/upload/v1234567890/kitchen_1.jpg"
                ]
            )
        ]
        
        for space in spaces:
            db.session.add(space)
        
        db.session.commit()
        
        # Create sample reservations
        print("Creating sample reservations...")
        
        # Get the created spaces and users
        fellowship_hall = RentalSpace.query.filter_by(name="Main Fellowship Hall").first()
        pavilion = RentalSpace.query.filter_by(name="Outdoor Pavilion").first()
        conference_room = RentalSpace.query.filter_by(name="Conference Room").first()
        softball_field = RentalSpace.query.filter_by(name="Softball Field").first()
        
        sarah = User.query.filter_by(email="sarah.johnson@email.com").first()
        michael = User.query.filter_by(email="michael.davis@email.com").first()
        emily = User.query.filter_by(email="emily.rodriguez@email.com").first()
        david = User.query.filter_by(email="david.thompson@email.com").first()
        lisa = User.query.filter_by(email="lisa.chen@email.com").first()
        
        # Past reservations (completed)
        past_reservations = [
            Reservation(
                user_id=sarah.id,
                space_id=fellowship_hall.id,
                start_time=datetime.now() - timedelta(days=5, hours=4),
                end_time=datetime.now() - timedelta(days=5),
                total_price=300.00,
                status=ReservationStatus.CONFIRMED
            ),
            Reservation(
                user_id=michael.id,
                space_id=conference_room.id,
                start_time=datetime.now() - timedelta(days=8, hours=2),
                end_time=datetime.now() - timedelta(days=8),
                total_price=80.00,
                status=ReservationStatus.CONFIRMED
            ),
            Reservation(
                user_id=emily.id,
                space_id=pavilion.id,
                start_time=datetime.now() - timedelta(days=10, hours=3),
                end_time=datetime.now() - timedelta(days=10),
                total_price=150.00,
                status=ReservationStatus.CONFIRMED
            ),
            Reservation(
                user_id=david.id,
                space_id=softball_field.id,
                start_time=datetime.now() - timedelta(days=14, hours=4),
                end_time=datetime.now() - timedelta(days=14),
                total_price=120.00,
                status=ReservationStatus.CONFIRMED
            ),
            Reservation(
                user_id=lisa.id,
                space_id=fellowship_hall.id,
                start_time=datetime.now() - timedelta(days=18, hours=6),
                end_time=datetime.now() - timedelta(days=18),
                total_price=450.00,
                status=ReservationStatus.CONFIRMED
            )
        ]
        
        # Future reservations
        future_reservations = [
            Reservation(
                user_id=sarah.id,
                space_id=pavilion.id,
                start_time=datetime.now() + timedelta(days=7, hours=2),
                end_time=datetime.now() + timedelta(days=7, hours=6),
                total_price=200.00,
                status=ReservationStatus.CONFIRMED
            ),
            Reservation(
                user_id=michael.id,
                space_id=fellowship_hall.id,
                start_time=datetime.now() + timedelta(days=14, hours=3),
                end_time=datetime.now() + timedelta(days=14, hours=7),
                total_price=300.00,
                status=ReservationStatus.PENDING
            )
        ]
        
        for reservation in past_reservations + future_reservations:
            db.session.add(reservation)
        
        db.session.commit()
        
        # Create sample reviews for completed reservations
        print("Creating sample reviews...")
        
        reviews_data = [
            {
                'reservation': past_reservations[0],  # Sarah's fellowship hall
                'rating': 5,
                'comment': "Absolutely wonderful space for our church retreat! The facilities were clean, well-maintained, and perfect for our group activities. The outdoor area was especially great for the kids."
            },
            {
                'reservation': past_reservations[1],  # Michael's conference room
                'rating': 4,
                'comment': "Great venue for our community workshop. Good parking and easy access. The only minor issue was that the air conditioning could have been a bit cooler."
            },
            {
                'reservation': past_reservations[2],  # Emily's pavilion
                'rating': 5,
                'comment': "Perfect for our baby shower! The space was beautiful and accommodated all our guests comfortably. Staff was very helpful with setup."
            },
            {
                'reservation': past_reservations[3],  # David's softball field
                'rating': 4,
                'comment': "Solid choice for our softball tournament. Good field conditions and adequate facilities."
            },
            {
                'reservation': past_reservations[4],  # Lisa's fellowship hall
                'rating': 5,
                'comment': "Exceeded our expectations! The venue was exactly what we needed for our conference. Highly recommend!"
            }
        ]
        
        for review_data in reviews_data:
            review = Review(
                reservation_id=review_data['reservation'].id,
                user_id=review_data['reservation'].user_id,
                space_id=review_data['reservation'].space_id,
                rating=review_data['rating'],
                comment=review_data['comment']
            )
            db.session.add(review)
        
        db.session.commit()
        
        print("Database populated successfully!")
        print(f"Created {len([admin] + customers)} users")
        print(f"Created {len(spaces)} rental spaces")
        print(f"Created {len(past_reservations + future_reservations)} reservations")
        print(f"Created {len(reviews_data)} reviews")
        
        # Print admin credentials
        print("\n" + "="*50)
        print("ADMIN CREDENTIALS:")
        print("Email: admin@jrgrahamcenter.org")
        print("Password: admin123")
        print("="*50)

if __name__ == "__main__":
    populate_database()
