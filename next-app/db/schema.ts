import { pgEnum, pgTable, uuid, text, integer, numeric, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core'

export const userRole = pgEnum('user_role', ['admin', 'customer'])
export const reservationStatus = pgEnum('reservation_status', ['pending', 'confirmed', 'cancelled'])
export const paymentStatus = pgEnum('payment_status', ['succeeded', 'pending', 'failed'])

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: userRole('role').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true })
})

export const rentalSpaces = pgTable('rental_spaces', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  pricePerHour: numeric('price_per_hour'),
  capacity: integer('capacity'),
  photos: jsonb('photos'),
  createdAt: timestamp('created_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true })
})

export const reservations = pgTable('reservations', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  spaceId: uuid('space_id').references(() => rentalSpaces.id),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }).notNull(),
  totalPrice: numeric('total_price').notNull(),
  status: reservationStatus('status').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true })
})

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey(),
  reservationId: uuid('reservation_id').references(() => reservations.id),
  amount: numeric('amount').notNull(),
  stripePaymentIntentId: text('stripe_payment_intent_id').notNull(),
  status: paymentStatus('status').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
})

export const availability = pgTable('availability', {
  id: uuid('id').primaryKey(),
  spaceId: uuid('space_id').references(() => rentalSpaces.id),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }).notNull(),
  isAvailable: boolean('is_available').notNull()
})

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey(),
  reservationId: uuid('reservation_id').references(() => reservations.id),
  userId: uuid('user_id').references(() => users.id),
  spaceId: uuid('space_id').references(() => rentalSpaces.id),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true })
})

