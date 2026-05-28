# Frontend Deployment Guide

## Environment Variables Setup

All hardcoded backend URLs have been replaced with the `VITE_API_URL` environment variable.

### Local Development (.env.local)
```
VITE_API_URL=http://localhost:5001
```

### Vercel Deployment

Follow these steps to deploy your frontend on Vercel with your custom backend URL:

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "deployment ready frontend"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**:
   - In the Vercel dashboard, go to your project settings
   - Navigate to **Settings → Environment Variables**
   - Add a new variable:
     - **Name**: `VITE_API_URL`
     - **Value**: Your deployed backend URL (e.g., `https://your-backend-domain.com`)
     - **Environments**: Select all (Production, Preview, Development)
   - Click "Save"

4. **Deploy**:
   - Vercel will automatically build and deploy
   - Your frontend will now point to your deployed backend

## Build Command for Vercel

The following is the default Vite build configuration used by Vercel:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

These should already be configured automatically when you import the project.

## Available Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_URL` | Backend API base URL | `https://api.example.com` |

## Where Environment Variables Are Used

1. **AuthContext.jsx** - User login/logout
2. **ProductList.jsx** - Fetching products (with polling)
3. **ProductTable.jsx** - Publishing/unpublishing products

## Testing Before Deployment

To test with your deployed backend URL locally:

1. Update `.env.local`:
   ```
   VITE_API_URL=https://your-deployed-backend-url.com
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:5173 and verify everything works

## Troubleshooting

### Backend URL Not Loading
- Check that `VITE_API_URL` is set in Vercel environment variables
- Ensure your backend API has CORS enabled for your Vercel domain
- Backend should respond to: `{VITE_API_URL}/api/auth/login` and `{VITE_API_URL}/api/products`

### Environment Variables Not Taking Effect
- Trigger a new Vercel deployment (redeploy project)
- Clear browser cache and cookies
- Check Network tab in browser DevTools to verify correct API URL is being called

## Files Modified for Deployment

- `.env.local` - Local development configuration
- `.env.example` - Example environment variables
- `src/context/AuthContext.jsx` - Uses `VITE_API_URL`
- `src/pages/ProductList.jsx` - Uses `VITE_API_URL`
- `src/components/products/ProductTable.jsx` - Uses `VITE_API_URL`
