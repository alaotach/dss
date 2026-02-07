# Disaster Response Decision Support System - Frontend

## Deployment Configuration

### Mock Data Mode (Default for Netlify)
The frontend automatically uses mock data when no backend is configured. This is perfect for demos and evaluation.

### With Backend
To connect to a deployed backend:

1. Set environment variable in Netlify:
   - Go to Site settings → Environment variables
   - Add `VITE_API_URL` with your backend URL (e.g., `https://your-backend.herokuapp.com`)

2. Redeploy the site

### Local Development

1. Copy `.env.example` to `.env.local`
2. Set `VITE_API_URL=http://localhost:8000` (or your backend URL)
3. Run `npm run dev`

### Force Mock Mode
Set `VITE_USE_MOCK=true` to always use mock data, even if backend is available.

## Files
- `netlify.toml` - Netlify build configuration
- `public/_redirects` - SPA routing for Netlify
- `src/mockData.js` - Demo data for standalone mode
- `src/api.js` - API client with automatic fallback to mock data
