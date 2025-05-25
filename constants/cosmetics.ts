import { CosmeticType } from '../types'

// Type definitions for cosmetic configurations
export interface TokenSkinConfig {
  id: string;
  name: string;
  baseStyle: string;
  glowEffect: string;
  animation: string;
  gradient?: string;
}

export interface BoardThemeConfig {
  id: string;
  name: string;
  backgroundColor: string;
  borderColor: string;
  pathColor: string;
  safeZoneColor: string;
  homeColor: string;
  centerColor: string;
}

export interface DiceDesignConfig {
  id: string;
  name: string;
  backgroundColor: string;
  borderColor: string;
  dotColor: string;
  shadow: string;
  animation: string;
}

export interface AvatarConfig {
  id: string;
  name: string;
  emoji: string;
  backgroundColor: string;
  borderColor: string;
  gender?: 'male' | 'female' | 'neutral';
  isFree?: boolean;
}

export type CosmeticConfig = TokenSkinConfig | BoardThemeConfig | DiceDesignConfig | AvatarConfig;

// Cosmetic configurations that affect gameplay visuals
export const COSMETIC_CONFIGS = {
  // Token skin configurations
  TOKEN_SKINS: {
    default: {
      id: 'default',
      name: 'Classic Tokens',
      baseStyle: 'rounded-full shadow-lg border-2',
      glowEffect: 'shadow-md',
      animation: 'hover:scale-105 transition-transform duration-200'
    },
    golden_tokens: {
      id: 'golden_tokens',
      name: 'Golden Tokens',
      baseStyle: 'rounded-full shadow-xl border-3 border-yellow-400',
      glowEffect: 'shadow-yellow-400/50 shadow-lg',
      animation: 'hover:scale-110 transition-all duration-300 hover:shadow-yellow-400/70',
      gradient: 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600'
    },
    crystal_tokens: {
      id: 'crystal_tokens',
      name: 'Crystal Tokens',
      baseStyle: 'rounded-full shadow-2xl border-2 border-cyan-300',
      glowEffect: 'shadow-cyan-400/60 shadow-xl',
      animation: 'hover:scale-110 transition-all duration-300 hover:shadow-cyan-400/80 animate-pulse',
      gradient: 'bg-gradient-to-br from-cyan-200 via-blue-300 to-purple-400'
    },
    neon_tokens: {
      id: 'neon_tokens',
      name: 'Neon Glow',
      baseStyle: 'rounded-full shadow-xl border-2 border-pink-400',
      glowEffect: 'shadow-pink-500/70 shadow-lg',
      animation: 'hover:scale-110 transition-all duration-300 hover:shadow-pink-500/90',
      gradient: 'bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600'
    }
  },

  // Board theme configurations
  BOARD_THEMES: {
    classic: {
      id: 'classic',
      name: 'Classic Board',
      backgroundColor: 'bg-amber-50',
      borderColor: 'border-amber-800',
      pathColor: 'bg-white',
      safeZoneColor: 'bg-green-100',
      homeColor: 'bg-gray-100',
      centerColor: 'bg-gradient-to-br from-yellow-200 to-amber-300'
    },
    royal_palace: {
      id: 'royal_palace',
      name: 'Royal Palace',
      backgroundColor: 'bg-purple-50',
      borderColor: 'border-purple-800',
      pathColor: 'bg-gradient-to-r from-purple-100 to-pink-100',
      safeZoneColor: 'bg-yellow-100',
      homeColor: 'bg-purple-200',
      centerColor: 'bg-gradient-to-br from-purple-300 to-pink-400'
    },
    space_station: {
      id: 'space_station',
      name: 'Space Station',
      backgroundColor: 'bg-slate-900',
      borderColor: 'border-cyan-400',
      pathColor: 'bg-gradient-to-r from-slate-700 to-slate-600',
      safeZoneColor: 'bg-cyan-900',
      homeColor: 'bg-slate-800',
      centerColor: 'bg-gradient-to-br from-cyan-600 to-blue-700'
    },
    forest_grove: {
      id: 'forest_grove',
      name: 'Forest Grove',
      backgroundColor: 'bg-green-50',
      borderColor: 'border-green-800',
      pathColor: 'bg-gradient-to-r from-green-100 to-emerald-100',
      safeZoneColor: 'bg-yellow-200',
      homeColor: 'bg-green-200',
      centerColor: 'bg-gradient-to-br from-green-400 to-emerald-500'
    }
  },

  // Dice design configurations
  DICE_DESIGNS: {
    standard: {
      id: 'standard',
      name: 'Standard Dice',
      backgroundColor: 'bg-white',
      borderColor: 'border-gray-800',
      dotColor: 'text-black',
      shadow: 'shadow-lg',
      animation: 'hover:shadow-xl transition-shadow duration-200'
    },
    wooden_dice: {
      id: 'wooden_dice',
      name: 'Wooden Dice',
      backgroundColor: 'bg-gradient-to-br from-amber-600 to-amber-800',
      borderColor: 'border-amber-900',
      dotColor: 'text-amber-100',
      shadow: 'shadow-lg shadow-amber-800/50',
      animation: 'hover:shadow-xl hover:shadow-amber-800/70 transition-all duration-300'
    },
    diamond_dice: {
      id: 'diamond_dice',
      name: 'Diamond Dice',
      backgroundColor: 'bg-gradient-to-br from-cyan-100 to-blue-200',
      borderColor: 'border-cyan-400',
      dotColor: 'text-cyan-800',
      shadow: 'shadow-xl shadow-cyan-400/50',
      animation: 'hover:shadow-2xl hover:shadow-cyan-400/70 transition-all duration-300 animate-pulse'
    },
    fire_dice: {
      id: 'fire_dice',
      name: 'Fire Dice',
      backgroundColor: 'bg-gradient-to-br from-red-500 to-orange-600',
      borderColor: 'border-red-700',
      dotColor: 'text-yellow-100',
      shadow: 'shadow-lg shadow-red-500/50',
      animation: 'hover:shadow-xl hover:shadow-red-500/70 transition-all duration-300'
    }
  },

  // Avatar configurations
  AVATARS: {
    default: {
      id: 'default',
      name: 'Default Avatar',
      emoji: '👤',
      backgroundColor: 'bg-gradient-to-br from-gray-400 to-gray-600',
      borderColor: 'border-gray-700',
      gender: 'neutral' as const,
      isFree: true
    },
    male_knight: {
      id: 'male_knight',
      name: 'Knight Commander',
      emoji: '🛡️👨',
      backgroundColor: 'bg-gradient-to-br from-blue-500 to-blue-700',
      borderColor: 'border-blue-800',
      gender: 'male' as const,
      isFree: true
    },
    male_wizard: {
      id: 'male_wizard',
      name: 'Archmage',
      emoji: '🧙‍♂️',
      backgroundColor: 'bg-gradient-to-br from-purple-500 to-purple-700',
      borderColor: 'border-purple-800',
      gender: 'male' as const,
      isFree: false
    },
    male_warrior: {
      id: 'male_warrior',
      name: 'Dragon Slayer',
      emoji: '⚔️👨',
      backgroundColor: 'bg-gradient-to-br from-red-500 to-red-700',
      borderColor: 'border-red-800',
      gender: 'male' as const,
      isFree: false
    },
    female_knight: {
      id: 'female_knight',
      name: 'Paladin Princess',
      emoji: '🛡️👩',
      backgroundColor: 'bg-gradient-to-br from-pink-500 to-pink-700',
      borderColor: 'border-pink-800',
      gender: 'female' as const,
      isFree: true
    },
    female_mage: {
      id: 'female_mage',
      name: 'Sorceress Supreme',
      emoji: '🧙‍♀️',
      backgroundColor: 'bg-gradient-to-br from-indigo-500 to-indigo-700',
      borderColor: 'border-indigo-800',
      gender: 'female' as const,
      isFree: false
    },
    female_assassin: {
      id: 'female_assassin',
      name: 'Shadow Empress',
      emoji: '🗡️👩',
      backgroundColor: 'bg-gradient-to-br from-slate-600 to-slate-800',
      borderColor: 'border-slate-900',
      gender: 'female' as const,
      isFree: false
    }
  }
}

