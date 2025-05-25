import { RankTier, AchievementType, CosmeticType } from '../types'

// Coin reward structure based on game completion position
export const COIN_REWARDS = {
  FOUR_PLAYER: [500, 250, 100, 0],    // 1st, 2nd, 3rd, 4th place
  THREE_PLAYER: [400, 200, 50],       // 1st, 2nd, 3rd place
  TWO_PLAYER: [300, 0]                // 1st, 2nd place
}

// Experience points for different actions
export const EXPERIENCE_REWARDS = {
  GAME_COMPLETION: 50,
  FIRST_PLACE: 100,
  SECOND_PLACE: 75,
  THIRD_PLACE: 50,
  FOURTH_PLACE: 25,
  TOKEN_CAPTURE: 10,
  TOKEN_FINISH: 15,
  PERFECT_GAME: 200,
  COMEBACK_WIN: 150,
  DAILY_LOGIN: 25,
  FRIEND_GAME: 20
}

// Rank tier thresholds (based on total coins earned)
export const RANK_TIERS = {
  [RankTier.BRONZE]: { min: 0, max: 1999, color: '#CD7F32', icon: '🥉' },
  [RankTier.SILVER]: { min: 2000, max: 4999, color: '#C0C0C0', icon: '🥈' },
  [RankTier.GOLD]: { min: 5000, max: 9999, color: '#FFD700', icon: '🥇' },
  [RankTier.PLATINUM]: { min: 10000, max: 24999, color: '#E5E4E2', icon: '💎' },
  [RankTier.DIAMOND]: { min: 25000, max: 49999, color: '#B9F2FF', icon: '💠' },
  [RankTier.MASTER]: { min: 50000, max: 99999, color: '#9966CC', icon: '👑' },
  [RankTier.GRANDMASTER]: { min: 100000, max: Infinity, color: '#FF6B6B', icon: '🏆' }
}

// Daily login bonus progression
export const DAILY_LOGIN_BONUS = [
  { day: 1, coins: 50, experience: 25 },
  { day: 2, coins: 75, experience: 30 },
  { day: 3, coins: 100, experience: 35 },
  { day: 4, coins: 125, experience: 40 },
  { day: 5, coins: 150, experience: 45 },
  { day: 6, coins: 200, experience: 50 },
  { day: 7, coins: 300, experience: 75, bonus: 'COSMETIC_CHEST' }
]

// Achievement definitions
export const ACHIEVEMENTS = {
  [AchievementType.FIRST_WIN]: {
    id: 'first_win',
    name: 'First Victory',
    description: 'Win your first game',
    icon: '🏆',
    coinReward: 100,
    experienceReward: 50
  },
  [AchievementType.WIN_STREAK]: {
    id: 'win_streak_5',
    name: 'Winning Streak',
    description: 'Win 5 games in a row',
    icon: '🔥',
    coinReward: 500,
    experienceReward: 200,
    variants: [
      { streak: 3, coins: 200, experience: 75 },
      { streak: 5, coins: 500, experience: 200 },
      { streak: 10, coins: 1000, experience: 500 },
      { streak: 20, coins: 2500, experience: 1000 }
    ]
  },
  [AchievementType.GAMES_PLAYED]: {
    id: 'games_played',
    name: 'Dedicated Player',
    description: 'Play 100 games',
    icon: '🎮',
    coinReward: 300,
    experienceReward: 150,
    variants: [
      { games: 10, coins: 100, experience: 50 },
      { games: 50, coins: 200, experience: 100 },
      { games: 100, coins: 300, experience: 150 },
      { games: 500, coins: 1000, experience: 500 },
      { games: 1000, coins: 2000, experience: 1000 }
    ]
  },
  [AchievementType.COINS_EARNED]: {
    id: 'coins_earned',
    name: 'Coin Collector',
    description: 'Earn 10,000 coins',
    icon: '💰',
    coinReward: 1000,
    experienceReward: 300,
    variants: [
      { coins: 1000, reward: 100, experience: 50 },
      { coins: 5000, reward: 500, experience: 150 },
      { coins: 10000, reward: 1000, experience: 300 },
      { coins: 50000, reward: 5000, experience: 1000 },
      { coins: 100000, reward: 10000, experience: 2000 }
    ]
  },
  [AchievementType.PERFECT_GAME]: {
    id: 'perfect_game',
    name: 'Flawless Victory',
    description: 'Win a game without losing any tokens',
    icon: '✨',
    coinReward: 750,
    experienceReward: 300
  },
  [AchievementType.COMEBACK_KING]: {
    id: 'comeback_king',
    name: 'Comeback King',
    description: 'Win a game after being in last place',
    icon: '👑',
    coinReward: 600,
    experienceReward: 250
  },
  [AchievementType.SPEED_DEMON]: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Win a game in under 10 minutes',
    icon: '⚡',
    coinReward: 400,
    experienceReward: 200
  },
  [AchievementType.SOCIAL_BUTTERFLY]: {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Play 50 games with friends',
    icon: '🦋',
    coinReward: 800,
    experienceReward: 350
  }
}

