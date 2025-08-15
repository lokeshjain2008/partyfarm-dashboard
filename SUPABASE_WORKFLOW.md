# Supabase Development Workflow

## Making Changes Through Local Studio UI

### 1. Schema Changes Made in Studio UI

When you make schema changes in the local Studio UI (http://127.0.0.1:54323):

```bash
# Generate a new migration from your local database changes
npx supabase db diff --use-migra -f new_migration_name

# This creates a new migration file in supabase/migrations/
# Review the generated SQL before committing
```

### 2. RLS Policy Changes

```bash
# After making RLS changes in Studio UI, capture them:
npx supabase db diff --use-migra -f update_rls_policies

# The diff will show only the policy changes
```

### 3. Configuration Changes

For auth settings, storage policies, etc., these are captured in:
- `supabase/config.toml` - Main configuration
- `supabase/functions/` - Edge functions
- `supabase/storage/` - Storage policies

### 4. Best Practice Workflow

```bash
# 1. Make changes in local Studio UI
# 2. Generate migration from changes
npx supabase db diff -f describe_your_changes

# 3. Review the generated migration file
# 4. Test the migration
npx supabase db reset  # This will replay all migrations

# 5. Commit to version control
git add supabase/migrations/
git commit -m "Add: describe your changes"
```

## Syncing Remote Changes to Local

### 1. Pull Remote Schema Changes

```bash
# If someone else made changes to remote, pull them:
npx supabase db pull

# This generates migration files from remote changes
```

### 2. Handle Conflicts

```bash
# If there are conflicts between local and remote:
npx supabase db diff --linked

# Review differences and resolve manually
# Then create a migration to reconcile
```

### 3. Reset Local to Match Remote

```bash
# Nuclear option - reset local to match remote exactly
npx supabase db reset --linked

# This will:
# 1. Drop local database
# 2. Pull schema from remote
# 3. Apply all migrations
```

## Configuration Management

### supabase/config.toml
This file contains all your project configuration:

```toml
[api]
enabled = true
port = 54321

[auth]
enabled = true
# OAuth providers
[auth.external.google]
enabled = true
client_id = "your-google-client-id"
secret = "your-google-secret"

[auth.sms]
enabled = true
# SMS provider config

[db]
port = 54322

[studio]
enabled = true
port = 54323
```

### Keeping Config in Sync

```bash
# Pull remote config
npx supabase projects api-keys --linked

# Update local config to match remote
npx supabase link --project-ref YOUR_REF
```

## Development Best Practices

### 1. Always Use Migrations
- Never make direct changes to remote database
- Always create migrations for schema changes
- Test migrations locally first

### 2. Use Branches for Features
```bash
# Create feature branch
git checkout -b feature/new-table

# Make changes locally
# Generate migration
npx supabase db diff -f add_new_table

# Test migration
npx supabase db reset

# Commit and push
git add . && git commit -m "Add new table"
git push origin feature/new-table
```

### 3. Code Review Migrations
- Always review generated SQL
- Test migrations on fresh database
- Ensure migrations are reversible when possible

### 4. Environment Parity
```bash
# Keep types in sync
npm run supabase:types  # local
npm run sync:types      # from remote

# Verify schema matches
npx supabase db diff --linked
```

## Troubleshooting

### Migration Conflicts
```bash
# If migrations are out of sync:
npx supabase migration list
npx supabase migration repair --status applied

# Force reset if needed
npx supabase db reset --linked
```

### Schema Drift
```bash
# Check for differences between local and remote
npx supabase db diff --linked

# Generate migration to fix drift
npx supabase db diff --linked -f fix_schema_drift
```