// Helper function to get cosmetic config
export const getCosmeticConfig = (type: CosmeticType, id: string): CosmeticConfig | null => {
  switch (type) {
    case CosmeticType.TOKEN_SKIN:
      return COSMETIC_CONFIGS.TOKEN_SKINS[id as keyof typeof COSMETIC_CONFIGS.TOKEN_SKINS] || COSMETIC_CONFIGS.TOKEN_SKINS.default
    case CosmeticType.BOARD_THEME:
      return COSMETIC_CONFIGS.BOARD_THEMES[id as keyof typeof COSMETIC_CONFIGS.BOARD_THEMES] || COSMETIC_CONFIGS.BOARD_THEMES.classic
    case CosmeticType.DICE_DESIGN:
      return COSMETIC_CONFIGS.DICE_DESIGNS[id as keyof typeof COSMETIC_CONFIGS.DICE_DESIGNS] || COSMETIC_CONFIGS.DICE_DESIGNS.standard
    case CosmeticType.AVATAR:
      return COSMETIC_CONFIGS.AVATARS[id as keyof typeof COSMETIC_CONFIGS.AVATARS] || COSMETIC_CONFIGS.AVATARS.default
    default:
      return null
  }
}

// Type-specific helper functions
export const getTokenSkinConfig = (id: string): TokenSkinConfig => {
  return COSMETIC_CONFIGS.TOKEN_SKINS[id as keyof typeof COSMETIC_CONFIGS.TOKEN_SKINS] || COSMETIC_CONFIGS.TOKEN_SKINS.default
}

