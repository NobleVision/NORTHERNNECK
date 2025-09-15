# JR Graham Center - Next.js Rental Booking System

A comprehensive, unified rental booking system built for the JR Graham Center Baptist website. This modern web application consolidates frontend and backend into a single Next.js application, featuring serverless API routes, real-time booking management, payment processing, and customer review system.

## 🌟 Features

### ✅ **Complete Review System with Star Ratings**
- Interactive 5-star rating system with hover effects and visual feedback
- Customer review submission with comments (2000 character limit)
- Review display with user names and timestamps
- Rating distribution analytics and average calculations
- One review per reservation policy to prevent duplicates
- Real-time rating aggregation for spaces

### 🏢 **Advanced Space Management**
- Multiple rental spaces with detailed descriptions and capacity
- Dynamic pricing per hour with real-time calculations
- Professional image galleries with Cloudinary optimization
- Space availability tracking and conflict prevention
- Admin-controlled space creation, editing, and deletion

### 💳 **Secure Payment Processing**
- Stripe integration for secure payment processing
- Multi-step booking flow (Space Selection → Details → Payment)
- Real-time price calculations with tax handling
- Payment intent creation and confirmation tracking
- Webhook support for payment status updates

### 🎛️ **Comprehensive Admin Dashboard**
- Complete space, reservation, and user management
- Real-time analytics and performance metrics
- Revenue tracking and booking trend analysis
- Image upload and management with Cloudinary
- Availability management and block-out dates

### ☁️ **Modern Cloud Architecture**
- **Database**: Neon PostgreSQL with edge-compatible queries
- **Images**: Cloudinary with automatic optimization and transformations
- **Payments**: Stripe with webhook integration
- **Deployment**: Vercel serverless functions

## 🚀 Technology Stack

### Unified Next.js Application
- **Next.js 14** with App Router for modern React development
- **TypeScript** for end-to-end type safety
- **Tailwind CSS** for responsive, utility-first styling
- **Radix UI** (shadcn/ui) for accessible, customizable components
- **Lucide React** for consistent iconography

### Database & ORM
- **Drizzle ORM** with TypeScript-first schema design
- **Neon PostgreSQL** with serverless-compatible connections
- **Edge-compatible queries** for optimal performance
- **Zod validation** for runtime type checking

### External Services
- **Cloudinary** for image storage, optimization, and delivery
- **Stripe** for secure payment processing and webhooks
- **Vercel** for serverless deployment and edge functions

## 📁 Project Structure

```
NORTHERNNECK/
├── next-app/                     # Main Next.js application
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # Root layout component
│   │   ├── page.tsx             # Main booking interface
│   │   ├── globals.css          # Global styles with Tailwind
│   │   └── api/                 # Serverless API routes
│   │       ├── spaces/          # Space management endpoints
│   │       │   ├── route.ts     # GET, POST /api/spaces
│   │       │   └── [id]/route.ts # GET, PUT, DELETE /api/spaces/[id]
│   │       ├── reviews/route.ts # Review system API
│   │       ├── reservations/route.ts # Booking management API
│   │       └── images/sign/route.ts # Cloudinary signed uploads
│   ├── components/              # React components
│   │   ├── StarRating.jsx       # Interactive star rating component
│   │   ├── ReviewForm.jsx       # Review submission form
│   │   ├── ReviewsList.jsx      # Reviews display with analytics
│   │   ├── BookingForm.jsx      # Multi-step booking process
│   │   ├── PaymentForm.jsx      # Stripe payment integration
│   │   ├── AdminDashboard.jsx   # Complete admin interface
│   │   ├── ImageGallery.jsx     # Cloudinary image display
│   │   └── ui/                  # Radix UI components (shadcn/ui)
│   ├── db/                      # Database configuration
│   │   └── schema.ts            # Drizzle ORM schema definitions
│   ├── lib/                     # Utility libraries
│   │   ├── db.ts               # Database connection (Neon)
│   │   ├── cloudinary.ts       # Cloudinary SDK configuration
│   │   └── stripe.ts           # Stripe SDK configuration
│   ├── package.json            # Dependencies and scripts
│   ├── tailwind.config.ts      # Tailwind CSS configuration
│   ├── tsconfig.json           # TypeScript configuration
│   └── .env.local              # Environment variables
├── backend/                     # Legacy Flask API (reference)
│   ├── src/                    # Flask application source
│   ├── requirements.txt        # Python dependencies
│   └── populate_db.py         # Database seeding script
├── create_tables.sql           # Database schema
├── database_schema.md          # Database documentation
└── README.md                   # This documentation
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and pnpm (or npm/yarn)
- Neon PostgreSQL database account
- Cloudinary account for image storage
- Stripe account for payment processing

### 1. Clone and Navigate to Next.js App
```bash
git clone <repository-url>
cd NORTHERNNECK/next-app
```

### 2. Install Dependencies
```bash
# Install all required packages
pnpm install

# Alternative with npm
npm install
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.local.example .env.local

# Edit .env.local with your credentials
```

Required environment variables:
```env
# Database
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 4. Database Setup
```bash
# Connect to your Neon database and run:
psql 'your_database_url' < ../create_tables.sql

# Optional: Populate with sample data using the legacy script
cd ../backend
python populate_db.py
```

### 5. Start Development Server
```bash
cd ../next-app
pnpm dev

# Application will be available at http://localhost:3000
```

