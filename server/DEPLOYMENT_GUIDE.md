# 🚀 Render Deployment Guide for Ludo Master Server

## 📋 Prerequisites

1. **GitHub Repository**: Ensure your code is pushed to GitHub
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Environment Variables**: Prepare your production environment variables

## 🔧 Step 1: Prepare for Deployment

### ✅ Server Configuration
- [x] Production-ready CORS configuration
- [x] Environment variable support
- [x] Health check endpoint (`/health`)
- [x] Graceful shutdown handling
- [x] Socket.IO production optimizations
- [x] Error handling and logging

### ✅ Files Ready
- [x] `server.js` - Main server file
- [x] `package.json` - Dependencies and scripts
- [x] `render.yaml` - Render configuration
- [x] `.env.example` - Environment variables template

## 🌐 Step 2: Deploy to Render

### Option A: Using Render Dashboard (Recommended)

1. **Connect Repository**:
   - Go to [render.com](https://render.com) and sign in
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your Ludo game

2. **Configure Service**:
   ```
   Name: ludo-master-server
   Environment: Node
   Region: Choose closest to your users
   Branch: main
   Root Directory: server
   Build Command: npm install
   Start Command: npm start
   ```

3. **Set Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

4. **Advanced Settings**:
   ```
   Health Check Path: /health
   Auto-Deploy: Yes
   ```

### Option B: Using render.yaml (Infrastructure as Code)

1. **Push render.yaml**: Ensure the `render.yaml` file is in your server directory
2. **Create Service**: Render will automatically detect and use the configuration

## 🔧 Step 3: Environment Variables

Set these environment variables in Render dashboard:

### Required Variables:
```bash
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-ludo-game.vercel.app
```

### Optional Variables:
```bash
REDIS_URL=redis://your-redis-instance
LOG_LEVEL=info
MAX_ROOMS=1000
MAX_PLAYERS_PER_ROOM=4
```

## 🧪 Step 4: Test Deployment

### Health Check
Once deployed, test the health endpoint:
```bash
curl https://your-app-name.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "activeRooms": 0,
  "connectedPlayers": 0
}
```

### Socket.IO Connection Test
Test WebSocket connection from browser console:
```javascript
const socket = io('https://your-app-name.onrender.com');
socket.on('connect', () => console.log('Connected to server!'));
```

## 🔗 Step 5: Update Frontend Configuration

Update your frontend to use the deployed server URL:

### In your React app, update the socket connection:
```typescript
// Replace localhost with your Render URL
const SOCKET_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-app-name.onrender.com'
  : 'http://localhost:3001';

const socket = io(SOCKET_URL);
```

### Environment Variables for Frontend (.env.production):
```bash
VITE_API_URL=https://your-app-name.onrender.com
VITE_SOCKET_URL=https://your-app-name.onrender.com
```

## 📊 Step 6: Monitor Deployment

### Render Dashboard Features:
- **Logs**: Real-time server logs
- **Metrics**: CPU, Memory, Network usage
- **Events**: Deployment history
- **Shell**: Direct server access for debugging

### Key Metrics to Monitor:
- Response time < 200ms
- Memory usage < 80%
- Active WebSocket connections
- Room creation/deletion rates

## 🔧 Step 7: Production Optimizations

### Performance Settings:
```javascript
// Already configured in server.js
const io = new Server(server, {
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 30000,
  allowEIO3: true
});
```

### Scaling Considerations:
- **Horizontal Scaling**: Use Redis adapter for multiple instances
- **Load Balancing**: Render handles this automatically
- **Session Persistence**: Implement Redis-based session storage

## 🚨 Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Ensure frontend URL is in CORS origins
   - Check FRONTEND_URL environment variable

2. **Socket.IO Connection Failed**:
   - Verify WebSocket support is enabled
   - Check firewall/proxy settings

3. **Health Check Failing**:
   - Ensure `/health` endpoint is accessible
   - Check server startup logs

4. **Memory Issues**:
   - Monitor room cleanup
   - Implement proper disconnection handling

### Debug Commands:
```bash
# Check server logs
render logs --service-id your-service-id

# Test health endpoint
curl -v https://your-app-name.onrender.com/health

# Check environment variables
render env --service-id your-service-id
```

## 🎯 Success Checklist

- [ ] Server deploys successfully
- [ ] Health check returns 200 OK
- [ ] Socket.IO connections work
- [ ] CORS allows frontend connections
- [ ] Game rooms can be created
- [ ] Multiplayer functionality works
- [ ] Frontend connects to production server
- [ ] No console errors in browser
- [ ] Performance metrics are healthy

## 📞 Support

If you encounter issues:
1. Check Render logs for errors
2. Verify environment variables
3. Test endpoints manually
4. Check frontend console for errors
5. Monitor server metrics

Your Ludo Master server is now ready for production! 🎮
