# AWS App Runner Deployment (Simpler Alternative)

AWS App Runner is a simpler alternative to Elastic Beanstalk with automatic HTTPS.

## Prerequisites
- AWS Account
- Code in GitHub (push your backend to GitHub)

## Deployment Steps

### 1. Push Code to GitHub
```powershell
cd c:\Users\aloo\DSS\backend
git init
git add .
git commit -m "Initial commit for AWS App Runner"
git remote add origin https://github.com/yourusername/dss-backend.git
git push -u origin main
```

### 2. Deploy via AWS Console

1. Go to [AWS App Runner Console](https://console.aws.amazon.com/apprunner)
2. Click "Create service"
3. **Source:**
   - Repository type: "Source code repository"
   - Connect to GitHub (authorize AWS)
   - Select your repository and branch (main)
4. **Build settings:**
   - Use configuration file: `apprunner.yaml`
5. **Service settings:**
   - Service name: `dss-backend-production`
   - Port: 8000
6. **Environment variables:**
   - Add: `CORS_ORIGINS` = `https://dssssss.netlify.app`
   - Add: `ENVIRONMENT` = `production`
7. Click "Create & deploy"

### 3. Get Your URL
After deployment (5-10 minutes), you'll get a URL like:
```
https://xxxxx.us-east-1.awsapprunner.com
```

**HTTPS is automatic!** No certificate setup needed.

### 4. Update Frontend
In Netlify:
- Set `VITE_API_URL` = `https://xxxxx.us-east-1.awsapprunner.com`
- Redeploy

## Custom Domain (Optional)

1. In App Runner console, go to "Custom domains"
2. Add your domain: `api.yourdomain.com`
3. App Runner provides DNS records
4. Add those records to your DNS provider
5. Wait for validation

## Cost
- **$25-30/month** for continuous running
- **$0.064/GB-month** for storage
- Automatic scaling included

## Advantages over Elastic Beanstalk
✅ Automatic HTTPS (no certificate setup)
✅ Simpler configuration
✅ Auto-deploys from GitHub
✅ Built-in CI/CD
✅ No load balancer to configure

## Disadvantages
❌ Less control over infrastructure
❌ No SSH access
❌ Region availability limited

## Commands
```powershell
# Update deployment (push to GitHub)
git add .
git commit -m "Update"
git push

# App Runner auto-deploys!
```

## Recommended For
- Quick prototypes
- Demos and evaluation
- Simple applications
- When you want "just deploy it"

For production with custom VPC, database connections, or complex infrastructure, use Elastic Beanstalk instead.
