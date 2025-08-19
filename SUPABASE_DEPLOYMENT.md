# Supabase Deployment Guide

## 1. Setting up Remote Project

### Create Remote Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project reference ID (found in project settings)

### Link Local to Remote

```bash
# Link your local project to remote
npx supabase link --project-ref jxhvvrasqxzqtcmrwisr

# This will prompt for your database password
# Database password: y#5U#hW6XmKKBpE
# ✅ Successfully linked to lokeshjain2008 supabase@gmail.com's Project
```

### Deploy Migrations to Remote

```bash
# Reset remote database and push all local migrations (DESTRUCTIVE)
npx supabase db reset --linked

# For future updates, use:
npx supabase db push

# ✅ Successfully deployed:
# - 20241108000001_create_enums.sql
# - 20241108000002_create_tables.sql
# - 20241108000003_enable_rls.sql
# - 20241108000004_create_rls_policies.sql
# - seed.sql (test data)
```

## 2. Environment Configuration

### Production Environment Variables

Create `.env.production` for production:

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
```

### Deployment Scripts

Add to package.json:

```json
{
	"scripts": {
		"deploy:db": "supabase db push",
		"deploy:functions": "supabase functions deploy",
		"sync:types": "supabase gen types typescript --linked > src/lib/types/database.ts"
	}
}
```

## 3. CI/CD Pipeline Example

### GitHub Actions Workflow

```yaml
name: Deploy to Supabase
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: supabase/setup-cli@v1
      - run: supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
      - run: supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}
```

## 4. Best Practices

### Migration Workflow

1. **Always develop locally first**
2. **Test migrations locally**
3. **Review migration files before pushing**
4. **Use staging environment for testing**
5. **Deploy to production only after thorough testing**

### Database Branching (Pro Feature)

```bash
# Create a preview branch for testing
npx supabase branches create feature-branch

# Deploy to branch
npx supabase db push --linked --branch feature-branch

# Merge to main after testing
npx supabase branches merge feature-branch
```
