import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { GameRoomManager } from './gameRoomManager.js';
import { GameStateManager } from './gameStateManager.js';

dotenv.config();

const app = express();
const server = createServer(app);

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://ludo-master-game-em0p5pr3n-praveen-singh01s-projects.vercel.app",
    /\.vercel\.app$/
  ],
  credentials: true,
  methods: ["GET", "POST"]
};

app.use(cors(corsOptions));
app.use(express.json());

const io = new Server(server, {
  cors: corsOptions,
  transports: ['websocket', 'polling']
});

// Initialize managers
const roomManager = new GameRoomManager();
const gameStateManager = new GameStateManager();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    activeRooms: roomManager.getActiveRoomsCount(),
    connectedPlayers: io.engine.clientsCount
  });
});

// Get room info endpoint
app.get('/room/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = roomManager.getRoom(roomId);
  
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  res.json({
    roomId: room.id,
    playerCount: room.players.length,
    maxPlayers: room.maxPlayers,
    gameStatus: room.gameStatus,
    isPrivate: room.isPrivate
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);
  
  // Create or join room
  socket.on('create-room', (data) => {
    const { playerName, maxPlayers = 4, isPrivate = false } = data;
    const roomId = uuidv4().substring(0, 8).toUpperCase();
    
    try {
      const room = roomManager.createRoom(roomId, maxPlayers, isPrivate);
      const player = roomManager.addPlayerToRoom(roomId, socket.id, playerName);
      
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
    const { roomId, playerName } = data;
    
    try {
      const player = roomManager.addPlayerToRoom(roomId, socket.id, playerName);
      
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
        io.to(roomId).emit('game-ended', result);
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

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Ludo Master multiplayer server running on port ${PORT}`);
  console.log(`🌐 CORS enabled for: ${corsOptions.origin.join(', ')}`);
});
