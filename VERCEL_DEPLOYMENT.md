# Quick Start: Deploy to Vercel

## Step 1: Prepare Your Code
```bash
# Make sure all changes are committed
git add .
git commit -m "deployment ready - environment variables configured"
git push origin main
```

## Step 2: Deploy Frontend on Vercel

### Option A: Using Vercel CLI (Fastest)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# When asked for backend URL environment variable, enter your deployed backend URL
# Example: https://your-backend-domain.com
```

### Option B: Using Vercel Dashboard (GUI)
1. Visit https://vercel.com
2. Click "New Project"
3. Click "Import Git Repository"
4. Select your GitHub repository
5. Click "Import"
6. Under "Environment Variables", add:
   - **Name**: `VITE_API_URL`
   - **Value**: Your backend URL (e.g., `https://your-api.com`)
   - **Scope**: All (Production, Preview, Development)
7. Click "Deploy"

## Step 3: Update Your Backend URL

After getting your backend deployment URL, update in Vercel:
1. Go to your Vercel project settings
2. Navigate to **Settings → Environment Variables**
3. Update `VITE_API_URL` with your actual deployed backend URL
4. Click "Save"
5. Vercel will automatically redeploy with the new URL

## Step 4: Test Your Deployment

Once deployed:
1. Visit your Vercel frontend URL
2. Login with credentials:
   - **Admin**: `admin` / `admin123`
   - **User**: `user` / `user123`
3. Verify that products load correctly
4. As admin, test the publish/unpublish toggle

## Example Environment Variable Values

### Development (Local)
```
VITE_API_URL=http://localhost:5001
```

### Production (Deployed)
```
VITE_API_URL=https://your-backend-api.yourdomain.com
```

## Troubleshooting Deployment

### Issue: "Failed to fetch" errors
- **Solution**: Check that `VITE_API_URL` is correctly set in Vercel environment variables
- Verify backend is deployed and accessible
- Check CORS settings on your backend

### Issue: Environment variables not applied
- **Solution**: Redeploy the project in Vercel (use "Redeploy" button)
- Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- Verify variables in Vercel dashboard

### Issue: Can't login after deployment
- **Solution**: Check that your backend has CORS enabled for your Vercel domain
- Verify the API endpoint is responding correctly using curl:
  ```bash
  curl -X POST https://your-backend-url/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"admin123"}'
  ```

## Next Steps

- Monitor your Vercel deployments in the dashboard
- Set up automatic deployments (push to main = auto deploy)
- Enable analytics in Vercel settings to track performance
- Configure custom domain in Vercel for production URL
