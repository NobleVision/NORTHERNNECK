import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { reservations, rentalSpaces, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const createReservationSchema = z.object({
  user_id: z.string().uuid(),
  space_id: z.string().uuid(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  total_price: z.number().positive(),
  status: z.enum(['pending', 'confirmed', 'cancelled']).default('pending'),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('user_id')
  const spaceId = searchParams.get('space_id')

  try {
    const base = db
      .select({
        id: reservations.id,
        user_id: reservations.userId,
        space_id: reservations.spaceId,
        start_time: reservations.startTime,
        end_time: reservations.endTime,
        total_price: reservations.totalPrice,
        status: reservations.status,
        created_at: reservations.createdAt,
        updated_at: reservations.updatedAt,
        space_name: rentalSpaces.name,
        user_name: users.fullName,
      })
      .from(reservations)
      .leftJoin(rentalSpaces, eq(rentalSpaces.id, reservations.spaceId))
      .leftJoin(users, eq(users.id, reservations.userId))

    const rows = await (
      userId
        ? base.where(eq(reservations.userId, userId))
        : spaceId
          ? base.where(eq(reservations.spaceId, spaceId))
          : base
    )

    return NextResponse.json({ success: true, data: rows })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message ?? 'Unknown error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const parsed = createReservationSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 })
    }
    const payload = parsed.data

    const inserted = await db.insert(reservations).values({
      userId: payload.user_id,
      spaceId: payload.space_id,
      startTime: new Date(payload.start_time),
      endTime: new Date(payload.end_time),
      totalPrice: payload.total_price.toString(),
      status: payload.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning({ id: reservations.id })

    return NextResponse.json({ success: true, data: { id: inserted[0].id } }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message ?? 'Unknown error' }, { status: 500 })
  }
}
