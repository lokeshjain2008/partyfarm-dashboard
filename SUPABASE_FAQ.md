# Supabase Local Development FAQ

## Your Questions Answered

### 1. How will it be deployed and how to run all migrations on Supabase remote?

**Answer**: Here's the complete deployment workflow:

#### Initial Setup
```bash
# 1. Create a Supabase project at supabase.com
# 2. Link your local project to remote
npx supabase link --project-ref YOUR_PROJECT_REF

# 3. Push all migrations to remote
npx supabase db push
```

#### Ongoing Deployment
```bash
# Deploy new migrations
npm run supabase:push

# Deploy with seed data (for staging)
npx supabase db push --include-seed

# Check what will be deployed
npx supabase db diff --linked
```

#### Production Deployment
- Use CI/CD pipeline (GitHub Actions, etc.)
- Deploy to staging first, then production
- Use database branching for safe deployments (Pro feature)

### 2. What if I use the local Supabase UI and update any resource like schema change, RLS policy change, or config change? How will it be added to version control and synced with remote?

**Answer**: This is the beauty of the local development approach!

#### Schema Changes in Studio UI
```bash
# After making changes in local Studio UI (http://127.0.0.1:54323):

# 1. Generate migration from your changes
npm run supabase:diff -- -f describe_your_changes

# 2. Review the generated migration file in supabase/migrations/
# 3. Test the migration
npm run supabase:reset

# 4. Commit to version control
git add supabase/migrations/
git commit -m "Add: describe your changes"

# 5. Deploy to remote
npm run supabase:push
```

#### RLS Policy Changes
```bash
# Same process - changes in Studio UI are captured
npm run supabase:diff -- -f update_rls_policies

# The generated migration will contain only the policy changes
```

#### Configuration Changes
- Auth settings, storage policies, etc. are in `supabase/config.toml`
- These are automatically version controlled
- Deploy with `npx supabase link` and `npx supabase db push`

### 3. What if I make any change on remote? How will it be synced with local?

**Answer**: You can pull changes from remote to local:

#### Pull Remote Changes
```bash
# Pull schema changes from remote
npm run supabase:pull

# This generates migration files from remote changes
# Review and commit these migrations
```

#### Handle Conflicts
```bash
# Check differences between local and remote
npx supabase db diff --linked

# If there are conflicts, resolve manually and create reconciliation migration
npm run supabase:diff -- --linked -f reconcile_changes
```

#### Nuclear Option - Reset Local to Remote
```bash
# If you want to completely reset local to match remote
npx supabase db reset --linked

# This will:
# 1. Drop local database
# 2. Pull schema from remote  
# 3. Apply all migrations
```

## Key Advantages of This Approach

### 1. Version Control Everything
- All schema changes are in migration files
- All configuration is in `supabase/config.toml`
- Complete history of database evolution
- Easy rollbacks and reviews

### 2. Team Collaboration
- Multiple developers can work on same project
- Merge conflicts are resolved in migration files
- No more "it works on my machine" database issues

### 3. Safe Deployments
- Test all changes locally first
- Staging environment matches production
- Automated deployments with CI/CD
- Database branching for complex changes

### 4. No More Manual Dashboard Changes
- Everything is code-first
- Reproducible environments
- Easy disaster recovery
- Audit trail of all changes

## Recommended Workflow

### Daily Development
1. **Start local**: `npm run supabase:start`
2. **Make changes**: Use Studio UI or write migrations
3. **Capture changes**: `npm run supabase:diff -- -f feature_name`
4. **Test**: `npm run supabase:reset`
5. **Commit**: `git add . && git commit`

### Before Deployment
1. **Pull remote changes**: `npm run supabase:pull`
2. **Resolve conflicts**: Review and merge
3. **Test locally**: `npm run supabase:reset`
4. **Deploy**: `npm run supabase:push`

### Team Synchronization
1. **Pull latest code**: `git pull origin main`
2. **Reset local DB**: `npm run supabase:reset`
3. **Update types**: `npm run supabase:types`

This approach gives you the best of both worlds: the convenience of UI-based development with the safety and collaboration benefits of version-controlled infrastructure-as-code!