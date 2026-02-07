# AWS EC2 Manual Deployment Guide

Deploy your FastAPI backend on a raw EC2 instance with Nginx and SSL.

## Prerequisites
- AWS Account
- Domain name (for SSL)
- SSH client (built into Windows/PowerShell)

## Part 1: Launch EC2 Instance

### 1. Create EC2 Instance via AWS Console

1. Go to [EC2 Console](https://console.aws.amazon.com/ec2)
2. Click "Launch Instance"
3. Configure:
   - **Name:** dss-backend-production
   - **AMI:** Ubuntu Server 22.04 LTS (Free tier eligible)
   - **Instance type:** t2.micro (Free tier) or t3.micro ($8/month)
   - **Key pair:** Create new key pair
     - Name: dss-backend-key
     - Type: RSA
     - Format: .pem
     - **Download and save the .pem file!**
   - **Network settings:**
     - ✅ Allow SSH (port 22) from your IP
     - ✅ Allow HTTP (port 80) from anywhere
     - ✅ Allow HTTPS (port 443) from anywhere
   - **Storage:** 8 GB (Free tier)
4. Click "Launch Instance"
5. Wait for instance to start (2-3 minutes)
6. Note the **Public IPv4 address** (e.g., 54.123.45.67)

## Part 2: Connect to EC2 Instance

### Option A: Using PowerShell (Windows)

```powershell
# Set permissions on key file
icacls "C:\Users\YourUser\Downloads\dss-backend-key.pem" /inheritance:r /grant:r "$($env:USERNAME):(R)"

# Connect to EC2
ssh -i "C:\Users\YourUser\Downloads\dss-backend-key.pem" ubuntu@54.123.45.67
```

### Option B: Using EC2 Instance Connect (Browser)
1. In EC2 Console, select your instance
2. Click "Connect" → "EC2 Instance Connect"
3. Click "Connect" (opens browser terminal)

## Part 3: Install Dependencies on EC2

Once connected via SSH:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3.11
sudo apt install -y python3.11 python3.11-venv python3-pip

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx

# Install Git
sudo apt install -y git
```

## Part 4: Deploy Application

```bash
# Create application directory
sudo mkdir -p /var/www/dss-backend
sudo chown ubuntu:ubuntu /var/www/dss-backend
cd /var/www/dss-backend

# Clone repository
git clone https://github.com/alaotach/dss.git .
cd backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Initialize database
python -c "from repositories.database import init_db; init_db()"

# Test application
python -m uvicorn main:app --host 0.0.0.0 --port 8000
# Press Ctrl+C after verifying it starts
```

## Part 5: Create Systemd Service

Create service file to run app automatically:

```bash
sudo nano /etc/systemd/system/dss-backend.service
```

Paste this content:

```ini
[Unit]
Description=DSS Backend FastAPI Application
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/var/www/dss-backend/backend
Environment="PATH=/var/www/dss-backend/backend/venv/bin"
Environment="ENVIRONMENT=production"
Environment="CORS_ORIGINS=https://dssssss.netlify.app"
ExecStart=/var/www/dss-backend/backend/venv/bin/python -m uvicorn main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Save and exit (Ctrl+X, Y, Enter)

Enable and start service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable dss-backend
sudo systemctl start dss-backend
sudo systemctl status dss-backend
```

## Part 6: Configure Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/dss-backend
```

Paste this content (replace `api.yourdomain.com` with your domain):

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Increase timeouts
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
    }
}
```

Save and exit, then enable:

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/dss-backend /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Part 7: Set Up DNS

In your domain provider (Namecheap, GoDaddy, etc.):

1. Create an **A Record**:
   - Host: `api` (or your subdomain)
   - Points to: Your EC2 Public IP (e.g., 54.123.45.67)
   - TTL: 3600 (or default)

2. Wait for DNS propagation (5-30 minutes)

3. Test:
```bash
curl http://api.yourdomain.com/health
```

## Part 8: Enable SSL with Let's Encrypt

```bash
# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d api.yourdomain.com

# Follow prompts:
# - Enter email address
# - Agree to terms
# - Choose option 2 (Redirect HTTP to HTTPS)

