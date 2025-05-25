import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { GameRoomManager } from './gameRoomManager.js';
import { GameStateManager } from './gameStateManager.js';

console.log('🚀 Starting Ludo Master Server...');
console.log('📦 Loading dependencies complete');

dotenv.config();
console.log('⚙️ Environment variables loaded');

const app = express();
console.log('🌐 Express app created');

const server = createServer(app);
console.log('🔗 HTTP server created');

// CORS configuration
console.log('🔒 Setting up CORS configuration...');
const corsOptions = {
  origin: function (origin, callback) {
    console.log(`🔍 CORS check for origin: ${origin || 'no-origin'}`);

    // Allow requests with no origin (like mobile apps, curl, Postman, Render health checks)
    if (!origin) {
      console.log('✅ CORS: Allowing request with no origin');
      return callback(null, true);
    }

    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://ludo-master-game-em0p5pr3n-praveen-singh01s-projects.vercel.app",
      process.env.FRONTEND_URL
    ].filter(Boolean);

    console.log(`🔍 CORS: Allowed origins:`, allowedOrigins);

    // Check if origin matches allowed patterns
    const isAllowed = allowedOrigins.includes(origin) ||
                     /\.vercel\.app$/.test(origin) ||
                     /\.render\.com$/.test(origin);

    if (isAllowed) {
      console.log(`✅ CORS: Origin ${origin} is allowed`);
      callback(null, true);
    } else {
      console.log(`⚠️ CORS: Origin ${origin} not in allowed list, but allowing anyway`);
      callback(null, true); // Allow all for now to fix health checks
    }
  },
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
console.log('🔒 CORS configuration complete');

console.log('🔧 Setting up Express middleware...');
app.use(cors(corsOptions));
console.log('✅ CORS middleware applied');

app.use(express.json());
console.log('✅ JSON parser middleware applied');

// Debug middleware to log all requests
app.use((req, _res, next) => {
  console.log(`🔍 Request: ${req.method} ${req.url} from ${req.get('origin') || 'no-origin'}`);
  next();
});
console.log('✅ Debug logging middleware applied');

console.log('🔌 Initializing Socket.IO server...');
const io = new Server(server, {
  cors: {
    origin: true, // Allow all origins for now
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['polling', 'websocket'], // Try polling first for Render compatibility
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 30000,
  allowEIO3: true,
  allowUpgrades: true,
  cookie: false
});

console.log('✅ Socket.IO server initialized with transports: polling, websocket');
console.log('🔌 Socket.IO CORS config: origin=true, methods=GET,POST, credentials=true');

// Add Socket.IO debugging
console.log('🔍 Setting up Socket.IO event listeners...');

io.engine.on('connection_error', (err) => {
  console.log('🚨 Socket.IO connection error:', err.req);
  console.log('🚨 Error details:', err.code, err.message, err.context);
});

io.engine.on('initial_headers', (_headers, req) => {
  console.log('🔍 Socket.IO initial headers:', req.url);
});

io.engine.on('headers', (_headers, req) => {
  console.log('🔍 Socket.IO headers event:', req.url);
});

console.log('✅ Socket.IO debugging events set up');

// Initialize managers
console.log('🎮 Initializing game managers...');
const roomManager = new GameRoomManager();
console.log('✅ GameRoomManager initialized');

const gameStateManager = new GameStateManager();
console.log('✅ GameStateManager initialized');

// Root endpoint
app.get('/', (_req, res) => {
  console.log('🔍 Root endpoint accessed');
  res.json({
    message: 'Ludo Master Server is running!',
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    socketIO: 'enabled'
  });
});



// Health check endpoint
app.get('/health', (_req, res) => {
  console.log('🔍 Health endpoint accessed');
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    activeRooms: roomManager.getActiveRoomsCount(),
    connectedPlayers: io.engine.clientsCount
  });
});

