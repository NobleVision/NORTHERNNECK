import React, { useState } from 'react';
import { Calendar, Clock, Users, DollarSign, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import PaymentForm from './PaymentForm';

const BookingForm = ({ space, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    attendees: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    specialRequests: ''
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [reservationId, setReservationId] = useState(null);

  const steps = [
    { id: 1, title: 'Date & Time', icon: Calendar },
    { id: 2, title: 'Details', icon: Users },
    { id: 3, title: 'Payment', icon: DollarSign }
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const handleInputChange = (field, value) => {
    const newData = { ...bookingData, [field]: value };
    setBookingData(newData);
    
    // Calculate total price when date/time changes
    if (field === 'startTime' || field === 'endTime') {
      calculatePrice(newData);
    }
  };

  const calculatePrice = (data) => {
    if (data.startTime && data.endTime && space) {
      const start = parseInt(data.startTime.split(':')[0]);
      const end = parseInt(data.endTime.split(':')[0]);
      const hours = end - start;
      
      if (hours > 0) {
        const price = hours * space.price_per_hour;
        setTotalPrice(price * 100); // Convert to cents for Stripe
      }
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      if (currentStep === 2) {
        // Create reservation before payment
        createReservation();
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const createReservation = async () => {
    // In a real app, this would call your API to create a reservation
    // For demo purposes, we'll simulate this
    const mockReservationId = 'res_' + Math.random().toString(36).substr(2, 9);
    setReservationId(mockReservationId);
  };

  const handlePaymentSuccess = (paymentResult) => {
    if (onSuccess) {
      onSuccess({
        reservationId,
        paymentResult,
        bookingData
      });
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return bookingData.date && bookingData.startTime && bookingData.endTime;
      case 2:
        return bookingData.customerName && bookingData.customerEmail && bookingData.attendees;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date
              </label>
              <input
                type="date"
                value={bookingData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <select
                  value={bookingData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select start time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <select
                  value={bookingData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select end time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            {totalPrice > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-blue-700">Estimated Total:</span>
                  <span className="text-xl font-bold text-blue-900">
                    ${(totalPrice / 100).toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  {bookingData.startTime && bookingData.endTime && 
                    `${parseInt(bookingData.endTime.split(':')[0]) - parseInt(bookingData.startTime.split(':')[0])} hours × $${space.price_per_hour}/hour`
                  }
                </p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={bookingData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={bookingData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={bookingData.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Attendees *
                </label>
                <input
                  type="number"
                  value={bookingData.attendees}
                  onChange={(e) => handleInputChange('attendees', e.target.value)}
                  min="1"
                  max={space.capacity}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="50"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Maximum capacity: {space.capacity} people
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests or Notes
              </label>
              <textarea
                value={bookingData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any special setup requirements, catering needs, etc."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Space:</span>
                  <span className="font-medium">{space.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{bookingData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{bookingData.startTime} - {bookingData.endTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Attendees:</span>
                  <span className="font-medium">{bookingData.attendees} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact:</span>
                  <span className="font-medium">{bookingData.customerName}</span>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <PaymentForm
              amount={totalPrice}
              reservationId={reservationId}
              customerInfo={{
                name: bookingData.customerName,
                email: bookingData.customerEmail
              }}
              onSuccess={handlePaymentSuccess}
              onError={(error) => console.error('Payment error:', error)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Book {space.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {/* Space Info */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>3989 White Chapel Road, Lively, VA</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>Up to {space.capacity} guests</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              <span>${space.price_per_hour}/hour</span>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  <step.icon className="w-4 h-4" />
                </div>
                <span className={`ml-2 text-sm ${
                  currentStep >= step.id ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-gray-300 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderStepContent()}
        </div>

        {/* Footer */}
        {currentStep < 3 && (
          <div className="p-6 border-t bg-gray-50 flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepValid(currentStep)}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
