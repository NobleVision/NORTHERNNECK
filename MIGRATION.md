# Migration from Flask + Vite to Next.js

This document outlines the complete migration from a separate Flask backend and Vite frontend to a unified Next.js application.

## 📋 Migration Overview

### Before (Flask + Vite Architecture)
```
├── src/                    # Vite React frontend
├── backend/               # Flask API server
├── Separate deployments  # Frontend: Vercel, Backend: Railway/Render
└── CORS configuration    # Cross-origin requests
```

### After (Unified Next.js Architecture)
```
├── next-app/             # Single Next.js application
│   ├── app/api/         # Serverless API routes
│   ├── components/      # React components
│   └── Single deployment # Vercel with serverless functions
```

## 🔄 Migration Steps Completed

### 1. ✅ Project Structure Migration
- **Created**: `next-app/` directory with Next.js 14 App Router
- **Migrated**: All React components from `src/components/` to `next-app/components/`
- **Converted**: `src/App.jsx` to `next-app/app/page.tsx` with TypeScript
- **Updated**: Import paths and component references

### 2. ✅ Backend API Migration
- **Converted**: Flask routes to Next.js API routes in `app/api/`
- **Migrated**: SQLAlchemy models to Drizzle ORM TypeScript schemas
- **Updated**: Database connection from traditional PostgreSQL to Neon serverless
- **Added**: Zod validation for all API endpoints

### 3. ✅ Database Integration
- **Schema**: Complete Drizzle schema in `next-app/db/schema.ts`
- **Connection**: Neon serverless driver in `next-app/lib/db.ts`
- **Queries**: Edge-compatible SQL queries with proper joins
- **Types**: Full TypeScript integration with runtime validation

### 4. ✅ External Service Integration
- **Cloudinary**: Signed upload API route for direct client uploads
- **Stripe**: Payment intent creation and webhook handling
- **Environment**: Consolidated all variables into single `.env.local`

## 📊 API Endpoints Migration

### Spaces Management
| Flask Route | Next.js Route | Status |
|-------------|---------------|---------|
| `GET /api/spaces` | `GET /api/spaces` | ✅ Migrated |
| `POST /api/spaces` | `POST /api/spaces` | ✅ Migrated |
| `GET /api/spaces/<id>` | `GET /api/spaces/[id]` | ✅ Migrated |
| `PUT /api/spaces/<id>` | `PUT /api/spaces/[id]` | ✅ Migrated |
| `DELETE /api/spaces/<id>` | `DELETE /api/spaces/[id]` | ✅ Migrated |

### Reviews System
| Flask Route | Next.js Route | Status |
|-------------|---------------|---------|
| `GET /api/reviews` | `GET /api/reviews` | ✅ Migrated |
| `POST /api/reviews` | `POST /api/reviews` | ✅ Migrated |

### Reservations
| Flask Route | Next.js Route | Status |
|-------------|---------------|---------|
| `GET /api/reservations` | `GET /api/reservations` | ✅ Migrated |
| `POST /api/reservations` | `POST /api/reservations` | ✅ Migrated |

### Image Management
| Flask Route | Next.js Route | Status |
|-------------|---------------|---------|
| `POST /api/images/sign` | `POST /api/images/sign` | ✅ Migrated |

## 🔧 Technology Stack Changes

### Database Layer
| Before | After | Benefits |
|--------|-------|----------|
| SQLAlchemy | Drizzle ORM | TypeScript-first, better performance |
| psycopg2 | @neondatabase/serverless | Edge compatibility |
| Manual SQL | Type-safe queries | Runtime type checking |

### API Layer
| Before | After | Benefits |
|--------|-------|----------|
| Flask routes | Next.js API routes | Serverless, auto-scaling |
| Flask-CORS | Same-origin | No CORS issues |
| Manual validation | Zod schemas | Runtime type validation |

### Frontend Layer
| Before | After | Benefits |
|--------|-------|----------|
| Vite + React | Next.js App Router | SSR, better SEO |
| Manual API calls | Relative paths | Simplified requests |
| Separate build | Unified build | Single deployment |

## 🚀 Deployment Changes

### Before: Dual Deployment
```bash
# Frontend deployment (Vercel)
cd src && npm run build && vercel deploy

# Backend deployment (Railway/Render)
cd backend && git push railway main
```

### After: Single Deployment
```bash
# Single deployment (Vercel)
cd next-app && vercel deploy
```

## 🔒 Environment Variables Migration

### Before: Split Configuration
```bash
# Frontend (.env.production)
VITE_API_URL=https://backend.railway.app
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Backend (.env)
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_test_...
CLOUDINARY_API_SECRET=...
```

### After: Unified Configuration
```bash
# Single .env.local file
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
CLOUDINARY_API_SECRET=...
```

## ✅ Migration Benefits

### Performance Improvements
- **Edge Functions**: API routes run closer to users
- **SSR/SSG**: Server-side rendering for better initial load
- **Automatic Optimization**: Next.js built-in optimizations
- **Bundle Splitting**: Automatic code splitting

### Developer Experience
- **Type Safety**: End-to-end TypeScript
- **Hot Reload**: Faster development iteration
- **Unified Tooling**: Single package.json and build process
- **Better Debugging**: Integrated error handling

### Operational Benefits
- **Simplified Deployment**: Single application to deploy
- **Cost Efficiency**: Serverless functions scale to zero
- **Better Monitoring**: Unified logging and analytics
- **Easier Maintenance**: Single codebase to maintain

## 🚨 Breaking Changes

### API Endpoints
- **Base URL**: Changed from `http://localhost:5000/api/*` to `/api/*`
- **CORS**: No longer needed (same-origin requests)
- **Error Format**: Standardized error responses with Zod validation

### Environment Variables
- **Consolidation**: All variables now in single `.env.local` file
- **Naming**: Some variable names updated for consistency
- **Security**: Client-side variables no longer need `VITE_` prefix

### Database Connection
- **Driver**: Changed from psycopg2 to @neondatabase/serverless
- **Connection String**: Must include `?sslmode=require` for Neon
- **Pooling**: Automatic connection pooling with serverless driver

## 📋 Post-Migration Checklist

### ✅ Completed
- [x] Next.js application structure created
- [x] All React components migrated
- [x] API routes implemented and tested
- [x] Database schema migrated to Drizzle
- [x] External services integrated (Cloudinary, Stripe)
- [x] Environment variables configured
- [x] Frontend API calls updated
- [x] Documentation updated

### 🔄 In Progress
- [ ] Database populated with sample data
- [ ] Stripe test keys configured
- [ ] End-to-end testing completed

### 📋 Future Tasks
- [ ] Authentication system (next-auth)
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Mobile optimization
- [ ] Performance monitoring

## 🎯 Success Metrics

The migration is considered successful based on:

1. **Functionality**: All original features working in Next.js
2. **Performance**: Improved load times and responsiveness
3. **Maintainability**: Cleaner codebase with TypeScript
4. **Deployment**: Single-command deployment process
5. **Developer Experience**: Faster development iteration

## 📞 Support

For questions about the migration or Next.js implementation:
- Review this documentation
- Check the updated README.md
- Examine the code structure in `next-app/`
- Test API endpoints at `http://localhost:3000/api/*`

---

**Migration completed successfully! 🎉**