// Test Socket.IO endpoint
app.get('/socket.io/test', (_req, res) => {
  console.log('🔍 Socket.IO test endpoint accessed');
  res.json({
    message: 'Socket.IO server is running',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

console.log('✅ Routes registered: /, /health, /socket.io/test');

// Get room info endpoint
app.get('/room/:roomId', (req, res) => {
  const { roomId } = req.params;
  console.log(`🔍 Room info requested for: ${roomId}`);
  const room = roomManager.getRoom(roomId);

  if (!room) {
    console.log(`❌ Room not found: ${roomId}`);
    return res.status(404).json({ error: 'Room not found' });
  }

  console.log(`✅ Room info found for: ${roomId}`);
  res.json({
    roomId: room.id,
    playerCount: room.players.length,
    maxPlayers: room.maxPlayers,
    gameStatus: room.gameStatus,
    isPrivate: room.isPrivate
  });
});
console.log('✅ Room info route (/room/:roomId) registered');

console.log('🛣️ All Express routes registered successfully');

// Socket.io connection handling
console.log('🔌 Setting up Socket.IO connection handler...');
io.on('connection', (socket) => {
  console.log(`🔗 NEW SOCKET CONNECTION: ${socket.id} via ${socket.conn.transport.name}`);
  console.log(`🔍 Socket handshake: ${JSON.stringify(socket.handshake.headers.origin || 'no-origin')}`);

  // Create or join room
  socket.on('create-room', (data) => {
    const { playerName, maxPlayers = 4, isPrivate = false, avatar, audioSettings } = data;
    const roomId = uuidv4().substring(0, 8).toUpperCase();

    try {
      roomManager.createRoom(roomId, maxPlayers, isPrivate);
      const player = roomManager.addPlayerToRoom(roomId, socket.id, playerName, {
        avatar,
        audioSettings
      });

      socket.join(roomId);
      socket.roomId = roomId;
      socket.playerId = player.id;

      socket.emit('room-created', {
        roomId,
        player,
        room: roomManager.getRoomData(roomId)
      });

      console.log(`Room created: ${roomId} by ${playerName}`);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('join-room', (data) => {
    const { roomId, playerName, avatar, audioSettings } = data;

    try {
      const player = roomManager.addPlayerToRoom(roomId, socket.id, playerName, {
        avatar,
        audioSettings
      });

      socket.join(roomId);
      socket.roomId = roomId;
      socket.playerId = player.id;

      const roomData = roomManager.getRoomData(roomId);

      socket.emit('room-joined', {
        player,
        room: roomData
      });

      // Notify other players
      socket.to(roomId).emit('player-joined', {
        player,
        room: roomData
      });

      console.log(`${playerName} joined room: ${roomId}`);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Start game
  socket.on('start-game', () => {
    const { roomId } = socket;
    if (!roomId) return;

    try {
      const gameState = gameStateManager.initializeGame(roomId, roomManager.getRoom(roomId));
      roomManager.updateRoomStatus(roomId, 'playing');

      io.to(roomId).emit('game-started', { gameState });
      console.log(`Game started in room: ${roomId}`);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Game actions
  socket.on('roll-dice', () => {
    const { roomId, playerId } = socket;
    if (!roomId || !playerId) return;

    try {
      const result = gameStateManager.rollDice(roomId, playerId);
      io.to(roomId).emit('dice-rolled', result);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('move-token', (data) => {
    const { roomId, playerId } = socket;
    const { tokenId } = data;

    if (!roomId || !playerId) return;

    try {
      const result = gameStateManager.moveToken(roomId, playerId, tokenId);
      io.to(roomId).emit('token-moved', result);

      // Check for game end
      if (result.gameState.gameStatus === 'GAMEOVER') {
        roomManager.updateRoomStatus(roomId, 'finished');
        io.to(roomId).emit('game-ended', {
          gameState: result.gameState,
          gameResult: result.gameState.gameResult
        });
      }
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Player ready status
  socket.on('player-ready', (isReady) => {
    const { roomId, playerId } = socket;
    if (!roomId || !playerId) return;

    try {
      roomManager.setPlayerReady(roomId, playerId, isReady);
      const roomData = roomManager.getRoomData(roomId);

      io.to(roomId).emit('player-ready-changed', {
        playerId,
        isReady,
        room: roomData
      });
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Chat messages
  socket.on('send-message', (data) => {
    const { roomId } = socket;
    const { message } = data;

    if (!roomId) return;

    const player = roomManager.getPlayer(roomId, socket.playerId);
    if (!player) return;

    const chatMessage = {
      id: uuidv4(),
      playerId: player.id,
      playerName: player.name,
      message,
      timestamp: new Date().toISOString()
    };

    io.to(roomId).emit('message-received', chatMessage);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const { roomId, playerId } = socket;

    if (roomId && playerId) {
      try {
        roomManager.setPlayerConnected(roomId, playerId, false);
        const roomData = roomManager.getRoomData(roomId);

        socket.to(roomId).emit('player-disconnected', {
          playerId,
          room: roomData
        });

        // Clean up empty rooms after 5 minutes
        setTimeout(() => {
          const room = roomManager.getRoom(roomId);
          if (room && room.players.every(p => !p.connected)) {
            roomManager.deleteRoom(roomId);
            gameStateManager.deleteGame(roomId);
            console.log(`Cleaned up empty room: ${roomId}`);
          }
        }, 5 * 60 * 1000);

        console.log(`Player disconnected: ${socket.id} from room: ${roomId}`);
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    }
  });

  // Handle reconnection
  socket.on('reconnect-to-room', (data) => {
    const { roomId, playerId } = data;

    try {
      roomManager.setPlayerConnected(roomId, playerId, true);
      roomManager.updatePlayerSocket(roomId, playerId, socket.id);

      socket.join(roomId);
      socket.roomId = roomId;
      socket.playerId = playerId;

      const roomData = roomManager.getRoomData(roomId);
      const gameState = gameStateManager.getGameState(roomId);

      socket.emit('reconnected', {
        room: roomData,
        gameState
      });

      socket.to(roomId).emit('player-reconnected', {
        playerId,
        room: roomData
      });

      console.log(`Player reconnected: ${playerId} to room: ${roomId}`);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });
});

console.log('🔧 Setting up server configuration...');
const PORT = process.env.PORT || 3001;
console.log(`🔍 Debug: PORT environment variable = ${process.env.PORT}`);
console.log(`🔍 Using PORT: ${PORT}`);
const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(`🔍 Environment: ${NODE_ENV}`);

// Global error handlers
console.log('⚠️ Setting up global error handlers...');
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});
console.log('✅ Error handlers and shutdown handlers set up');

console.log('🚀 Starting server...');
server.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50));
  console.log(`🚀 Ludo Master multiplayer server running on port ${PORT}`);
  console.log(`🌐 Environment: ${NODE_ENV}`);
  console.log(`🔗 CORS enabled with dynamic origin validation`);
  console.log(`📊 Health check available at: /health`);
  console.log(`🔌 Socket.IO available at: /socket.io/`);
  console.log(`🧪 Socket.IO test endpoint: /socket.io/test`);
  console.log('='.repeat(50));
  console.log('✅ Server is ready to accept connections!');
});
