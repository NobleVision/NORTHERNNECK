import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rentalSpaces, reviews } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'

export async function GET() {
  try {
    // Get all spaces first
    const spaces = await db.select().from(rentalSpaces)
    
    // Get review aggregates for each space
    const spacesWithReviews = await Promise.all(
      spaces.map(async (space) => {
        const reviewStats = await db
          .select({
            average_rating: sql<number>`COALESCE(AVG(${reviews.rating})::float, 0)`,
            review_count: sql<number>`COUNT(${reviews.id})`
          })
          .from(reviews)
          .where(eq(reviews.spaceId, space.id))
        
        return {
          id: space.id,
          name: space.name,
          description: space.description,
          price_per_hour: space.pricePerHour,
          capacity: space.capacity,
          photos: space.photos,
          average_rating: reviewStats[0]?.average_rating || 0,
          review_count: reviewStats[0]?.review_count || 0
        }
      })
    )
    
    const rows = spacesWithReviews

    return NextResponse.json({ success: true, data: rows }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message ?? 'Unknown error' }, { status: 500 })
  }
}

