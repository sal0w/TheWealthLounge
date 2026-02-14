# Deployment Guide - Investment Portfolio with Supabase

## ⚠️ IMPORTANT: Environment Variables Required

Your app **requires** Supabase environment variables to build and run. You must add these to your deployment platform **before** deploying.

### Required Environment Variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://unlexdnlstwwrvtneqkb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable__KfzZbysy3eF49Zj0faI5g_x3Ao1aTv
```

---

## Deployment Options:

### Option 1: Vercel (Recommended for Next.js)

1. **Push your code to GitHub**
2. **Go to [Vercel Dashboard](https://vercel.com/new)**
3. **Import your repository**
4. **Add Environment Variables** (CRITICAL STEP):
   - Click "Environment Variables"
   - Add `NEXT_PUBLIC_SUPABASE_URL` = `https://unlexdnlstwwrvtneqkb.supabase.co`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable__KfzZbysy3eF49Zj0faI5g_x3Ao1aTv`
5. **Click Deploy**

**Build Settings:**
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`

---

### Option 2: Netlify

1. **Push your code to GitHub**
2. **Go to [Netlify Dashboard](https://app.netlify.com/start)**
3. **Import your repository**
4. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
5. **Add Environment Variables** (CRITICAL):
   - Go to Site settings → Environment variables
   - Add `NEXT_PUBLIC_SUPABASE_URL` = `https://unlexdnlstwwrvtneqkb.supabase.co`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable__KfzZbysy3eF49Zj0faI5g_x3Ao1aTv`
6. **Deploy**

---

### Option 3: Cloudflare Pages

1. **Push your code to GitHub**
2. **Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages**
3. **Create a project**
4. **Connect your repository**
5. **Build Settings:**
   - Framework preset: Next.js
   - Build command: `npm run build`
   - Build output directory: `.next`
6. **Environment Variables** (CRITICAL):
   - Add `NEXT_PUBLIC_SUPABASE_URL` = `https://unlexdnlstwwrvtneqkb.supabase.co`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable__KfzZbysy3eF49Zj0faI5g_x3Ao1aTv`
7. **Save and Deploy**

---

## Troubleshooting

### Error: "supabaseUrl is required"
**Cause:** Environment variables are not configured in your deployment platform.

**Solution:**
1. Go to your deployment platform's dashboard
2. Find "Environment Variables" or "Build Settings"
3. Add both required variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Redeploy your application

### Build fails with "Missing Supabase environment variables"
- Double-check variable names (must be exact)
- Ensure variables are set for "Production" environment
- Some platforms require redeployment after adding variables

---

## Security Notes

- ✅ **NEXT_PUBLIC_SUPABASE_ANON_KEY is safe to expose** - it's protected by Row Level Security (RLS) policies
- ❌ **Never commit SUPABASE_SERVICE_KEY** to your repository - it's only for local seeding scripts
- ✅ All user data is protected by RLS policies in Supabase

---

## Test Locally Before Deploying

```bash
# Ensure .env.local has your variables
cat .env.local

# Test the build
npm run build

# Test the production build
npm start
```

### Environment Variables (if needed later):
Add in Cloudflare Dashboard under Settings > Environment variables

### Custom Domain:
Configure in Cloudflare Dashboard > Pages > Custom domains
