# Cloudflare Pages Deployment Guide

## Deploying Your Investment Portfolio App with Supabase

### Configuration:
- ✅ Next.js with Supabase integration
- ✅ Cloudflare Pages compatible
- ✅ Environment variables support

### Prerequisites:
1. A Cloudflare account
2. Your Supabase project URL and keys
3. GitHub/GitLab repository

### Deployment Steps:

#### Option 1: Cloudflare Dashboard (Recommended)
1. Push your code to GitHub/GitLab
2. Go to Cloudflare Dashboard > Pages > Create a project
3. Connect your repository
4. Use these build settings:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
5. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key
6. Click "Save and Deploy"

#### Option 2: Alternative Hosting
Since your app now uses Supabase (server-side data), you can also deploy to:
- **Vercel** (Recommended for Next.js): `vercel deploy`
- **Netlify**: Connect your repo and add environment variables
- **Railway**: Deploy with automatic environment variable support

### Environment Variables Required:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Test Locally:
```bash
# Make sure .env.local has your Supabase credentials
npm run dev
```

### Important Notes:
- Your app now uses Supabase for real-time data
- Authentication is handled by Supabase Auth
- All data is stored in Supabase PostgreSQL database
- Row Level Security (RLS) policies protect user data
- No localStorage needed for user sessions (Supabase handles it)

### Environment Variables (if needed later):
Add in Cloudflare Dashboard under Settings > Environment variables

### Custom Domain:
Configure in Cloudflare Dashboard > Pages > Custom domains
