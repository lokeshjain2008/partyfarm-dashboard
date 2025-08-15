# Supabase Setup Instructions

## Prerequisites

1. **Docker Desktop**: Install Docker Desktop from [https://docs.docker.com/desktop](https://docs.docker.com/desktop)
2. **Node.js**: Ensure you have Node.js installed

## Local Development Setup

### 1. Start Supabase Local Development

```bash
# Start the local Supabase stack
npm run supabase:start
```

This will:
- Start PostgreSQL database
- Start Supabase services (Auth, API, etc.)
- Apply all migrations from `supabase/migrations/`
- Display local URLs and keys

### 2. Environment Configuration

The `.env.local` file is already configured for local development:
- `PUBLIC_SUPABASE_URL=http://127.0.0.1:54321`
- `PUBLIC_SUPABASE_ANON_KEY=<local_anon_key>`

### 3. Generate TypeScript Types

After starting Supabase, generate types from your schema:

```bash
npm run supabase:types
```

This updates `src/lib/types/database.ts` with the latest schema types.

## Database Schema

The database includes the following tables:
- `organizations` - Organization management
- `users` - User accounts with role-based access
- `properties` - Farmhouse/venue properties
- `bookings` - Booking management
- `payment_transactions` - Payment tracking
- `availability` - Property availability calendar

## Row Level Security (RLS)

All tables have RLS enabled with policies for:
- Role-based access control
- Organization-level data isolation
- Property-level permissions
- Secure multi-tenancy

## Useful Commands

```bash
# Reset database (drops all data and re-runs migrations)
npm run supabase:reset

# Stop Supabase services
npm run supabase:stop

# View Supabase dashboard
# Open http://127.0.0.1:54323 in your browser
```

## Production Setup

For production deployment:

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Update environment variables with production URLs and keys
3. Run migrations in production using Supabase CLI or dashboard
4. Configure authentication providers (Google OAuth, SMS)

## Troubleshooting

### Docker Issues
- Ensure Docker Desktop is running
- Check Docker has sufficient resources allocated
- Try `docker system prune` if you encounter space issues

### Migration Issues
- Check migration files in `supabase/migrations/`
- Use `npm run supabase:reset` to start fresh
- Verify SQL syntax in migration files

### Type Generation Issues
- Ensure Supabase is running locally
- Check database connection
- Verify schema is properly applied