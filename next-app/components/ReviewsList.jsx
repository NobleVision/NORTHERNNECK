import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ReviewCard from './ReviewCard'
import StarRating from './StarRating'
import { MessageSquare, TrendingUp, Users } from 'lucide-react'

const ReviewsList = ({ spaceId, spaceName }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockReviews = [
        {
          id: '1',
          user_name: 'Sarah Johnson',
          rating: 5,
          comment: 'Absolutely wonderful space for our church retreat! The facilities were clean, well-maintained, and perfect for our group activities. The outdoor area was especially great for the kids.',
          created_at: '2024-09-10T14:30:00Z'
        },
        {
          id: '2',
          user_name: 'Michael Davis',
          rating: 4,
          comment: 'Great venue for our community workshop. Good parking and easy access. The only minor issue was that the air conditioning could have been a bit cooler.',
          created_at: '2024-09-08T10:15:00Z'
        },
        {
          id: '3',
          user_name: 'Emily Rodriguez',
          rating: 5,
          comment: 'Perfect for our baby shower! The space was beautiful and accommodated all our guests comfortably. Staff was very helpful with setup.',
          created_at: '2024-09-05T16:45:00Z'
        },
        {
          id: '4',
          user_name: 'David Thompson',
          rating: 4,
          comment: 'Solid choice for our softball tournament. Good field conditions and adequate facilities.',
          created_at: '2024-09-01T09:20:00Z'
        },
        {
          id: '5',
          user_name: 'Lisa Chen',
          rating: 5,
          comment: 'Exceeded our expectations! The venue was exactly what we needed for our conference. Highly recommend!',
          created_at: '2024-08-28T13:10:00Z'
        }
      ]
      setReviews(mockReviews)
      setLoading(false)
    }, 1000)
  }, [spaceId])

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach(review => {
      distribution[review.rating]++
    })
    return distribution
  }

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3)
  const averageRating = calculateAverageRating()
  const distribution = getRatingDistribution()

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Reviews & Ratings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {averageRating}
                </div>
                <StarRating rating={Math.round(averageRating)} readonly size="lg" />
                <p className="text-sm text-muted-foreground mt-2">
                  Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = distribution[rating]
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                
                return (
                  <div key={rating} className="flex items-center gap-2 text-sm">
                    <span className="w-8">{rating}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-muted-foreground">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Reviews */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Reviews</h3>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          <div className="space-y-4">
            {displayedReviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {reviews.length > 3 && (
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => setShowAll(!showAll)}
                className="flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                {showAll ? 'Show Less' : `Show All ${reviews.length} Reviews`}
              </Button>
            </div>
          )}
        </div>
      )}

      {reviews.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Reviews Yet</h3>
            <p className="text-muted-foreground">
              Be the first to share your experience at {spaceName}!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ReviewsList
