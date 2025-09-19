# 🚀 Deployment Guide - Social Scheduler

## Free Hosting Options

### 1. Vercel (Recommended) - FREE
**Perfect for Next.js applications**

**Steps to deploy:**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Sign up with GitHub
4. Click "New Project"
5. Import your repository
6. Configure environment variables
7. Deploy!

**Environment Variables needed:**
```
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key\n-----END PRIVATE KEY-----\n"
DATABASE_URL=your-database-url
```

### 2. Netlify - FREE
**Great for static sites and forms**

**Steps:**
1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Connect GitHub
4. Deploy from repository
5. Configure environment variables

### 3. Railway - FREE ($5 credit/month)
**Best for full-stack apps with databases**

**Steps:**
1. Go to [railway.app](https://railway.app)
2. Connect GitHub
3. Deploy from repository
4. Add PostgreSQL database
5. Configure environment variables

## Database Options (Free)

### 1. Vercel Postgres (Recommended)
- ✅ Free tier: 1 database, 1GB storage
- ✅ Perfect integration with Vercel
- ✅ Automatic backups

### 2. Supabase
- ✅ Free tier: 500MB database
- ✅ Real-time features
- ✅ Built-in authentication

### 3. PlanetScale
- ✅ Free tier: 1 database, 1GB storage
- ✅ MySQL compatible
- ✅ Branching for databases

### 4. Railway PostgreSQL
- ✅ Free with Railway hosting
- ✅ 1GB storage
- ✅ Automatic backups

## Pre-Deployment Checklist

### 1. Environment Variables
Create these environment variables in your hosting platform:

```bash
# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=generate-a-random-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Google Sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key\n-----END PRIVATE KEY-----\n"

# Database
DATABASE_URL=postgresql://username:password@host:port/database
```

### 2. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins:
   - `https://your-domain.vercel.app`
   - `https://your-domain.vercel.app/api/auth/callback/google`

### 3. Google Sheets Service Account
1. Go to Google Cloud Console
2. Create a service account
3. Download the JSON key file
4. Share your Google Sheets with the service account email
5. Add the credentials to environment variables

### 4. Database Setup
1. Create a PostgreSQL database
2. Run migrations (if any)
3. Update DATABASE_URL

## Deployment Steps for Vercel

### 1. Prepare Your Repository
```bash
# Make sure all files are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. Configure settings:
   - Framework Preset: Next.js
   - Root Directory: `./social-scheduler`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3. Configure Environment Variables
In Vercel dashboard:
1. Go to your project
2. Click "Settings"
3. Click "Environment Variables"
4. Add all required variables
5. Redeploy

### 4. Custom Domain (Optional)
1. In Vercel dashboard, go to "Domains"
2. Add your custom domain
3. Configure DNS settings
4. SSL certificate is automatic

## Post-Deployment

### 1. Test Your Application
- ✅ Authentication works
- ✅ Forms can be created
- ✅ Embed functionality works
- ✅ Google Sheets integration works
- ✅ Database connections work

### 2. Monitor Performance
- Check Vercel analytics
- Monitor function execution times
- Watch for errors in logs

### 3. Set Up Monitoring
- Enable Vercel analytics
- Set up error tracking (Sentry)
- Monitor database performance

## Cost Breakdown

### Vercel Free Tier
- ✅ Hosting: FREE
- ✅ Custom domains: FREE
- ✅ SSL certificates: FREE
- ✅ CDN: FREE
- ✅ Serverless functions: FREE (100 executions/day)

### Database Options
- **Vercel Postgres**: FREE (1GB)
- **Supabase**: FREE (500MB)
- **PlanetScale**: FREE (1GB)
- **Railway**: FREE with hosting

### Total Monthly Cost: $0

## Troubleshooting

### Common Issues
1. **Environment variables not working**
   - Check variable names match exactly
   - Redeploy after adding variables

2. **Database connection issues**
   - Verify DATABASE_URL format
   - Check database is accessible

3. **Google OAuth errors**
   - Verify authorized origins
   - Check client ID and secret

4. **Build failures**
   - Check build logs in Vercel
   - Ensure all dependencies are in package.json

### Getting Help
- Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- Next.js deployment: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- Community support: [github.com/vercel/next.js/discussions](https://github.com/vercel/next.js/discussions)

## Next Steps After Deployment

1. **Set up monitoring** and error tracking
2. **Configure backups** for your database
3. **Set up CI/CD** for automatic deployments
4. **Optimize performance** with Vercel analytics
5. **Scale up** if you exceed free tier limits

Your Social Scheduler application is ready for production deployment! 🎉
