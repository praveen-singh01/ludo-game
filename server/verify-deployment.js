#!/usr/bin/env node

/**
 * 🔍 Deployment Verification Script
 * Tests the deployed Render server to ensure all functionality works
 */

import { io } from 'socket.io-client';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`)
};

async function verifyDeployment(serverUrl) {
  console.log(`🔍 Verifying deployment at: ${serverUrl}\n`);

  try {
    // Test 1: Health Check
    log.info('Testing health endpoint...');
    const healthResponse = await fetch(`${serverUrl}/health`);

    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      log.success(`Health check passed - Status: ${healthData.status}`);
      log.info(`Active rooms: ${healthData.activeRooms}, Connected players: ${healthData.connectedPlayers}`);
    } else {
      log.error(`Health check failed - Status: ${healthResponse.status}`);
      return false;
    }

    // Test 2: Socket.IO Connection
    log.info('Testing Socket.IO connection...');

    return new Promise((resolve) => {
      const socket = io(serverUrl, {
        transports: ['websocket', 'polling'],
        timeout: 10000
      });

      let connectionSuccess = false;

      socket.on('connect', () => {
        log.success('Socket.IO connection established');
        connectionSuccess = true;

        // Test 3: Room Creation
        log.info('Testing room creation...');
        socket.emit('create-room', {
          playerName: 'TestPlayer',
          maxPlayers: 4,
          isPrivate: false,
          avatar: 'default',
          audioSettings: { enabled: true }
        });
      });

      socket.on('room-created', (data) => {
        log.success(`Room created successfully - Room ID: ${data.roomId}`);

        // Test 4: Disconnect
        log.info('Testing graceful disconnection...');
        socket.disconnect();

        setTimeout(() => {
          log.success('All tests passed! 🎉');
          log.info('Your Ludo Master server is ready for production!');
          resolve(true);
        }, 1000);
      });

      socket.on('connect_error', (error) => {
        log.error(`Socket.IO connection failed: ${error.message}`);
        resolve(false);
      });

      socket.on('error', (error) => {
        log.error(`Server error: ${error.message}`);
        resolve(false);
      });

      // Timeout after 15 seconds
      setTimeout(() => {
        if (!connectionSuccess) {
          log.error('Connection timeout - server may not be responding');
          socket.disconnect();
          resolve(false);
        }
      }, 15000);
    });

  } catch (error) {
    log.error(`Verification failed: ${error.message}`);
    return false;
  }
}

// Get server URL from command line argument or environment
const serverUrl = process.argv[2] || process.env.SERVER_URL || 'http://localhost:3001';

if (!serverUrl.startsWith('http')) {
  log.error('Please provide a valid server URL');
  log.info('Usage: node verify-deployment.js https://your-app.onrender.com');
  process.exit(1);
}

verifyDeployment(serverUrl)
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    log.error(`Verification script error: ${error.message}`);
    process.exit(1);
  });
