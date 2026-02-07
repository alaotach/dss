#!/bin/bash

# EC2 Automated Setup Script
# Run this on your EC2 instance after connecting via SSH

set -e  # Exit on error

echo "==================================="
echo "DSS Backend EC2 Setup Script"
echo "==================================="

# Update system
echo "[1/8] Updating system..."
sudo apt update && sudo apt upgrade -y

# Install Python 3.11
echo "[2/8] Installing Python 3.11..."
sudo apt install -y python3.11 python3.11-venv python3-pip

# Install Nginx
echo "[3/8] Installing Nginx..."
sudo apt install -y nginx

# Install Certbot
echo "[4/8] Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx

# Install Git
echo "[5/8] Installing Git..."
sudo apt install -y git

# Create app directory
echo "[6/8] Setting up application..."
sudo mkdir -p /var/www/dss-backend
sudo chown ubuntu:ubuntu /var/www/dss-backend
cd /var/www/dss-backend

# Clone repository
echo "[7/8] Cloning repository..."
read -p "Enter your GitHub username: " GITHUB_USER
git clone https://github.com/$GITHUB_USER/dss.git .

# Set up virtual environment
echo "[8/8] Setting up Python environment..."
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Initialize database
python -c "from repositories.database import init_db; init_db()"

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Create systemd service (see AWS_EC2_MANUAL.md)"
echo "2. Configure Nginx (see AWS_EC2_MANUAL.md)"
echo "3. Set up DNS for your domain"
echo "4. Run certbot to get SSL certificate"
echo ""
echo "See full guide: AWS_EC2_MANUAL.md"