// Daily challenge templates
export const DAILY_CHALLENGE_TEMPLATES = [
  {
    type: 'WIN_GAMES',
    name: 'Victory Quest',
    description: 'Win {target} games',
    targets: [1, 2, 3],
    coinReward: 150,
    experienceReward: 75
  },
  {
    type: 'PLAY_GAMES',
    name: 'Game Marathon',
    description: 'Play {target} games',
    targets: [3, 5, 7],
    coinReward: 100,
    experienceReward: 50
  },
  {
    type: 'EARN_COINS',
    name: 'Coin Hunter',
    description: 'Earn {target} coins from games',
    targets: [500, 1000, 1500],
    coinReward: 200,
    experienceReward: 100
  },
  {
    type: 'CAPTURE_TOKENS',
    name: 'Token Captor',
    description: 'Capture {target} opponent tokens',
    targets: [5, 10, 15],
    coinReward: 175,
    experienceReward: 85
  },
  {
    type: 'FINISH_TOKENS',
    name: 'Home Run',
    description: 'Get {target} tokens to the finish',
    targets: [8, 12, 16],
    coinReward: 125,
    experienceReward: 60
  }
]

// Cosmetic items available in shop
export const COSMETIC_ITEMS = {
  TOKEN_SKINS: [
    {
      id: 'golden_tokens',
      name: 'Golden Tokens',
      description: 'Luxurious golden token design',
      type: CosmeticType.TOKEN_SKIN,
      rarity: 'EPIC',
      price: 2500,
      isPremium: false,
      previewImage: '/cosmetics/tokens/golden.png'
    },
    {
      id: 'crystal_tokens',
      name: 'Crystal Tokens',
      description: 'Sparkling crystal tokens',
      type: CosmeticType.TOKEN_SKIN,
      rarity: 'LEGENDARY',
      price: 5000,
      isPremium: false,
      previewImage: '/cosmetics/tokens/crystal.png'
    },
    {
      id: 'neon_tokens',
      name: 'Neon Glow',
      description: 'Futuristic neon glowing tokens',
      type: CosmeticType.TOKEN_SKIN,
      rarity: 'RARE',
      price: 1500,
      isPremium: false,
      previewImage: '/cosmetics/tokens/neon.png'
    }
  ],
  BOARD_THEMES: [
    {
      id: 'royal_palace',
      name: 'Royal Palace',
      description: 'Elegant palace-themed board',
      type: CosmeticType.BOARD_THEME,
      rarity: 'EPIC',
      price: 3000,
      isPremium: false,
      previewImage: '/cosmetics/boards/royal.png'
    },
    {
      id: 'space_station',
      name: 'Space Station',
      description: 'Futuristic space-themed board',
      type: CosmeticType.BOARD_THEME,
      rarity: 'LEGENDARY',
      price: 6000,
      isPremium: false,
      previewImage: '/cosmetics/boards/space.png'
    },
    {
      id: 'forest_grove',
      name: 'Forest Grove',
      description: 'Natural forest-themed board',
      type: CosmeticType.BOARD_THEME,
      rarity: 'RARE',
      price: 2000,
      isPremium: false,
      previewImage: '/cosmetics/boards/forest.png'
    }
  ],
  DICE_DESIGNS: [
    {
      id: 'diamond_dice',
      name: 'Diamond Dice',
      description: 'Sparkling diamond dice',
      type: CosmeticType.DICE_DESIGN,
      rarity: 'LEGENDARY',
      price: 4000,
      isPremium: false,
      previewImage: '/cosmetics/dice/diamond.png'
    },
    {
      id: 'wooden_dice',
      name: 'Wooden Dice',
      description: 'Classic wooden dice design',
      type: CosmeticType.DICE_DESIGN,
      rarity: 'COMMON',
      price: 500,
      isPremium: false,
      previewImage: '/cosmetics/dice/wooden.png'
    },
    {
      id: 'fire_dice',
      name: 'Fire Dice',
      description: 'Blazing fire-themed dice',
      type: CosmeticType.DICE_DESIGN,
      rarity: 'EPIC',
      price: 2800,
      isPremium: false,
      previewImage: '/cosmetics/dice/fire.png'
    }
  ],
  AVATARS: [
    // Male Avatars
    {
      id: 'male_knight',
      name: 'Knight Commander',
      description: 'Brave male knight with royal armor',
      type: CosmeticType.AVATAR,
      rarity: 'RARE',
      price: 1200,
      isPremium: false,
      previewImage: '/cosmetics/avatars/male_knight.png',
      gender: 'male',
      emoji: '🛡️👨'
    },
    {
      id: 'male_wizard',
      name: 'Archmage',
      description: 'Powerful male wizard with ancient magic',
      type: CosmeticType.AVATAR,
      rarity: 'EPIC',
      price: 2200,
      isPremium: false,
      previewImage: '/cosmetics/avatars/male_wizard.png',
      gender: 'male',
      emoji: '🧙‍♂️'
    },
    {
      id: 'male_warrior',
      name: 'Dragon Slayer',
      description: 'Legendary male warrior with battle scars',
      type: CosmeticType.AVATAR,
      rarity: 'LEGENDARY',
      price: 4500,
      isPremium: false,
      previewImage: '/cosmetics/avatars/male_warrior.png',
      gender: 'male',
      emoji: '⚔️👨'
    },
    // Female Avatars
    {
      id: 'female_knight',
      name: 'Paladin Princess',
      description: 'Noble female knight with divine blessing',
      type: CosmeticType.AVATAR,
      rarity: 'RARE',
      price: 1200,
      isPremium: false,
      previewImage: '/cosmetics/avatars/female_knight.png',
      gender: 'female',
      emoji: '🛡️👩'
    },
    {
      id: 'female_mage',
      name: 'Sorceress Supreme',
      description: 'Mystical female mage with elemental powers',
      type: CosmeticType.AVATAR,
      rarity: 'EPIC',
      price: 2200,
      isPremium: false,
      previewImage: '/cosmetics/avatars/female_mage.png',
      gender: 'female',
      emoji: '🧙‍♀️'
    },
    {
      id: 'female_assassin',
      name: 'Shadow Empress',
      description: 'Legendary female assassin with deadly precision',
      type: CosmeticType.AVATAR,
      rarity: 'LEGENDARY',
      price: 4500,
      isPremium: false,
      previewImage: '/cosmetics/avatars/female_assassin.png',
      gender: 'female',
      emoji: '🗡️👩'
    }
  ]
}

