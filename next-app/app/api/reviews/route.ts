import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { reviews, users } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

const createReviewSchema = z.object({
  reservation_id: z.string().uuid(),
  user_id: z.string().uuid(),
  space_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional().nullable(),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const spaceId = searchParams.get('space_id')
  if (!spaceId) {
    return NextResponse.json({ success: false, error: 'space_id is required' }, { status: 400 })
  }
  try {
    const rows = await db
      .select({
        id: reviews.id,
        reservation_id: reviews.reservationId,
        user_id: reviews.userId,
        space_id: reviews.spaceId,
        rating: reviews.rating,
        comment: reviews.comment,
        created_at: reviews.createdAt,
        updated_at: reviews.updatedAt,
        user_name: users.fullName,
      })
      .from(reviews)
      .leftJoin(users, eq(users.id, reviews.userId))
      .where(eq(reviews.spaceId, spaceId))
    return NextResponse.json({ success: true, data: rows })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message ?? 'Unknown error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const parsed = createReviewSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 })
    }
    const payload = parsed.data

    const inserted = await db.insert(reviews).values({
      reservationId: payload.reservation_id,
      userId: payload.user_id,
      spaceId: payload.space_id,
      rating: payload.rating,
      comment: payload.comment ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning({ id: reviews.id })

    return NextResponse.json({ success: true, data: { id: inserted[0].id } }, { status: 201 })
  } catch (e: any) {
    // Unique constraint for reservation_id (one review per reservation) might throw here
    return NextResponse.json({ success: false, error: e.message ?? 'Unknown error' }, { status: 500 })
  }
}