export const getBoardThemeConfig = (id: string): BoardThemeConfig => {
  return COSMETIC_CONFIGS.BOARD_THEMES[id as keyof typeof COSMETIC_CONFIGS.BOARD_THEMES] || COSMETIC_CONFIGS.BOARD_THEMES.classic
}

export const getDiceDesignConfig = (id: string): DiceDesignConfig => {
  return COSMETIC_CONFIGS.DICE_DESIGNS[id as keyof typeof COSMETIC_CONFIGS.DICE_DESIGNS] || COSMETIC_CONFIGS.DICE_DESIGNS.standard
}

export const getAvatarConfig = (id: string): AvatarConfig => {
  return COSMETIC_CONFIGS.AVATARS[id as keyof typeof COSMETIC_CONFIGS.AVATARS] || COSMETIC_CONFIGS.AVATARS.default
}

// Helper function to get all cosmetics of a type
export const getCosmeticsOfType = (type: CosmeticType) => {
  switch (type) {
    case CosmeticType.TOKEN_SKIN:
      return Object.values(COSMETIC_CONFIGS.TOKEN_SKINS)
    case CosmeticType.BOARD_THEME:
      return Object.values(COSMETIC_CONFIGS.BOARD_THEMES)
    case CosmeticType.DICE_DESIGN:
      return Object.values(COSMETIC_CONFIGS.DICE_DESIGNS)
    case CosmeticType.AVATAR:
      return Object.values(COSMETIC_CONFIGS.AVATARS)
    default:
      return []
  }
}

// Avatar-specific helper functions
export const getFreeAvatars = () => {
  return Object.values(COSMETIC_CONFIGS.AVATARS).filter(avatar => avatar.isFree)
}

export const getAvatarsByGender = (gender: 'male' | 'female' | 'neutral') => {
  return Object.values(COSMETIC_CONFIGS.AVATARS).filter(avatar => avatar.gender === gender)
}

export const getFreeAvatarsByGender = (gender: 'male' | 'female' | 'neutral') => {
  return Object.values(COSMETIC_CONFIGS.AVATARS).filter(avatar =>
    avatar.gender === gender && avatar.isFree
  )
}

export const getDefaultAvatarForGender = (gender: 'male' | 'female' | 'neutral') => {
  const freeAvatars = getFreeAvatarsByGender(gender)
  return freeAvatars.length > 0 ? freeAvatars[0] : COSMETIC_CONFIGS.AVATARS.default
}
