import { v4 as uuidv4 } from 'uuid';

export class GameRoomManager {
  constructor() {
    this.rooms = new Map();
    this.playerColors = ['RED', 'GREEN', 'YELLOW', 'BLUE'];
  }

  createRoom(roomId, maxPlayers = 4, isPrivate = false) {
    if (this.rooms.has(roomId)) {
      throw new Error('Room already exists');
    }

    const room = {
      id: roomId,
      maxPlayers: Math.min(maxPlayers, 4),
      isPrivate,
      gameStatus: 'waiting', // waiting, playing, finished
      players: [],
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };

    this.rooms.set(roomId, room);
    return room;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  getRoomData(roomId) {
    const room = this.getRoom(roomId);
    if (!room) return null;

    return {
      id: room.id,
      maxPlayers: room.maxPlayers,
      isPrivate: room.isPrivate,
      gameStatus: room.gameStatus,
      players: room.players.map(p => ({
        id: p.id,
        name: p.name,
        color: p.color,
        avatar: p.avatar,
        audioSettings: p.audioSettings,
        isReady: p.isReady,
        connected: p.connected,
        isHost: p.isHost
      })),
      createdAt: room.createdAt,
      lastActivity: room.lastActivity
    };
  }

  addPlayerToRoom(roomId, socketId, playerName, playerData = {}) {
    const room = this.getRoom(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.players.length >= room.maxPlayers) {
      throw new Error('Room is full');
    }

    if (room.gameStatus === 'playing') {
      throw new Error('Game is already in progress');
    }

    // Check if player name is already taken
    if (room.players.some(p => p.name === playerName)) {
      throw new Error('Player name already taken');
    }

    // Assign color
    const usedColors = room.players.map(p => p.color);
    const availableColors = this.playerColors.filter(color => !usedColors.includes(color));

    if (availableColors.length === 0) {
      throw new Error('No available colors');
    }

    const player = {
      id: uuidv4(),
      socketId,
      name: playerName,
      color: availableColors[0],
      avatar: playerData.avatar || 'default',
      audioSettings: {
        soundEnabled: true,
        masterVolume: 0.7,
        soundEffectsVolume: 0.8,
        musicVolume: 0.5,
        notificationsVolume: 0.6,
        ...playerData.audioSettings
      },
      isReady: false,
      connected: true,
      isHost: room.players.length === 0, // First player is host
      joinedAt: new Date().toISOString()
    };

    room.players.push(player);
    room.lastActivity = new Date().toISOString();

    return player;
  }

  removePlayerFromRoom(roomId, playerId) {
    const room = this.getRoom(roomId);
    if (!room) return false;

    const playerIndex = room.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return false;

    const removedPlayer = room.players[playerIndex];
    room.players.splice(playerIndex, 1);

    // If host left, assign new host
    if (removedPlayer.isHost && room.players.length > 0) {
      room.players[0].isHost = true;
    }

    room.lastActivity = new Date().toISOString();
    return true;
  }

  getPlayer(roomId, playerId) {
    const room = this.getRoom(roomId);
    if (!room) return null;

    return room.players.find(p => p.id === playerId);
  }

  setPlayerReady(roomId, playerId, isReady) {
    const room = this.getRoom(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    const player = room.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    player.isReady = isReady;
    room.lastActivity = new Date().toISOString();

    return player;
  }

  setPlayerConnected(roomId, playerId, connected) {
    const room = this.getRoom(roomId);
    if (!room) return false;

    const player = room.players.find(p => p.id === playerId);
    if (!player) return false;

    player.connected = connected;
    room.lastActivity = new Date().toISOString();

    return true;
  }

  updatePlayerSocket(roomId, playerId, newSocketId) {
    const room = this.getRoom(roomId);
    if (!room) return false;

    const player = room.players.find(p => p.id === playerId);
    if (!player) return false;

    player.socketId = newSocketId;
    room.lastActivity = new Date().toISOString();

    return true;
  }

  updateRoomStatus(roomId, status) {
    const room = this.getRoom(roomId);
    if (!room) return false;

    room.gameStatus = status;
    room.lastActivity = new Date().toISOString();

    return true;
  }

  canStartGame(roomId) {
    const room = this.getRoom(roomId);
    if (!room) return false;

    // Need at least 2 players, all must be ready and connected
    return room.players.length >= 2 &&
           room.players.every(p => p.isReady && p.connected) &&
           room.gameStatus === 'waiting';
  }

  deleteRoom(roomId) {
    return this.rooms.delete(roomId);
  }

  getActiveRoomsCount() {
    return this.rooms.size;
  }

  // Clean up inactive rooms (older than 1 hour with no activity)
  cleanupInactiveRooms() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    for (const [roomId, room] of this.rooms.entries()) {
      const lastActivity = new Date(room.lastActivity);

      if (lastActivity < oneHourAgo) {
        this.deleteRoom(roomId);
        console.log(`Cleaned up inactive room: ${roomId}`);
      }
    }
  }

  // Get room statistics
  getRoomStats(roomId) {
    const room = this.getRoom(roomId);
    if (!room) return null;

    return {
      id: room.id,
      playerCount: room.players.length,
      maxPlayers: room.maxPlayers,
      connectedPlayers: room.players.filter(p => p.connected).length,
      readyPlayers: room.players.filter(p => p.isReady).length,
      gameStatus: room.gameStatus,
      canStart: this.canStartGame(roomId),
      createdAt: room.createdAt,
      lastActivity: room.lastActivity
    };
  }
}

// Run cleanup every 30 minutes
setInterval(() => {
  const manager = new GameRoomManager();
  manager.cleanupInactiveRooms();
}, 30 * 60 * 1000);
