import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import StarRating from './StarRating'
import { formatDistanceToNow } from 'date-fns'

const ReviewCard = ({ review }) => {
  const { user_name, rating, comment, created_at } = review
  
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return 'Recently'
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm">{user_name}</h4>
                <p className="text-xs text-muted-foreground">
                  {formatDate(created_at)}
                </p>
              </div>
              <StarRating rating={rating} readonly size="sm" />
            </div>
            
            {comment && (
              <p className="text-sm text-foreground leading-relaxed">
                {comment}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ReviewCard
