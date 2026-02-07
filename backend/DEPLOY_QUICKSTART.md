# AWS Deployment Quick Start

## 1. Install Prerequisites
```powershell
# Install EB CLI
pip install awsebcli

# Configure AWS (you'll need Access Key ID and Secret Access Key)
aws configure
```

## 2. Initialize and Deploy
```powershell
cd c:\Users\aloo\DSS\backend

# Initialize EB application
eb init -p python-3.11 dss-backend --region us-east-1

# Create environment and deploy (takes ~10 minutes)
eb create dss-production --elb-type application

# Get your application URL
eb status
```

## 3. Set Up SSL Certificate

### Get Certificate in AWS Console
1. Go to AWS Certificate Manager (ACM)
2. Request certificate for `api.yourdomain.com`
3. Use DNS validation (add CNAME record to your domain)
4. Copy the certificate ARN (looks like: `arn:aws:acm:us-east-1:123456789:certificate/abc-123`)

### Update SSL Configuration
Edit `.ebextensions/01_app.config`:
- Replace `REGION` with your region (e.g., `us-east-1`)
- Replace `ACCOUNT_ID` with your AWS account ID
- Replace `CERTIFICATE_ID` with your certificate ID

### Apply SSL Configuration
```powershell
eb deploy
```

## 4. Configure CORS
```powershell
# Allow your Netlify frontend
eb setenv CORS_ORIGINS="https://dssssss.netlify.app"
```

## 5. Point Your Domain
In your DNS provider, create a CNAME record:
- Name: `api` (or your choice)
- Value: [from `eb status` output].elasticbeanstalk.com

## 6. Update Frontend
In Netlify:
- Set environment variable: `VITE_API_URL` = `https://api.yourdomain.com`
- Redeploy

## Common Commands
```powershell
eb deploy          # Deploy updates
eb logs            # View logs
eb status          # Check application status
eb health          # Check health
eb open            # Open in browser
eb ssh             # SSH into instance
eb terminate       # Delete environment
```

## Cost
- ~$25-30/month (t3.micro + Load Balancer)
- Free tier eligible (first 12 months): ~$17/month

## Full Documentation
See [AWS_DEPLOYMENT.md](AWS_DEPLOYMENT.md) for complete guide with troubleshooting.