// Tournament entry fees and prize pools
export const TOURNAMENT_CONFIG = {
  BRONZE_TOURNAMENT: {
    entryFee: 100,
    prizePool: 2000,
    maxParticipants: 16,
    tierRequirement: RankTier.BRONZE
  },
  SILVER_TOURNAMENT: {
    entryFee: 250,
    prizePool: 5000,
    maxParticipants: 16,
    tierRequirement: RankTier.SILVER
  },
  GOLD_TOURNAMENT: {
    entryFee: 500,
    prizePool: 10000,
    maxParticipants: 16,
    tierRequirement: RankTier.GOLD
  },
  PLATINUM_TOURNAMENT: {
    entryFee: 1000,
    prizePool: 20000,
    maxParticipants: 16,
    tierRequirement: RankTier.PLATINUM
  },
  DIAMOND_TOURNAMENT: {
    entryFee: 2000,
    prizePool: 40000,
    maxParticipants: 16,
    tierRequirement: RankTier.DIAMOND
  },
  MASTER_TOURNAMENT: {
    entryFee: 5000,
    prizePool: 100000,
    maxParticipants: 8,
    tierRequirement: RankTier.MASTER
  }
}

// Prize distribution for tournaments (percentage of prize pool)
export const TOURNAMENT_PRIZE_DISTRIBUTION = {
  16: [0.4, 0.25, 0.15, 0.1, 0.05, 0.03, 0.01, 0.01], // Top 8 get prizes
  8: [0.45, 0.25, 0.15, 0.1, 0.05], // Top 5 get prizes
  4: [0.5, 0.3, 0.2] // Top 3 get prizes
}

// Anti-cheat detection thresholds
export const ANTI_CHEAT_CONFIG = {
  MAX_GAMES_PER_HOUR: 20,
  MAX_WINS_PER_HOUR: 15,
  MIN_GAME_DURATION: 120, // 2 minutes in seconds
  MAX_GAME_DURATION: 3600, // 1 hour in seconds
  SUSPICIOUS_WIN_RATE_THRESHOLD: 0.95, // 95% win rate
  RAPID_COIN_GAIN_THRESHOLD: 10000 // coins per hour
}

// Battle pass configuration
export const BATTLE_PASS_CONFIG = {
  SEASON_DURATION_DAYS: 90,
  MAX_LEVEL: 100,
  EXPERIENCE_PER_LEVEL: 1000,
  PREMIUM_PRICE: 999, // in coins
  FREE_REWARD_FREQUENCY: 5, // every 5 levels
  PREMIUM_REWARD_FREQUENCY: 1 // every level
}
