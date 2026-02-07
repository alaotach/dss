# AWS Elastic Beanstalk Deployment Guide with SSL

## Prerequisites

1. **AWS Account** with billing enabled
2. **AWS CLI** installed and configured
3. **EB CLI** (Elastic Beanstalk CLI)
4. **Domain name** (for SSL certificate)

## Installation

### Install AWS CLI
```powershell
# Windows (using Chocolatey)
choco install awscli

# Or download from: https://aws.amazon.com/cli/
```

### Install EB CLI
```powershell
pip install awsebcli
```

### Configure AWS CLI
```powershell
aws configure
# Enter: Access Key ID, Secret Access Key, Region (e.g., us-east-1), Output format (json)
```

## Deployment Steps

### 1. Initialize Elastic Beanstalk
```powershell
cd c:\Users\aloo\DSS\backend
eb init

# Select:
# - Region: us-east-1 (or your preferred region)
# - Application name: dss-backend
# - Platform: Python 3.11
# - SSH: Yes (for debugging)
```

### 2. Request SSL Certificate (AWS Certificate Manager)

**Option A: Using AWS Console (Recommended)**
1. Go to AWS Certificate Manager (ACM) in your region
2. Click "Request certificate"
3. Choose "Request a public certificate"
4. Enter your domain name (e.g., api.yourdomain.com)
5. Choose DNS validation
6. Add the CNAME record to your domain's DNS
7. Wait for validation (5-30 minutes)
8. Copy the certificate ARN

**Option B: Using AWS CLI**
```powershell
aws acm request-certificate `
  --domain-name api.yourdomain.com `
  --validation-method DNS `
  --region us-east-1

# Note the CertificateArn from output
# Follow DNS validation instructions
```

### 3. Update SSL Configuration

Edit `.ebextensions/01_app.config` and replace:
- `REGION` with your AWS region (e.g., us-east-1)
- `ACCOUNT_ID` with your AWS account ID
- `CERTIFICATE_ID` with your certificate ID from the ARN

Example ARN: `arn:aws:acm:us-east-1:123456789012:certificate/abc123-def456`
- REGION = us-east-1
- ACCOUNT_ID = 123456789012
- CERTIFICATE_ID = abc123-def456

### 4. Create Environment and Deploy
```powershell
# Create production environment with load balancer
eb create dss-production --timeout 30 --elb-type application

# This will:
# - Create EC2 instances
# - Set up Application Load Balancer
# - Configure security groups
# - Deploy your application
# - Takes 10-15 minutes
```

### 5. Configure Environment Variables
```powershell
# Set CORS origins for your frontend domain
eb setenv CORS_ORIGINS="https://dssssss.netlify.app"

# Set environment
eb setenv ENVIRONMENT="production"

# Restart to apply changes
eb deploy
```

### 6. Set Up DNS

Point your domain to the load balancer:

1. Get your load balancer URL:
```powershell
eb status
# Look for "CNAME: xxxx.elasticbeanstalk.com"
```

2. In your DNS provider, create a CNAME record:
   - Type: CNAME
   - Name: api (or your subdomain)
   - Value: [your-eb-cname].elasticbeanstalk.com

### 7. Verify HTTPS

Wait 5-10 minutes for DNS propagation, then test:
```powershell
curl https://api.yourdomain.com/docs
```

You should see the FastAPI documentation page.

### 8. Update Frontend

Update Netlify environment variable:
1. Go to Netlify dashboard → Site settings → Environment variables
2. Set `VITE_API_URL` = `https://api.yourdomain.com`
3. Redeploy frontend

## Deployment Commands Cheat Sheet

```powershell
# Deploy updates
eb deploy

# Check status
eb status

# View logs
eb logs

# SSH into instance
eb ssh

# Open application in browser
eb open

# Set environment variables
eb setenv KEY=value

# Terminate environment (WARNING: deletes everything)
eb terminate dss-production
```

## Cost Estimate

**Monthly costs (us-east-1):**
- t3.micro EC2 instance: ~$8/month
- Application Load Balancer: ~$16/month
- Data transfer (minimal): ~$1-2/month
- **Total: ~$25-30/month**

**Free Tier:** If you're on AWS Free Tier (first 12 months), EC2 is free, reducing cost to ~$17-20/month.

## Alternative: AWS App Runner (Simpler, Auto-HTTPS)

If you prefer a simpler option with automatic HTTPS:

### Create `apprunner.yaml`
```yaml
version: 1.0
runtime: python311
build:
  commands:
    build:
      - pip install -r requirements.txt
run:
  command: uvicorn main:app --host 0.0.0.0 --port 8000
  network:
    port: 8000
```

### Deploy with App Runner
1. Push code to GitHub
2. Go to AWS App Runner console
3. Create service from GitHub repository
4. Select branch and `apprunner.yaml`
5. App Runner provides automatic HTTPS URL: `https://xxxxx.region.awsapprunner.com`

**Cost:** ~$25-30/month (similar to EB but fully managed)

## Troubleshooting

### Deployment fails
```powershell
eb logs --all
```

### SSL not working
- Verify certificate is issued in ACM
- Check certificate ARN in `.ebextensions/01_app.config`
- Ensure region matches
- Check security group allows 443

### CORS errors
```powershell
eb setenv CORS_ORIGINS="https://dssssss.netlify.app"
eb deploy
```

### Database issues
For production, consider migrating to RDS PostgreSQL:
1. Create RDS PostgreSQL instance in AWS Console
2. Update `DATABASE_URL` environment variable
3. Update requirements.txt to include `psycopg2-binary`

## Production Checklist

- [ ] SSL certificate issued and validated
- [ ] DNS pointing to load balancer
- [ ] Environment variables configured
- [ ] Frontend updated with backend URL
- [ ] Health check endpoint working (`/docs`)
- [ ] CORS configured for frontend domain
- [ ] Monitoring/alerts set up (CloudWatch)
- [ ] Database backups configured (if using RDS)

## Support

For issues, check:
- AWS Elastic Beanstalk logs: `eb logs`
- CloudWatch logs in AWS Console
- Application health: `eb health`
