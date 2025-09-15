import os
import stripe
from dotenv import load_dotenv
from decimal import Decimal

# Load environment variables
load_dotenv()

# Configure Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

class StripeService:
    """Service class for handling Stripe payment operations"""
    
    @staticmethod
    def create_payment_intent(amount, currency='usd', metadata=None):
        """
        Create a Stripe Payment Intent
        
        Args:
            amount: Amount in cents (e.g., 2000 for $20.00)
            currency: Currency code (default: 'usd')
            metadata: Additional metadata for the payment
            
        Returns:
            dict: Payment intent data or error
        """
        try:
            # Convert amount to cents if it's a decimal (dollars)
            if isinstance(amount, (Decimal, float)):
                amount_cents = int(amount * 100)
            else:
                amount_cents = int(amount)
            
            payment_intent = stripe.PaymentIntent.create(
                amount=amount_cents,
                currency=currency,
                metadata=metadata or {},
                automatic_payment_methods={
                    'enabled': True,
                },
            )
            
            return {
                'success': True,
                'payment_intent': {
                    'id': payment_intent.id,
                    'client_secret': payment_intent.client_secret,
                    'amount': payment_intent.amount,
                    'currency': payment_intent.currency,
                    'status': payment_intent.status
                }
            }
            
        except stripe.error.StripeError as e:
            return {
                'success': False,
                'error': str(e),
                'error_type': type(e).__name__
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'error_type': 'UnknownError'
            }
    
    @staticmethod
    def confirm_payment_intent(payment_intent_id, payment_method_id=None):
        """
        Confirm a Payment Intent
        
        Args:
            payment_intent_id: The Payment Intent ID to confirm
            payment_method_id: Optional payment method ID
            
        Returns:
            dict: Confirmation result
        """
        try:
            confirm_params = {}
            if payment_method_id:
                confirm_params['payment_method'] = payment_method_id
            
            payment_intent = stripe.PaymentIntent.confirm(
                payment_intent_id,
                **confirm_params
            )
            
            return {
                'success': True,
                'payment_intent': {
                    'id': payment_intent.id,
                    'status': payment_intent.status,
                    'amount': payment_intent.amount,
                    'currency': payment_intent.currency
                }
            }
            
        except stripe.error.StripeError as e:
            return {
                'success': False,
                'error': str(e),
                'error_type': type(e).__name__
            }
    
    @staticmethod
    def retrieve_payment_intent(payment_intent_id):
        """
        Retrieve a Payment Intent
        
        Args:
            payment_intent_id: The Payment Intent ID to retrieve
            
        Returns:
            dict: Payment Intent data or error
        """
        try:
            payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            
            return {
                'success': True,
                'payment_intent': {
                    'id': payment_intent.id,
                    'status': payment_intent.status,
                    'amount': payment_intent.amount,
                    'currency': payment_intent.currency,
                    'created': payment_intent.created,
                    'metadata': payment_intent.metadata
                }
            }
            
        except stripe.error.StripeError as e:
            return {
                'success': False,
                'error': str(e),
                'error_type': type(e).__name__
            }
    
    @staticmethod
    def cancel_payment_intent(payment_intent_id):
        """
        Cancel a Payment Intent
        
        Args:
            payment_intent_id: The Payment Intent ID to cancel
            
        Returns:
            dict: Cancellation result
        """
        try:
            payment_intent = stripe.PaymentIntent.cancel(payment_intent_id)
            
            return {
                'success': True,
                'payment_intent': {
                    'id': payment_intent.id,
                    'status': payment_intent.status
                }
            }
            
        except stripe.error.StripeError as e:
            return {
                'success': False,
                'error': str(e),
                'error_type': type(e).__name__
            }
    
    @staticmethod
    def create_customer(email, name=None, metadata=None):
        """
        Create a Stripe Customer
        
        Args:
            email: Customer email address
            name: Customer name
            metadata: Additional metadata
            
        Returns:
            dict: Customer data or error
        """
        try:
            customer_data = {'email': email}
            if name:
                customer_data['name'] = name
            if metadata:
                customer_data['metadata'] = metadata
            
            customer = stripe.Customer.create(**customer_data)
            
            return {
                'success': True,
                'customer': {
                    'id': customer.id,
                    'email': customer.email,
                    'name': customer.name,
                    'created': customer.created
                }
            }
            
        except stripe.error.StripeError as e:
            return {
                'success': False,
                'error': str(e),
                'error_type': type(e).__name__
            }
    
    @staticmethod
    def create_refund(payment_intent_id, amount=None, reason=None):
        """
        Create a refund for a payment
        
        Args:
            payment_intent_id: The Payment Intent ID to refund
            amount: Amount to refund in cents (None for full refund)
            reason: Reason for the refund
            
        Returns:
            dict: Refund data or error
        """
        try:
            refund_data = {'payment_intent': payment_intent_id}
            if amount:
                refund_data['amount'] = int(amount)
            if reason:
                refund_data['reason'] = reason
            
            refund = stripe.Refund.create(**refund_data)
            
            return {
                'success': True,
                'refund': {
                    'id': refund.id,
                    'amount': refund.amount,
                    'currency': refund.currency,
                    'status': refund.status,
                    'reason': refund.reason
                }
            }
            
        except stripe.error.StripeError as e:
            return {
                'success': False,
                'error': str(e),
                'error_type': type(e).__name__
            }
    
    @staticmethod
    def construct_webhook_event(payload, sig_header, webhook_secret=None):
        """
        Construct and verify a webhook event
        
        Args:
            payload: The request body
            sig_header: The Stripe-Signature header
            webhook_secret: The webhook secret (optional, uses env var if not provided)
            
        Returns:
            dict: Event data or error
        """
        try:
            secret = webhook_secret or os.getenv('STRIPE_WEBHOOK_SECRET')
            if not secret:
                return {
                    'success': False,
                    'error': 'Webhook secret not configured'
                }
            
            event = stripe.Webhook.construct_event(
                payload, sig_header, secret
            )
            
            return {
                'success': True,
                'event': event
            }
            
        except ValueError as e:
            return {
                'success': False,
                'error': 'Invalid payload',
                'error_type': 'ValueError'
            }
        except stripe.error.SignatureVerificationError as e:
            return {
                'success': False,
                'error': 'Invalid signature',
                'error_type': 'SignatureVerificationError'
            }
    
    @staticmethod
    def calculate_application_fee(amount, fee_percentage=2.9, fixed_fee=30):
        """
        Calculate Stripe application fee
        
        Args:
            amount: Amount in cents
            fee_percentage: Fee percentage (default: 2.9%)
            fixed_fee: Fixed fee in cents (default: 30 cents)
            
        Returns:
            dict: Fee calculation
        """
        if isinstance(amount, (Decimal, float)):
            amount_cents = int(amount * 100)
        else:
            amount_cents = int(amount)
        
        percentage_fee = int(amount_cents * (fee_percentage / 100))
        total_fee = percentage_fee + fixed_fee
        net_amount = amount_cents - total_fee
        
        return {
            'gross_amount': amount_cents,
            'percentage_fee': percentage_fee,
            'fixed_fee': fixed_fee,
            'total_fee': total_fee,
            'net_amount': net_amount,
            'fee_percentage': fee_percentage
        }
    
    @staticmethod
    def get_publishable_key():
        """
        Get the Stripe publishable key for frontend use
        
        Returns:
            str: Publishable key
        """
        return os.getenv('STRIPE_PUBLISHABLE_KEY')
