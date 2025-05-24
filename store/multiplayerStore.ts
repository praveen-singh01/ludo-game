import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { io, Socket } from 'socket.io-client'
import { GameState } from '../types'

export interface MultiplayerPlayer {
  id: string
  name: string
  color: string
  isReady: boolean
  connected: boolean
  isHost: boolean
}

export interface GameRoom {
  id: string
  maxPlayers: number
  isPrivate: boolean
  gameStatus: 'waiting' | 'playing' | 'finished'
  players: MultiplayerPlayer[]
  createdAt: string
  lastActivity: string
}

export interface ChatMessage {
  id: string
  playerId: string
  playerName: string
  message: string
  timestamp: string
}

interface MultiplayerState {
  // Connection
  socket: Socket | null
  connected: boolean
  connecting: boolean

  // Player
  playerId: string | null
  playerName: string

  // Room
  currentRoom: GameRoom | null
  roomId: string | null

  // Game
  multiplayerGameState: GameState | null
  isMultiplayerGame: boolean

  // Chat
  chatMessages: ChatMessage[]

  // UI
  showLobby: boolean
  showChat: boolean
  connectionError: string | null

  // Actions
  connect: (serverUrl?: string) => void
  disconnect: () => void
  createRoom: (playerName: string, maxPlayers?: number, isPrivate?: boolean) => void
  joinRoom: (roomId: string, playerName: string) => void
  leaveRoom: () => void
  setPlayerReady: (isReady: boolean) => void
  startGame: () => void
  rollDice: () => void
  moveToken: (tokenId: string) => void
  sendMessage: (message: string) => void
  reconnectToRoom: (roomId: string, playerId: string) => void

  // Setters
  setPlayerName: (name: string) => void
  setShowLobby: (show: boolean) => void
  setShowChat: (show: boolean) => void
  clearError: () => void
}

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'

export const useMultiplayerStore = create<MultiplayerState>()(
  persist(
    (set, get) => ({
      // Initial state
      socket: null,
      connected: false,
      connecting: false,
      playerId: null,
      playerName: '',
      currentRoom: null,
      roomId: null,
      multiplayerGameState: null,
      isMultiplayerGame: false,
      chatMessages: [],
      showLobby: false,
      showChat: false,
      connectionError: null,

      // Actions
      connect: (serverUrl = SERVER_URL) => {
        const { socket: existingSocket } = get()

        if (existingSocket?.connected) {
          return
        }

        set({ connecting: true, connectionError: null })

        const socket = io(serverUrl, {
          transports: ['websocket', 'polling'],
          timeout: 10000,
          forceNew: true
        })

        // Connection events
        socket.on('connect', () => {
          console.log('Connected to multiplayer server')
          set({
            socket,
            connected: true,
            connecting: false,
            connectionError: null
          })
        })

        socket.on('disconnect', (reason) => {
          console.log('Disconnected from server:', reason)
          set({
            connected: false,
            connectionError: `Disconnected: ${reason}`
          })
        })

        socket.on('connect_error', (error) => {
          console.error('Connection error:', error)
          set({
            connecting: false,
            connectionError: `Connection failed: ${error.message}`
          })
        })

        // Room events
        socket.on('room-created', (data) => {
          const { roomId, player, room } = data
          set({
            currentRoom: room,
            roomId,
            playerId: player.id,
            showLobby: true
          })
        })

        socket.on('room-joined', (data) => {
          const { player, room } = data
          set({
            currentRoom: room,
            roomId: room.id,
            playerId: player.id,
            showLobby: true
          })
        })

        socket.on('player-joined', (data) => {
          const { room } = data
          set({ currentRoom: room })
        })

        socket.on('player-disconnected', (data) => {
          const { room } = data
          set({ currentRoom: room })
        })

        socket.on('player-reconnected', (data) => {
          const { room } = data
          set({ currentRoom: room })
        })

        socket.on('player-ready-changed', (data) => {
          const { room } = data
          set({ currentRoom: room })
        })

        // Game events
        socket.on('game-started', (data) => {
          const { gameState } = data
          set({
            multiplayerGameState: gameState,
            isMultiplayerGame: true,
            showLobby: false
          })
        })

        socket.on('dice-rolled', (data) => {
          const { gameState } = data
          set({ multiplayerGameState: gameState })
        })

        socket.on('token-moved', (data) => {
          const { gameState } = data
          set({ multiplayerGameState: gameState })
        })

        socket.on('game-ended', (data) => {
          const { gameState } = data
          set({ multiplayerGameState: gameState })
        })

        // Chat events
        socket.on('message-received', (message: ChatMessage) => {
          set(state => ({
            chatMessages: [...state.chatMessages, message]
          }))
        })

        // Reconnection events
        socket.on('reconnected', (data) => {
          const { room, gameState } = data
          set({
            currentRoom: room,
            multiplayerGameState: gameState,
            isMultiplayerGame: !!gameState,
            showLobby: !gameState
          })
        })

        // Error events
        socket.on('error', (data) => {
          console.error('Server error:', data)
          set({ connectionError: data.message })
        })

        set({ socket })
      },

      disconnect: () => {
        const { socket } = get()
        if (socket) {
          socket.disconnect()
        }
        set({
          socket: null,
          connected: false,
          currentRoom: null,
          roomId: null,
          playerId: null,
          multiplayerGameState: null,
          isMultiplayerGame: false,
          chatMessages: [],
          showLobby: false
        })
      },

      createRoom: (playerName: string, maxPlayers = 4, isPrivate = false) => {
        const { socket } = get()
        if (!socket?.connected) return

        set({ playerName })
        socket.emit('create-room', { playerName, maxPlayers, isPrivate })
      },

      joinRoom: (roomId: string, playerName: string) => {
        const { socket } = get()
        if (!socket?.connected) return

        set({ playerName })
        socket.emit('join-room', { roomId, playerName })
      },

      leaveRoom: () => {
        const { socket } = get()
        if (!socket?.connected) return

        socket.disconnect()
        set({
          currentRoom: null,
          roomId: null,
          playerId: null,
          multiplayerGameState: null,
          isMultiplayerGame: false,
          chatMessages: [],
          showLobby: false
        })
      },

      setPlayerReady: (isReady: boolean) => {
        const { socket } = get()
        if (!socket?.connected) return

        socket.emit('player-ready', isReady)
      },

      startGame: () => {
        const { socket } = get()
        if (!socket?.connected) return

        socket.emit('start-game')
      },

      rollDice: () => {
        const { socket } = get()
        if (!socket?.connected) return

        socket.emit('roll-dice')
      },

      moveToken: (tokenId: string) => {
        const { socket } = get()
        if (!socket?.connected) return

        socket.emit('move-token', { tokenId })
      },

      sendMessage: (message: string) => {
        const { socket } = get()
        if (!socket?.connected) return

        socket.emit('send-message', { message })
      },

      reconnectToRoom: (roomId: string, playerId: string) => {
        const { socket } = get()
        if (!socket?.connected) return

        socket.emit('reconnect-to-room', { roomId, playerId })
      },

      // Setters
      setPlayerName: (name: string) => set({ playerName: name }),
      setShowLobby: (show: boolean) => set({ showLobby: show }),
      setShowChat: (show: boolean) => set({ showChat: show }),
      clearError: () => set({ connectionError: null })
    }),
    {
      name: 'multiplayer-store',
      partialize: (state) => ({
        playerName: state.playerName,
        roomId: state.roomId,
        playerId: state.playerId
      })
    }
  )
)
