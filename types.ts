// Player colors enum
export enum PlayerColor {
  RED = 'RED',
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  BLUE = 'BLUE'
}

// Token states
export enum TokenState {
  HOME = 'HOME',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED'
}

// Game status
export type GameStatus = 'SETUP' | 'PLAYING' | 'GAMEOVER';

// Token interface
export interface Token {
  id: string;
  color: PlayerColor;
  position: number;
  state: TokenState;
}

// Player interface
export interface Player {
  id: PlayerColor;
  name: string;
  tokens: Token[];
  isAI?: boolean;
  playerId?: string; // For multiplayer
}

// Available move interface
export interface AvailableMove {
  tokenId: string;
  newPosition: number;
}

// Game state interface
export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number | null;
  hasRolled: boolean;
  winner: PlayerColor | null;
  gameStatus: GameStatus;
  message: string;
  availableMoves: AvailableMove[];
  roomId?: string; // For multiplayer
  turnStartTime?: string; // For multiplayer
  gameStartTime?: string; // For multiplayer
}

// Coordinate interface for board positions
export interface Coordinate {
  row: number;
  col: number;
}

// Game configuration interface
export interface GameConfig {
  numPlayers: number;
  gameMode?: 'classic' | 'quick' | 'custom';
  aiDifficulty?: 'easy' | 'medium' | 'hard';
}

// Player setup configuration
export interface PlayerSetupConfig {
  id: PlayerColor;
  name: string;
  baseColor: string;
  rawBaseColor: string;
  textColor: string;
  homeTriangleCoords: Coordinate[];
  homeSpotCoords: Coordinate[];
  startIndex: number;
  finishLaneBase: number;
}

// Game statistics
export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  totalPlayTime: number;
  longestGame: number;
  favoriteColor: PlayerColor | null;
  winsByColor: Record<PlayerColor, number>;
}

// Game settings
export interface GameSettings {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  aiDifficulty: 'easy' | 'medium' | 'hard';
  gameMode: 'classic' | 'quick' | 'custom';
  autoSave: boolean;
}

// Multiplayer specific types
export interface MultiplayerPlayer {
  id: string;
  name: string;
  color: PlayerColor;
  isReady: boolean;
  connected: boolean;
  isHost: boolean;
  socketId?: string;
  joinedAt?: string;
}

export interface GameRoom {
  id: string;
  maxPlayers: number;
  isPrivate: boolean;
  gameStatus: 'waiting' | 'playing' | 'finished';
  players: MultiplayerPlayer[];
  createdAt: string;
  lastActivity: string;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: string;
}

// Move result for multiplayer
export interface MoveResult {
  gameState: GameState;
  move: {
    playerId: string;
    tokenId: string;
    from: number;
    to: number;
    capturedTokens: Array<{
      tokenId: string;
      playerId: string;
      playerName: string;
    }>;
  };
  gainedExtraTurn: boolean;
}

// Dice roll result for multiplayer
export interface DiceRollResult {
  gameState: GameState;
  diceValue: number;
  availableMoves: AvailableMove[];
  currentPlayer: string;
}
