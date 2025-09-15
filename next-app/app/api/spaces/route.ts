import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rentalSpaces, reviews } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'

export async function GET() {
  try {
    // Left join reviews to compute aggregates
    const rows = await db
      .select({
        id: rentalSpaces.id,
        name: rentalSpaces.name,
        description: rentalSpaces.description,
        price_per_hour: rentalSpaces.pricePerHour,
        capacity: rentalSpaces.capacity,
        photos: rentalSpaces.photos,
        average_rating: sql<number>`COALESCE(AVG(${reviews.rating})::float, 0)` ,
        review_count: sql<number>`COUNT(${reviews.id})`
      })
      .from(rentalSpaces)
      .leftJoin(reviews, eq(reviews.spaceId, rentalSpaces.id))
      .groupBy(
        rentalSpaces.id,
        rentalSpaces.name,
        rentalSpaces.description,
        rentalSpaces.pricePerHour,
        rentalSpaces.capacity,
        rentalSpaces.photos
      )

    return NextResponse.json({ success: true, data: rows }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message ?? 'Unknown error' }, { status: 500 })
  }
}