## 🌐 API Endpoints

The Next.js application provides the following serverless API routes:

### Spaces Management
```typescript
GET    /api/spaces              # List all spaces with ratings
POST   /api/spaces              # Create new space (admin)
GET    /api/spaces/[id]         # Get specific space details
PUT    /api/spaces/[id]         # Update space (admin)
DELETE /api/spaces/[id]         # Delete space (admin)
```

### Reviews System
```typescript
GET    /api/reviews?space_id=1  # Get reviews for a space
POST   /api/reviews             # Submit new review
```

### Reservations
```typescript
GET    /api/reservations        # List reservations (with filters)
POST   /api/reservations        # Create new reservation
```

### Image Management
```typescript
POST   /api/images/sign         # Get Cloudinary signed upload URL
```

### Example API Response
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Main Fellowship Hall",
      "description": "Large hall perfect for events",
      "capacity": 200,
      "price_per_hour": 150,
      "average_rating": 4.8,
      "review_count": 24
    }
  ]
}
```

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Environment**: Set all environment variables in Vercel dashboard
3. **Deploy**: Automatic deployment on push to main branch
4. **Domain**: Configure custom domain if needed

### Environment Variables for Production
```env
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Build Commands
```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Run type checking
pnpm type-check
```

## 📊 Database Schema

The system uses a comprehensive PostgreSQL schema with Drizzle ORM:

### Core Tables
- **users** - Customer and admin user accounts with role-based access
- **rental_spaces** - Available spaces with pricing and capacity
- **reservations** - Booking records with status tracking and timestamps
- **payments** - Stripe payment transaction records
- **reviews** - Customer reviews with star ratings and comments
- **availability** - Space availability and block-out dates

### Key Relationships
```sql
users (1) ←→ (many) reservations
rental_spaces (1) ←→ (many) reservations
reservations (1) ←→ (1) payments
reservations (1) ←→ (1) reviews
rental_spaces (1) ←→ (many) reviews
```

See `database_schema.md` for detailed schema documentation.

## 🎯 Migration from Flask + Vite to Next.js

### What Changed
- **Architecture**: Consolidated from separate Flask backend + Vite frontend to unified Next.js application
- **API Routes**: Converted Flask routes to Next.js serverless API routes
- **Database**: Migrated from SQLAlchemy to Drizzle ORM with TypeScript
- **Deployment**: Single application deployable to Vercel instead of separate services
- **Type Safety**: End-to-end TypeScript with runtime validation

### Benefits of Migration
- **Simplified Deployment**: Single codebase, single deployment target
- **Better Performance**: Edge functions and optimized React Server Components
- **Type Safety**: Full TypeScript integration from database to frontend
- **Developer Experience**: Hot reload, better debugging, unified tooling
- **Cost Efficiency**: Serverless functions scale to zero, reducing hosting costs

### Breaking Changes
- API endpoints remain the same, but now served from `/api/*` instead of separate backend
- Environment variables consolidated into single `.env.local` file
- Database connection uses Neon serverless driver instead of traditional PostgreSQL

## 🎯 Key Features Implemented

### ✅ Complete Review System
- ⭐ Interactive 5-star rating with hover effects and visual feedback
- 💬 Comment system with 2000 character limit and validation
- 📊 Real-time rating aggregation and analytics
- 👤 User name display with review timestamps
- 🔒 One review per reservation policy enforcement

### ✅ Advanced Booking System
- 📅 Real-time availability checking with conflict prevention
- 💰 Dynamic pricing calculations with hourly rates
- � Multi-step booking process with form validation
- 📧 Booking confirmation system (ready for email integration)
- � Stripe payment integration with webhook support

### ✅ Comprehensive Admin Features
- 📈 Revenue and booking analytics dashboard
- 🏢 Complete CRUD operations for space management
- 👥 User and reservation management interface
- 📸 Cloudinary image upload and management
- 🎛️ Real-time system monitoring and controls

### ✅ Modern UI/UX
- � Fully responsive design with mobile-first approach
- 🎨 Modern design system with Tailwind CSS and Radix UI
- ♿ Accessibility features with ARIA labels and keyboard navigation
- 🌙 Dark/light mode support (ready for implementation)
- ⚡ Optimized performance with Next.js optimizations

## 🔧 Development Workflow

### Local Development
```bash
# Start development server with hot reload
pnpm dev

# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Build for production testing
pnpm build && pnpm start
```

### Database Management
```bash
# Generate new migration
pnpm drizzle-kit generate:pg

# Push schema changes
pnpm drizzle-kit push:pg

# View database in Drizzle Studio
pnpm drizzle-kit studio
```

## 🚨 Troubleshooting

### Common Issues
1. **Database Connection**: Ensure DATABASE_URL includes `?sslmode=require` for Neon
2. **Environment Variables**: Check all required variables are set in `.env.local`
3. **Cloudinary Images**: Verify API keys and cloud name configuration
4. **Stripe Webhooks**: Ensure webhook endpoint is configured in Stripe dashboard

### Debug Mode
```bash
# Enable debug logging
DEBUG=1 pnpm dev

# Check API route responses
curl -v http://localhost:3000/api/spaces
```

## 📝 License

This project is developed for the JR Graham Center. All rights reserved.

## 🤝 Contributing

This is a private project for the JR Graham Center. For questions or support, please contact the development team.

---

**Built with ❤️ for the JR Graham Center community using modern Next.js architecture**
