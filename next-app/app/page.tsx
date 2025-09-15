'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ReviewForm from '@/components/ReviewForm'
import ReviewsList from '@/components/ReviewsList'
import StarRating from '@/components/StarRating'
import ImageGallery from '@/components/ImageGallery'
import ImageUpload from '@/components/ImageUpload'
import BookingForm from '@/components/BookingForm'
import AdminDashboard from '@/components/AdminDashboard'
import { 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  MessageSquare,
  Star,
  CheckCircle,
  Image as ImageIcon,
  Upload,
  CreditCard,
  Settings
} from 'lucide-react'

export default function Page() {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [spaces, setSpaces] = useState([])
  const [selectedSpace, setSelectedSpace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(null)
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

  const handleReviewSubmit = async (reviewData) => {
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log('Review submitted:', reviewData)
      setIsSubmitting(false)
      setShowReviewForm(false)
      // In a real app, you would refresh the reviews list here
    }, 2000)
  }

  const handleImageUpload = async (files) => {
    // Mock upload function - replace with actual API call to your backend
    const results = []
    
    for (const file of files) {
      try {
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        results.push({
          success: true,
          fileName: file.name,
          url: URL.createObjectURL(file) // In real app, this would be the Cloudinary URL
        })
      } catch (error) {
        results.push({
          success: false,
          fileName: file.name,
          error: 'Upload failed'
        })
      }
    }
    
    return results
  }

  const handleBookingSuccess = (bookingResult) => {
    setShowBookingForm(false)
    setBookingSuccess(bookingResult)
    // Auto-hide success message after 5 seconds
    setTimeout(() => setBookingSuccess(null), 5000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading spaces...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">JR Graham Center</h1>
            <p className="text-xl opacity-90">Next.js Rental Booking System</p>
          </div>
          <button
            onClick={() => setShowAdminDashboard(true)}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Admin Dashboard
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Space Selector */}
        {spaces.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Select a Space to View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {spaces.map((space) => (
                  <button
                    key={space.id}
                    onClick={() => setSelectedSpace(space)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedSpace?.id === space.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <h4 className="font-medium">{space.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      ${space.price_per_hour}/hour • {space.capacity} people
                    </p>
                    <div className="flex items-center mt-2">
                      <StarRating rating={space.average_rating} readonly size="sm" />
                      <span className="text-sm text-muted-foreground ml-2">
                        ({space.review_count} reviews)
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selected Space Information with Image Gallery */}
        {selectedSpace && (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{selectedSpace.name}</CardTitle>
                  <p className="text-muted-foreground mb-4">{selectedSpace.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Up to {selectedSpace.capacity} guests</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>3989 White Chapel Road, Lively, VA</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>${selectedSpace.price_per_hour}/hour</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  {selectedSpace.average_rating.toFixed(1)} Rating
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Image Gallery */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Photos ({selectedSpace.photos?.length || 0})
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowImageUpload(!showImageUpload)}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Images
                  </Button>
                </div>
                
                <ImageGallery
                  images={selectedSpace.photos || []}
                  alt={selectedSpace.name}
                  className="mb-4"
                />
                
                {/* Image Upload Section */}
                {showImageUpload && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Upload New Images (Admin)</h4>
                    <ImageUpload
                      onUpload={handleImageUpload}
                      multiple={true}
                      maxFiles={5}
                      maxSizeMB={5}
                    />
                  </div>
                )}
              </div>

              <Button 
                className="w-full flex items-center gap-2"
                onClick={() => setShowBookingForm(true)}
              >
                <CreditCard className="w-4 h-4" />
                Book This Space
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Mock Completed Reservation */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              Recent Reservation Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                className="flex items-center gap-2"
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
                    A confirmation email has been sent to {bookingSuccess.bookingData.customerEmail}
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
    </div>
  )
}
