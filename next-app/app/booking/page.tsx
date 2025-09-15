'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ReviewForm from '@/components/ReviewForm'
import ReviewsList from '@/components/ReviewsList'
import StarRating from '@/components/StarRating'
import ImageGallery from '@/components/ImageGallery'
import BookingForm from '@/components/BookingForm'
import AdminDashboard from '@/components/AdminDashboard'
import JRGrahamLayout from '@/components/JRGrahamLayout'
import { 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  MessageSquare,
  Star,
  CheckCircle,
  Image as ImageIcon,
  CreditCard,
  Settings,
  Phone,
  Mail
} from 'lucide-react'

interface Space {
  id: string
  name: string
  description?: string
  price_per_hour?: string
  capacity?: number
  photos?: any
  average_rating?: number
  review_count?: number
}

interface BookingSuccess {
  id: string
  message: string
  reservationId?: string
  bookingData?: {
    customerEmail?: string
  }
}

export default function BookingPage() {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [spaces, setSpaces] = useState<Space[]>([])
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState<BookingSuccess | null>(null)
  const [showAdminDashboard, setShowAdminDashboard] = useState(false)

  // Fetch spaces from API
  useEffect(() => {
    fetchSpaces()
  }, [])

  const fetchSpaces = async () => {
    try {
      const response = await fetch('/api/spaces')
      const data = await response.json()
      if (data.success) {
        setSpaces(data.data)
        setSelectedSpace(data.data[0]) // Select first space by default
      }
    } catch (error) {
      console.error('Error fetching spaces:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mock reservation data
  const mockReservation = {
    id: 'reservation-1',
    spaceName: selectedSpace?.name || 'Main Fellowship Hall',
    date: '2024-09-15',
    startTime: '10:00 AM',
    endTime: '2:00 PM',
    status: 'completed'
  }

  const handleReviewSubmit = async (reviewData: any) => {
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log('Review submitted:', reviewData)
      setIsSubmitting(false)
      setShowReviewForm(false)
      // In a real app, you would refresh the reviews list here
    }, 2000)
  }

  const handleBookingSuccess = (bookingResult: BookingSuccess) => {
    setShowBookingForm(false)
    setBookingSuccess(bookingResult)
    // Auto-hide success message after 5 seconds
    setTimeout(() => setBookingSuccess(null), 5000)
  }

  if (loading) {
    return (
      <JRGrahamLayout currentPage="booking">
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading rental spaces...</p>
          </div>
        </div>
      </JRGrahamLayout>
    )
  }

  return (
    <JRGrahamLayout currentPage="booking">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Space Rentals & Booking
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            Book your perfect event space at the Joseph R. Graham Center
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>3989 White Chapel Road, Lively, VA 22507</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>Available for Events & Meetings</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Admin Access */}
        <div className="flex justify-end">
          <Button
            onClick={() => setShowAdminDashboard(true)}
            variant="outline"
            size="default"
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Admin Dashboard
          </Button>
        </div>

        {/* Available Spaces Grid */}
        {spaces.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Choose Your Perfect Space
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {spaces.map((space) => (
                <Card 
                  key={space.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedSpace?.id === space.id
                      ? 'ring-2 ring-purple-600 shadow-lg'
                      : 'hover:ring-1 hover:ring-purple-300'
                  }`}
                  onClick={() => setSelectedSpace(space)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{space.name}</CardTitle>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {space.capacity} people
                      </Badge>
                      <div className="flex items-center gap-1">
                        <StarRating rating={space.average_rating || 0} readonly size="sm" />
                        <span className="text-sm text-gray-600">
                          ({space.review_count || 0})
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="">
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {space.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-purple-600 font-semibold">
                        <Clock className="w-4 h-4" />
                        <span>${space.price_per_hour}/hour</span>
                      </div>
                      <Button 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedSpace(space)
                          setShowBookingForm(true)
                        }}
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Selected Space Details */}
        {selectedSpace && (
          <Card className="border-purple-200">
            <CardHeader className="">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2 text-purple-800">
                    {selectedSpace.name}
                  </CardTitle>
                  <p className="text-gray-600 mb-4">{selectedSpace.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-700">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span>Up to {selectedSpace.capacity} guests</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-700">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      <span>3989 White Chapel Road, Lively, VA</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-700">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span>${selectedSpace.price_per_hour}/hour</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1 bg-purple-100 text-purple-800">
                  <Star className="w-3 h-3 fill-current" />
                  {(selectedSpace.average_rating || 0).toFixed(1)} Rating
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="">
              {/* Image Gallery */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <ImageIcon className="w-5 h-5 text-purple-600" />
                  Space Photos
                </h3>
                
                <ImageGallery
                  images={selectedSpace.photos || []}
                  alt={selectedSpace.name}
                  className="mb-4"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="flex-1 bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                  onClick={() => setShowBookingForm(true)}
                >
                  <CreditCard className="w-4 h-4" />
                  Book This Space
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 border-purple-600 text-purple-600 hover:bg-purple-50 flex items-center gap-2"
                  onClick={() => window.open('https://jrgrahamcenter.org/contact', '_blank')}
                >
                  <Mail className="w-4 h-4" />
                  Contact for Questions
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mock Completed Reservation for Review Demo */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              Recent Reservation Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-green-700">
                  <strong>Space:</strong> {mockReservation.spaceName}
                </p>
                <p className="text-sm text-green-700">
                  <strong>Date:</strong> {mockReservation.date}
                </p>
              </div>
              <div>
                <p className="text-sm text-green-700">
                  <strong>Time:</strong> {mockReservation.startTime} - {mockReservation.endTime}
                </p>
                <p className="text-sm text-green-700">
                  <strong>Status:</strong> Completed
                </p>
              </div>
            </div>
            
            {!showReviewForm && (
              <Button 
                onClick={() => setShowReviewForm(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <MessageSquare className="w-4 h-4" />
                Leave a Review
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Review Form */}
        {showReviewForm && (
          <ReviewForm
            reservationId={mockReservation.id}
            spaceName={mockReservation.spaceName}
            onSubmit={handleReviewSubmit}
            onCancel={() => setShowReviewForm(false)}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Booking Success Notification */}
        {bookingSuccess && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">Booking Confirmed!</h3>
                  <p className="text-green-700">
                    Your reservation for {selectedSpace?.name} has been confirmed. 
                    Reservation ID: {bookingSuccess.reservationId}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    A confirmation email has been sent to {bookingSuccess.bookingData?.customerEmail}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reviews List */}
        <ReviewsList 
          spaceId={selectedSpace?.id || 'space-1'} 
          spaceName={selectedSpace?.name || 'Main Fellowship Hall'}
        />

        {/* Booking Form Modal */}
        {showBookingForm && selectedSpace && (
          <BookingForm
            space={selectedSpace}
            onClose={() => setShowBookingForm(false)}
            onSuccess={handleBookingSuccess}
          />
        )}

        {/* Admin Dashboard */}
        {showAdminDashboard && (
          <AdminDashboard
            onClose={() => setShowAdminDashboard(false)}
          />
        )}
      </div>
    </JRGrahamLayout>
  )
}
