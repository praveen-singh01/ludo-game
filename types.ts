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
  aiDifficulty?: 'easy' | 'medium' | 'hard';
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

// Ranking and Reward System Types

// Player ranking tiers
export enum RankTier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND',
  MASTER = 'MASTER',
  GRANDMASTER = 'GRANDMASTER'
}

// Achievement types
export enum AchievementType {
  FIRST_WIN = 'FIRST_WIN',
  WIN_STREAK = 'WIN_STREAK',
  GAMES_PLAYED = 'GAMES_PLAYED',
  COINS_EARNED = 'COINS_EARNED',
  PERFECT_GAME = 'PERFECT_GAME',
  COMEBACK_KING = 'COMEBACK_KING',
  SPEED_DEMON = 'SPEED_DEMON',
  SOCIAL_BUTTERFLY = 'SOCIAL_BUTTERFLY'
}

// Cosmetic item types
export enum CosmeticType {
  TOKEN_SKIN = 'TOKEN_SKIN',
  BOARD_THEME = 'BOARD_THEME',
  DICE_DESIGN = 'DICE_DESIGN',
  AVATAR = 'AVATAR',
  EMOTE = 'EMOTE',
  VICTORY_ANIMATION = 'VICTORY_ANIMATION'
}

// User profile interface
export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  createdAt: string;
  lastLoginAt: string;
  isOnline: boolean;

  // Coin system
  coins: number;
  totalCoinsEarned: number;

  // Ranking system
  rank: number;
  tier: RankTier;
  experience: number;

  // Statistics
  stats: PlayerStatistics;

  // Social features
  friends: string[];
  friendRequests: FriendRequest[];

  // Cosmetics
  ownedCosmetics: string[];
  equippedCosmetics: EquippedCosmetics;

  // Achievements
  achievements: Achievement[];

  // Preferences
  settings: UserSettings;
}

// Enhanced player statistics
export interface PlayerStatistics {
  // Game statistics
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  winPercentage: number;
  averagePosition: number;

  // Performance metrics
  totalPlayTime: number; // in minutes
  averageGameTime: number; // in minutes
  fastestWin: number; // in minutes
  longestGame: number; // in minutes

  // Streak tracking
  currentWinStreak: number;
  bestWinStreak: number;
  currentLossStreak: number;

  // Position statistics
  firstPlaceFinishes: number;
  secondPlaceFinishes: number;
  thirdPlaceFinishes: number;
  fourthPlaceFinishes: number;

  // Token statistics
  tokensFinished: number;
  tokensCaptured: number;
  tokensLost: number;

  // Special achievements
  perfectGames: number; // Won without losing any tokens
  comebackWins: number; // Won from last place

  // Daily/Weekly stats
  dailyGamesPlayed: number;
  weeklyGamesPlayed: number;
  lastGameDate: string;

  // Coin statistics
  totalCoinsEarned: number;
  totalCoinsSpent: number;

  // Social statistics
  friendsCount: number;
  gamesWithFriends: number;
}

// Achievement interface
export interface Achievement {
  id: string;
  type: AchievementType;
  name: string;
  description: string;
  icon: string;
  coinReward: number;
  unlockedAt: string;
  progress?: number;
  maxProgress?: number;
}

// Cosmetic item interface
export interface CosmeticItem {
  id: string;
  name: string;
  description: string;
  type: CosmeticType;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  price: number;
  isPremium: boolean;
  previewImage: string;
  unlockRequirement?: string;
  gender?: 'male' | 'female';
  emoji?: string;
}

// Equipped cosmetics
export interface EquippedCosmetics {
  tokenSkin?: string;
  boardTheme?: string;
  diceDesign?: string;
  avatar?: string;
  victoryAnimation?: string;
}

// Friend request interface
export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUsername: string;
  toUserId: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
}

// User settings interface
export interface UserSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  masterVolume?: number;
  soundEffectsVolume?: number;
  musicVolume?: number;
  notificationsVolume?: number;
  notificationsEnabled: boolean;
  autoAcceptFriendRequests: boolean;
  showOnlineStatus: boolean;
  allowSpectators: boolean;
  preferredGameMode: 'classic' | 'quick' | 'tournament';
  language: string;
  theme: 'light' | 'dark' | 'auto';
}

// Leaderboard entry
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  tier: RankTier;
  coins: number;
  gamesWon: number;
  winPercentage: number;
  isOnline: boolean;
  isFriend: boolean;
}

