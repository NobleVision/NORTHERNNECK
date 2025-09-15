import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rentalSpaces, reviews } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'
import { z } from 'zod'

const updateSpaceSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional().nullable(),
  price_per_hour: z.number().positive().optional(),
  capacity: z.number().int().positive().optional(),
  photos: z.array(z.string().url()).optional().nullable(),
})

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    const rows = await db
      .select({
        id: rentalSpaces.id,
        name: rentalSpaces.name,
        description: rentalSpaces.description,
        price_per_hour: rentalSpaces.pricePerHour,
        capacity: rentalSpaces.capacity,
        photos: rentalSpaces.photos,
        created_at: rentalSpaces.createdAt,
        updated_at: rentalSpaces.updatedAt,
        average_rating: sql<number>`COALESCE(AVG(${reviews.rating})::float, 0)`,
        review_count: sql<number>`COUNT(${reviews.id})`,
      })
      .from(rentalSpaces)
      .leftJoin(reviews, eq(reviews.spaceId, rentalSpaces.id))
      .where(eq(rentalSpaces.id, id))
      .groupBy(
        rentalSpaces.id,
        rentalSpaces.name,
        rentalSpaces.description,
        rentalSpaces.pricePerHour,
        rentalSpaces.capacity,
        rentalSpaces.photos,
        rentalSpaces.createdAt,
        rentalSpaces.updatedAt
      )

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Space not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: rows[0] })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message ?? 'Unknown error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    const json = await req.json()
    const parsed = updateSpaceSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 })
    }
    const payload = parsed.data

    const updateData: any = { updatedAt: new Date() }
    if (payload.name !== undefined) updateData.name = payload.name
    if (payload.description !== undefined) updateData.description = payload.description
    if (payload.price_per_hour !== undefined) updateData.pricePerHour = payload.price_per_hour.toString()
    if (payload.capacity !== undefined) updateData.capacity = payload.capacity
    if (payload.photos !== undefined) updateData.photos = payload.photos

    const updated = await db
      .update(rentalSpaces)
      .set(updateData)
      .where(eq(rentalSpaces.id, id))
      .returning({ id: rentalSpaces.id })

    if (updated.length === 0) {
      return NextResponse.json({ success: false, error: 'Space not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: { id: updated[0].id } })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message ?? 'Unknown error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    const deleted = await db
      .delete(rentalSpaces)
      .where(eq(rentalSpaces.id, id))
      .returning({ id: rentalSpaces.id })

    if (deleted.length === 0) {
      return NextResponse.json({ success: false, error: 'Space not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: { id: deleted[0].id } })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message ?? 'Unknown error' }, { status: 500 })
  }
}
