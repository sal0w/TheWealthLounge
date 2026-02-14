# Cloudflare Pages Deployment Guide

## Your app is now configured for Cloudflare Pages!

### Configuration Applied:
- ✅ Static export enabled in next.config.ts
- ✅ Image optimization disabled (required for static export)
- ✅ Build scripts added to package.json
- ✅ Wrangler configuration file created

### Deployment Options:

#### Option 1: Cloudflare Dashboard (Recommended)
1. Push your code to GitHub/GitLab
2. Go to Cloudflare Dashboard > Pages > Create a project
3. Connect your repository
4. Use these build settings:
   - **Framework preset**: Next.js (Static HTML Export)
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Node version**: `20.x`
5. Click "Save and Deploy"

#### Option 2: Wrangler CLI
```bash
# Build the app
npm run build

# Deploy to Cloudflare Pages
npm run deploy
# or
wrangler pages deploy ./out
```

### Test Locally First:
```bash
# Build the static export
npm run build

# The output will be in the ./out directory
# You can test it with any static server
npx serve out
```

### Important Notes:
- Your app uses only client-side features, perfect for static export
- All data is stored in localStorage, no backend needed
- Charts, authentication, and all features will work as-is
- The app will be served as static HTML/CSS/JS from Cloudflare's edge network

### Environment Variables (if needed later):
Add in Cloudflare Dashboard under Settings > Environment variables

### Custom Domain:
Configure in Cloudflare Dashboard > Pages > Custom domains
