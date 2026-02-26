# Netlify Deployment - SPA Routing Fix

## Issue: "Page Not Found" Error

Your React SPA needs special configuration to handle client-side routing.

## Solution

We've added a `_redirects` file to handle this. Now you need to redeploy or check your Netlify settings.

### Option 1: Check Netlify Build Settings (Recommended)

1. Go to your Netlify site dashboard
2. Click **Site settings** → **Build & deploy** → **Build settings**
3. Verify these settings:

```
Repository branch: main
Base directory: bookstore-frontend
Build command: npm run build
Publish directory: bookstore-frontend/dist
```

**Important:** The "Base directory" should be `bookstore-frontend` (not empty/root)

### Option 2: Manual Redeploy

1. Go to Netlify dashboard
2. Open your site
3. Click **Deploys** tab
4. Click **Trigger deploy** → **Deploy site** (this will pick up the new `_redirects` file)

### Option 3: Clear Cache and Redeploy

Sometimes cached files cause issues:

1. In your Netlify site dashboard
2. Go to **Settings** → **Deploys**
3. Click **Clear cache and redeploy**

---

## What We Fixed

✅ Added `_redirects` file in `public/` directory
✅ Configured `netlify.toml` with SPA settings
✅ Added environment variable for API URL

---

## Testing

After redeployment:

1. Open your Netlify URL
2. You should see the homepage
3. Try navigating to different pages (Home, Books, Cart, Orders)
4. Refresh the page - it should still work!
5. Try the login/register pages

---

## If It Still Doesn't Work

Try clearing browser cache:
- Windows: `Ctrl + Shift + Delete`
- Mac: `Cmd + Shift + Delete`

Or use incognito/private browsing mode.

---

## Common Issues

**"Cannot GET /"** → Check base directory is `bookstore-frontend`
**"Page not found on refresh"** → The `_redirects` file wasn't deployed
**Backend can't be reached** → Check `VITE_API_BASE_URL` environment variable

---
