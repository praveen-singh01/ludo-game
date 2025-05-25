#!/bin/bash

# 🚀 Ludo Master Server Deployment Script
# This script helps prepare and validate the server for Render deployment

set -e

echo "🎮 Ludo Master Server Deployment Preparation"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the server directory
if [ ! -f "server.js" ]; then
    print_error "Please run this script from the server directory"
    exit 1
fi

print_info "Checking server directory structure..."

# Check required files
required_files=("server.js" "package.json" "gameRoomManager.js" "gameStateManager.js")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_status "Found $file"
    else
        print_error "Missing required file: $file"
        exit 1
    fi
done

# Check package.json for required dependencies
print_info "Validating package.json..."
if node -e "
const pkg = require('./package.json');
const required = ['express', 'socket.io', 'cors', 'uuid', 'dotenv'];
const missing = required.filter(dep => !pkg.dependencies[dep]);
if (missing.length > 0) {
    console.error('Missing dependencies:', missing.join(', '));
    process.exit(1);
}
console.log('All required dependencies found');
"; then
    print_status "Package.json validation passed"
else
    print_error "Package.json validation failed"
    exit 1
fi

# Syntax check
print_info "Running syntax check..."
if node -c server.js; then
    print_status "Server syntax check passed"
else
    print_error "Server syntax check failed"
    exit 1
fi

# Check for render.yaml
if [ -f "render.yaml" ]; then
    print_status "Found render.yaml configuration"
else
    print_warning "render.yaml not found - you can deploy manually via Render dashboard"
fi

# Check for .env.example
if [ -f ".env.example" ]; then
    print_status "Found .env.example"
else
    print_warning ".env.example not found"
fi

# Install dependencies
print_info "Installing dependencies..."
if npm install --production; then
    print_status "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Test server startup (quick test)
print_info "Testing server startup..."
# Start server in background and kill it after a few seconds
node server.js &
SERVER_PID=$!
sleep 3
if kill -0 $SERVER_PID 2>/dev/null; then
    print_status "Server startup test passed"
    kill $SERVER_PID 2>/dev/null || true
    wait $SERVER_PID 2>/dev/null || true
else
    print_error "Server startup test failed"
    exit 1
fi

echo ""
echo "🎉 Deployment preparation completed successfully!"
echo ""
print_info "Next steps:"
echo "1. Push your code to GitHub"
echo "2. Go to https://render.com and create a new Web Service"
echo "3. Connect your GitHub repository"
echo "4. Use these settings:"
echo "   - Environment: Node"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "   - Root Directory: server"
echo "5. Set environment variables:"
echo "   - NODE_ENV=production"
echo "   - PORT=10000"
echo "   - FRONTEND_URL=https://your-frontend-domain.vercel.app"
echo ""
print_info "For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo ""
print_status "Your Ludo Master server is ready for deployment! 🚀"
