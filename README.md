# JR Graham Center - Rental Booking System

A comprehensive rental booking system built for the JR Graham Center Baptist website, featuring modern web technologies, payment processing, and review management.

## 🌟 Features

### ✅ **Review System with Star Ratings** (As Requested)
- Interactive 5-star rating system with hover effects
- Customer review submission with comments (500 character limit)
- Review display with user avatars and timestamps
- Rating distribution analytics and average calculations
- One review per reservation to prevent duplicates

### 🏢 **Space Management**
- Multiple rental spaces (Fellowship Hall, Outdoor Pavilion, Conference Room, etc.)
- Dynamic pricing and capacity management
- Real-time availability checking
- Professional image galleries with Cloudinary integration

### 💳 **Payment Processing**
- Stripe integration for secure payment processing
- Multi-step booking flow (Date & Time → Details → Payment)
- Real-time price calculations
- Payment confirmation and tracking

### 🎛️ **Admin Dashboard**
- Complete space, reservation, and user management
- Real-time analytics and performance metrics
- Revenue tracking and booking trends
- Image upload and management tools

### ☁️ **Cloud Integration**
- **Database**: PostgreSQL (Neon) for reliable data storage
- **Images**: Cloudinary for optimized image delivery
- **Payments**: Stripe for secure payment processing

## 🚀 Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **shadcn/ui** for modern, accessible components
- **Tailwind CSS** for responsive styling
- **Lucide React** for consistent iconography

### Backend
- **Flask** with SQLAlchemy ORM
- **PostgreSQL** database with proper relationships
- **Cloudinary SDK** for image management
- **Stripe SDK** for payment processing
- **Flask-CORS** for frontend integration

## 📁 Project Structure

```
NORTHERNNECK/
├── src/                          # Frontend React application
│   ├── App.jsx                   # Main application component
│   ├── components/
│   │   ├── StarRating.jsx        # Interactive star rating component
│   │   ├── ReviewForm.jsx        # Review submission form
│   │   ├── ReviewsList.jsx       # Reviews display with analytics
│   │   ├── BookingForm.jsx       # Multi-step booking process
│   │   ├── PaymentForm.jsx       # Stripe payment integration
│   │   ├── AdminDashboard.jsx    # Complete admin interface
│   │   ├── ImageGallery.jsx      # Cloudinary image display
│   │   └── ui/                   # shadcn/ui components
│   └── ...
├── backend/                      # Flask API server
│   ├── src/
│   │   ├── main.py              # Main Flask application
│   │   ├── models/
│   │   │   └── rental_models.py # Database models
│   │   ├── routes/
│   │   │   ├── spaces.py        # Space management API
│   │   │   ├── reviews.py       # Review system API
│   │   │   ├── reservations.py  # Booking management API
│   │   │   ├── payments.py      # Stripe payment API
│   │   │   └── admin.py         # Admin dashboard API
│   │   └── services/
│   │       ├── cloudinary_service.py # Image management
│   │       └── stripe_service.py     # Payment processing
│   ├── requirements.txt         # Python dependencies
│   └── populate_db.py          # Sample data script
├── create_tables.sql           # Database schema
├── database_schema.md          # Database documentation
└── README.md                   # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and pnpm
- Python 3.11+
- PostgreSQL database (Neon recommended)
- Cloudinary account
- Stripe account

### 1. Frontend Setup
```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database and API credentials

# Run the Flask server
python src/main.py
```

### 3. Database Setup
```bash
# Connect to your PostgreSQL database and run:
psql 'your_database_url' < create_tables.sql
psql 'your_database_url' < add_reviews_table.sql

# Populate with sample data
python populate_db.py
```

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@host:port/database
SECRET_KEY=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-api.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy the `backend/` directory
4. Update frontend API URL to point to deployed backend

## 📊 Database Schema

The system uses a comprehensive PostgreSQL schema with the following main tables:

- **users** - Customer and admin user accounts
- **rental_spaces** - Available spaces for booking
- **reservations** - Booking records with status tracking
- **payments** - Payment transaction records
- **reviews** - Customer reviews with star ratings
- **space_images** - Cloudinary image references

See `database_schema.md` for detailed schema documentation.

## 🎯 Key Features Implemented

### Review System (As Requested)
- ⭐ Interactive 5-star rating with visual feedback
- 💬 Comment system with character limits
- 📊 Rating distribution and analytics
- 👤 User avatars and review timestamps
- 🔒 One review per reservation policy

### Booking System
- 📅 Real-time availability checking
- 💰 Dynamic pricing calculations
- 📧 Email confirmations (ready for integration)
- 🔄 Multi-step booking process

### Admin Features
- 📈 Revenue and booking analytics
- 🏢 Complete space management
- 👥 User and reservation management
- 📸 Image upload and management

## 🔮 Future Enhancements

- Advanced search and filtering
- Interactive calendar view
- User account system with booking history
- Automated email notifications
- Role-based access control
- Cancellation policy management
- Mobile app development

## 📝 License

This project is developed for the JR Graham Center. All rights reserved.

## 🤝 Contributing

This is a private project for the JR Graham Center. For questions or support, please contact the development team.

---

**Built with ❤️ for the JR Graham Center community**
