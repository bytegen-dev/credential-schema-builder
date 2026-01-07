# Railway Deployment Guide

## Quick Deploy

1. **Install Railway CLI** (optional but recommended):

   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway**:

   ```bash
   railway login
   ```

3. **Initialize Railway project**:

   ```bash
   railway init
   ```

4. **Deploy**:
   ```bash
   railway up
   ```

## Via Railway Dashboard

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your repository
5. Railway will automatically detect the monorepo structure

## Configuration

Railway will:

- Run `npm install` at the root (installs all workspace dependencies)
- Run `npm run build` (builds all packages: shared → frontend → backend)
- Run `npm start` (starts the backend server)

## Environment Variables

Railway automatically provides:

- `PORT` - Railway sets this automatically (backend uses `process.env.PORT || 3001`)

Optional environment variables you can set:

- `NODE_ENV=production`

## Build Order

The build process automatically handles dependencies:

1. **shared** package builds first (required by backend)
2. **frontend** builds (static export to `frontend/out`)
3. **backend** builds (TypeScript compilation)

## Accessing Your App

After deployment:

- **Frontend**: `https://your-app.railway.app/web`
- **API**: `https://your-app.railway.app/api`
- **Health Check**: `https://your-app.railway.app/api/health`

## Troubleshooting

If build fails:

- Check Railway logs: `railway logs`
- Ensure all dependencies are in `package.json` (not just devDependencies)
- Verify Node.js version (Railway uses Node 18+ by default)