// Tournament interface
export interface Tournament {
  id: string;
  name: string;
  description: string;
  entryFee: number;
  prizePool: number;
  maxParticipants: number;
  currentParticipants: number;
  status: 'UPCOMING' | 'REGISTRATION' | 'IN_PROGRESS' | 'COMPLETED';
  startTime: string;
  endTime?: string;
  participants: TournamentParticipant[];
  brackets: TournamentBracket[];
  rules: TournamentRules;
}

// Tournament participant
export interface TournamentParticipant {
  userId: string;
  username: string;
  avatar?: string;
  tier: RankTier;
  registeredAt: string;
  currentRound: number;
  isEliminated: boolean;
  placement?: number;
  prizeWon?: number;
}

// Tournament bracket
export interface TournamentBracket {
  id: string;
  round: number;
  match: number;
  participants: string[];
  winner?: string;
  gameId?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

// Tournament rules
export interface TournamentRules {
  gameMode: 'classic' | 'quick';
  timeLimit?: number;
  eliminationStyle: 'SINGLE' | 'DOUBLE';
  tieBreaker: 'COINS' | 'TIME' | 'RANDOM';
}

// Daily challenge interface
export interface DailyChallenge {
  id: string;
  name: string;
  description: string;
  type: 'WIN_GAMES' | 'PLAY_GAMES' | 'EARN_COINS' | 'CAPTURE_TOKENS' | 'FINISH_TOKENS';
  target: number;
  progress: number;
  coinReward: number;
  experienceReward: number;
  expiresAt: string;
  completed: boolean;
  claimedAt?: string;
}

// Game result for ranking calculation
export interface GameResult {
  gameId: string;
  roomId: string;
  players: GamePlayerResult[];
  gameMode: 'classic' | 'quick' | 'tournament';
  duration: number; // in minutes
  startTime: string;
  endTime: string;
  tournamentId?: string;
}

// Individual player result in a game
export interface GamePlayerResult {
  userId: string;
  username: string;
  position: number; // 1st, 2nd, 3rd, 4th
  coinsEarned: number;
  experienceEarned: number;
  tokensFinished: number;
  tokensCaptured: number;
  tokensLost: number;
  playTime: number; // in minutes
  achievements: string[]; // Achievement IDs unlocked in this game
}

// Coin transaction interface
export interface CoinTransaction {
  id: string;
  userId: string;
  type: 'EARNED' | 'SPENT' | 'PURCHASED' | 'BONUS' | 'REFUND';
  amount: number;
  source: string; // 'GAME_WIN', 'DAILY_BONUS', 'SHOP_PURCHASE', etc.
  description: string;
  timestamp: string;
  gameId?: string;
  itemId?: string;
}

// Shop item interface
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: 'COSMETIC' | 'COINS' | 'PREMIUM';
  price: number;
  originalPrice?: number;
  currency: 'COINS' | 'REAL_MONEY';
  discount?: number;
  isLimited: boolean;
  availableUntil?: string;
  previewImage: string;
  category: string;
  tags: string[];
  requirements?: string[];
}

// Spectator interface
export interface Spectator {
  id: string;
  username: string;
  avatar?: string;
  joinedAt: string;
}

// Game replay interface
export interface GameReplay {
  id: string;
  gameId: string;
  roomId: string;
  players: string[];
  moves: ReplayMove[];
  duration: number;
  createdAt: string;
  isPublic: boolean;
  views: number;
  likes: number;
}

// Replay move interface
export interface ReplayMove {
  timestamp: number;
  playerId: string;
  action: 'ROLL_DICE' | 'MOVE_TOKEN' | 'CHAT_MESSAGE';
  data: any;
}

// Battle pass interface
export interface BattlePass {
  id: string;
  season: number;
  name: string;
  description: string;
  theme?: string;
  colors?: string[];
  startDate: string;
  endDate: string;
  maxLevel: number;
  freeRewards: BattlePassReward[];
  premiumRewards: BattlePassReward[];
  price: number;
}

// Battle pass reward
export interface BattlePassReward {
  level: number;
  type: 'COINS' | 'COSMETIC' | 'ACHIEVEMENT';
  itemId: string;
  quantity: number;
  name?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

// User battle pass progress
export interface UserBattlePassProgress {
  userId: string;
  battlePassId: string;
  level: number;
  experience: number;
  isPremium: boolean;
  claimedFreeRewards: number[];
  claimedPremiumRewards: number[];
  purchasedAt?: string;
}