# Test SSL
curl https://api.yourdomain.com/health
```

**Auto-renewal** is configured automatically! Certbot adds a cron job.

Test renewal:
```bash
sudo certbot renew --dry-run
```

## Part 9: Update Frontend

In Netlify dashboard:
1. Go to Site settings → Environment variables
2. Set: `VITE_API_URL` = `https://api.yourdomain.com`
3. Redeploy frontend

## Part 10: Test Full System

```bash
# Check backend service
sudo systemctl status dss-backend

# Check Nginx
sudo systemctl status nginx

# View backend logs
sudo journalctl -u dss-backend -f

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Test endpoint
curl https://api.yourdomain.com/docs
```

## Deployment Updates

When you push code changes:

```bash
# SSH into EC2
ssh -i dss-backend-key.pem ubuntu@54.123.45.67

# Navigate to app directory
cd /var/www/dss-backend/backend

# Pull latest changes
git pull

# Restart service
sudo systemctl restart dss-backend

# Check status
sudo systemctl status dss-backend
```

## Useful Commands

```bash
# View application logs
sudo journalctl -u dss-backend -f

# Restart application
sudo systemctl restart dss-backend

# Restart Nginx
sudo systemctl restart nginx

# Check disk space
df -h

# Check memory
free -h

# Check running processes
htop

# Update SSL certificate manually
sudo certbot renew

# Edit environment variables
sudo nano /etc/systemd/system/dss-backend.service
sudo systemctl daemon-reload
sudo systemctl restart dss-backend
```

## Security Best Practices

### 1. Update Security Group
In EC2 Console:
- Allow SSH only from **your IP** (not 0.0.0.0/0)
- Keep HTTP (80) and HTTPS (443) open to all

### 2. Set Up Firewall
```bash
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw status
```

### 3. Regular Updates
```bash
sudo apt update && sudo apt upgrade -y
```

### 4. Monitor Logs
```bash
# Set up log rotation (automatic with systemd)
# Check logs regularly
sudo journalctl -u dss-backend --since today
```

## Cost Estimate

**Monthly costs:**
- EC2 t2.micro (Free Tier): **$0** (first 12 months)
- EC2 t2.micro (after): **~$8/month**
- EC2 t3.micro: **~$8/month**
- Data transfer (minimal): **~$1-2/month**
- **Total: $0-10/month**

**Free Tier includes:**
- 750 hours/month of t2.micro (always enough for 1 instance)
- 30 GB storage
- 15 GB data transfer out

## Troubleshooting

### Service won't start
```bash
# Check logs
sudo journalctl -u dss-backend -f

# Check if port is in use
sudo lsof -i :8000

# Test manually
cd /var/www/dss-backend/backend
source venv/bin/activate
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

### Nginx errors
```bash
# Test config
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log

# Restart
sudo systemctl restart nginx
```

### SSL certificate issues
```bash
# Check certificate status
sudo certbot certificates

# Renew manually
sudo certbot renew --force-renewal

# Debug
sudo certbot --nginx -d api.yourdomain.com --dry-run
```

### Can't connect to EC2
1. Check security group allows SSH from your IP
2. Verify key file permissions
3. Confirm public IP address
4. Try EC2 Instance Connect from AWS Console

### Backend returns errors
```bash
# Check Python version
python3.11 --version

# Check dependencies
source /var/www/dss-backend/backend/venv/bin/activate
pip list

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

## Advantages of EC2

✅ **Full control** over server
✅ **Cheapest option** with Free Tier
✅ **SSH access** for debugging
✅ **Free SSL** with Let's Encrypt
✅ Can run multiple services
✅ Direct database access
✅ Custom configurations

## Disadvantages

❌ Manual setup required
❌ Need to manage updates
❌ No auto-scaling (need to configure)
❌ Manual SSL renewal setup
❌ More maintenance

## Comparison with Other Options

| Feature | EC2 Manual | App Runner | Elastic Beanstalk |
|---------|-----------|------------|-------------------|
| Cost | $0-10/mo | $25-30/mo | $25-30/mo |
| Setup Time | 30-40 min | 10 min | 20 min |
| SSL | Manual (free) | Auto | Manual (free) |
| Control | Full | Limited | Medium |
| Maintenance | You manage | AWS manages | AWS manages |
| Free Tier | ✅ | ❌ | ✅ |

**Best for:** Budget-conscious deployments, learning, full control needs, long-term hosting.
