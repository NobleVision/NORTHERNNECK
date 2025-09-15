from flask import Blueprint, request, jsonify
from src.models.rental_models import db, Payment, Reservation, PaymentStatus, ReservationStatus
from src.services.stripe_service import StripeService
import os

payments_bp = Blueprint('payments', __name__)

@payments_bp.route('/config', methods=['GET'])
def get_stripe_config():
    """Get Stripe publishable key for frontend"""
    try:
        publishable_key = StripeService.get_publishable_key()
        
        if not publishable_key:
            return jsonify({
                'success': False,
                'error': 'Stripe not configured'
            }), 500
        
        return jsonify({
            'success': True,
            'data': {
                'publishable_key': publishable_key
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@payments_bp.route('/create-payment-intent', methods=['POST'])
def create_payment_intent():
    """Create a Stripe Payment Intent for a reservation"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['reservation_id']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Get reservation
        reservation = Reservation.query.get(data['reservation_id'])
        if not reservation:
            return jsonify({
                'success': False,
                'error': 'Reservation not found'
            }), 404
        
        # Check if reservation is in pending status
        if reservation.status != ReservationStatus.PENDING:
            return jsonify({
                'success': False,
                'error': 'Reservation is not in pending status'
            }), 400
        
        # Check if payment already exists
        existing_payment = Payment.query.filter_by(reservation_id=reservation.id).first()
        if existing_payment and existing_payment.status == PaymentStatus.SUCCEEDED:
            return jsonify({
                'success': False,
                'error': 'Payment already completed for this reservation'
            }), 400
        
        # Create payment intent
        metadata = {
            'reservation_id': reservation.id,
            'user_id': reservation.user_id,
            'space_id': reservation.space_id
        }
        
        result = StripeService.create_payment_intent(
            amount=reservation.total_price,
            metadata=metadata
        )
        
        if not result['success']:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 500
        
        # Save payment record
        payment = Payment(
            reservation_id=reservation.id,
            amount=reservation.total_price,
            stripe_payment_intent_id=result['payment_intent']['id'],
            status=PaymentStatus.PENDING
        )
        
        db.session.add(payment)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'client_secret': result['payment_intent']['client_secret'],
                'payment_intent_id': result['payment_intent']['id'],
                'amount': result['payment_intent']['amount'],
                'currency': result['payment_intent']['currency']
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@payments_bp.route('/confirm-payment', methods=['POST'])
def confirm_payment():
    """Confirm a payment and update reservation status"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['payment_intent_id']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Get payment record
        payment = Payment.query.filter_by(
            stripe_payment_intent_id=data['payment_intent_id']
        ).first()
        
        if not payment:
            return jsonify({
                'success': False,
                'error': 'Payment not found'
            }), 404
        
        # Retrieve payment intent from Stripe
        result = StripeService.retrieve_payment_intent(data['payment_intent_id'])
        
        if not result['success']:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 500
        
        stripe_status = result['payment_intent']['status']
        
        # Update payment status based on Stripe status
        if stripe_status == 'succeeded':
            payment.status = PaymentStatus.SUCCEEDED
            
            # Update reservation status to confirmed
            reservation = Reservation.query.get(payment.reservation_id)
            if reservation:
                reservation.status = ReservationStatus.CONFIRMED
            
        elif stripe_status == 'requires_payment_method':
            payment.status = PaymentStatus.FAILED
        else:
            payment.status = PaymentStatus.PENDING
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'payment_status': payment.status.value,
                'stripe_status': stripe_status,
                'reservation_status': reservation.status.value if reservation else None
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@payments_bp.route('/webhook', methods=['POST'])
def stripe_webhook():
    """Handle Stripe webhook events"""
    try:
        payload = request.get_data()
        sig_header = request.headers.get('Stripe-Signature')
        
        if not sig_header:
            return jsonify({
                'success': False,
                'error': 'Missing Stripe signature'
            }), 400
        
        # Construct webhook event
        result = StripeService.construct_webhook_event(payload, sig_header)
        
        if not result['success']:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 400
        
        event = result['event']
        
        # Handle different event types
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            
            # Update payment status
            payment = Payment.query.filter_by(
                stripe_payment_intent_id=payment_intent['id']
            ).first()
            
            if payment:
                payment.status = PaymentStatus.SUCCEEDED
                
                # Update reservation status
                reservation = Reservation.query.get(payment.reservation_id)
                if reservation:
                    reservation.status = ReservationStatus.CONFIRMED
                
                db.session.commit()
        
        elif event['type'] == 'payment_intent.payment_failed':
            payment_intent = event['data']['object']
            
            # Update payment status
            payment = Payment.query.filter_by(
                stripe_payment_intent_id=payment_intent['id']
            ).first()
            
            if payment:
                payment.status = PaymentStatus.FAILED
                db.session.commit()
        
        return jsonify({'success': True}), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@payments_bp.route('/refund', methods=['POST'])
def create_refund():
    """Create a refund for a payment"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['payment_intent_id']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Get payment record
        payment = Payment.query.filter_by(
            stripe_payment_intent_id=data['payment_intent_id']
        ).first()
        
        if not payment:
            return jsonify({
                'success': False,
                'error': 'Payment not found'
            }), 404
        
        if payment.status != PaymentStatus.SUCCEEDED:
            return jsonify({
                'success': False,
                'error': 'Payment was not successful, cannot refund'
            }), 400
        
        # Create refund
        amount = data.get('amount')  # Optional partial refund amount
        reason = data.get('reason', 'requested_by_customer')
        
        result = StripeService.create_refund(
            payment_intent_id=data['payment_intent_id'],
            amount=amount,
            reason=reason
        )
        
        if not result['success']:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 500
        
        # Update reservation status to cancelled if full refund
        if not amount or amount >= payment.amount * 100:  # Full refund
            reservation = Reservation.query.get(payment.reservation_id)
            if reservation:
                reservation.status = ReservationStatus.CANCELLED
                db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'refund_id': result['refund']['id'],
                'amount': result['refund']['amount'],
                'status': result['refund']['status']
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@payments_bp.route('/payments/<reservation_id>', methods=['GET'])
def get_payment_by_reservation(reservation_id):
    """Get payment information for a reservation"""
    try:
        payment = Payment.query.filter_by(reservation_id=reservation_id).first()
        
        if not payment:
            return jsonify({
                'success': False,
                'error': 'Payment not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': payment.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@payments_bp.route('/calculate-fee', methods=['POST'])
def calculate_payment_fee():
    """Calculate payment processing fees"""
    try:
        data = request.get_json()
        
        if 'amount' not in data:
            return jsonify({
                'success': False,
                'error': 'Amount is required'
            }), 400
        
        amount = data['amount']
        fee_calculation = StripeService.calculate_application_fee(amount)
        
        return jsonify({
            'success': True,
            'data': fee_calculation
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
