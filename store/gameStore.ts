import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GameState, Player, PlayerColor } from '../types'

interface GameSettings {
  soundEnabled: boolean
  animationsEnabled: boolean
  aiDifficulty: 'easy' | 'medium' | 'hard'
  gameMode: 'classic' | 'quick' | 'custom'
  autoSave: boolean
}

interface GameStats {
  gamesPlayed: number
  gamesWon: number
  totalPlayTime: number
  longestGame: number
  favoriteColor: PlayerColor | null
  winsByColor: Record<PlayerColor, number>
}

interface GameStore {
  // Game state
  gameState: GameState
  settings: GameSettings
  stats: GameStats
  
  // Game history
  gameHistory: Array<{
    id: string
    date: string
    players: Player[]
    winner: PlayerColor | null
    duration: number
    moves: number
  }>
  
  // Actions
  updateGameState: (gameState: GameState) => void
  updateSettings: (settings: Partial<GameSettings>) => void
  updateStats: (stats: Partial<GameStats>) => void
  addGameToHistory: (game: any) => void
  clearHistory: () => void
  resetStats: () => void
  
  // Save/Load
  saveGame: (name: string) => void
  loadGame: (id: string) => GameState | null
  getSavedGames: () => Array<{ id: string; name: string; date: string; gameState: GameState }>
  deleteSavedGame: (id: string) => void
}

const defaultGameState: GameState = {
  players: [],
  currentPlayerIndex: 0,
  diceValue: null,
  hasRolled: false,
  winner: null,
  gameStatus: 'SETUP',
  message: 'Select number of players to start.',
  availableMoves: [],
}

const defaultSettings: GameSettings = {
  soundEnabled: true,
  animationsEnabled: true,
  aiDifficulty: 'medium',
  gameMode: 'classic',
  autoSave: true,
}

const defaultStats: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  totalPlayTime: 0,
  longestGame: 0,
  favoriteColor: null,
  winsByColor: {
    [PlayerColor.RED]: 0,
    [PlayerColor.GREEN]: 0,
    [PlayerColor.YELLOW]: 0,
    [PlayerColor.BLUE]: 0,
  },
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      gameState: defaultGameState,
      settings: defaultSettings,
      stats: defaultStats,
      gameHistory: [],
      
      updateGameState: (gameState) => set({ gameState }),
      
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      
      updateStats: (newStats) =>
        set((state) => ({
          stats: { ...state.stats, ...newStats },
        })),
      
      addGameToHistory: (game) =>
        set((state) => ({
          gameHistory: [game, ...state.gameHistory].slice(0, 50), // Keep last 50 games
        })),
      
      clearHistory: () => set({ gameHistory: [] }),
      
      resetStats: () => set({ stats: defaultStats }),
      
      saveGame: (name) => {
        const { gameState } = get()
        const savedGames = JSON.parse(localStorage.getItem('ludo-saved-games') || '[]')
        const newSave = {
          id: Date.now().toString(),
          name,
          date: new Date().toISOString(),
          gameState,
        }
        savedGames.push(newSave)
        localStorage.setItem('ludo-saved-games', JSON.stringify(savedGames))
      },
      
      loadGame: (id) => {
        const savedGames = JSON.parse(localStorage.getItem('ludo-saved-games') || '[]')
        const game = savedGames.find((g: any) => g.id === id)
        return game ? game.gameState : null
      },
      
      getSavedGames: () => {
        return JSON.parse(localStorage.getItem('ludo-saved-games') || '[]')
      },
      
      deleteSavedGame: (id) => {
        const savedGames = JSON.parse(localStorage.getItem('ludo-saved-games') || '[]')
        const filtered = savedGames.filter((g: any) => g.id !== id)
        localStorage.setItem('ludo-saved-games', JSON.stringify(filtered))
      },
    }),
    {
      name: 'ludo-game-store',
      partialize: (state) => ({
        settings: state.settings,
        stats: state.stats,
        gameHistory: state.gameHistory,
      }),
    }
  )
)
