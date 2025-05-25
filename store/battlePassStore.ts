import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { BattlePass, BattlePassReward, UserBattlePassProgress } from '../types'
import { BATTLE_PASS_CONFIG } from '../constants/rewards'

// Seasonal themes with unique cosmetics and rewards
const SEASONAL_THEMES = {
  1: {
    name: 'Cosmic Conquest',
    description: 'Embark on an epic journey through the cosmos! Unlock exclusive space-themed rewards.',
    theme: 'space',
    cosmetics: ['nebula_board', 'asteroid_dice', 'cosmic_tokens', 'starship_avatar'],
    colors: ['#4F46E5', '#7C3AED', '#EC4899']
  },
  2: {
    name: 'Ocean Odyssey',
    description: 'Dive deep into the mysteries of the ocean! Discover aquatic treasures and marine cosmetics.',
    theme: 'ocean',
    cosmetics: ['coral_board', 'pearl_dice', 'seahorse_tokens', 'mermaid_avatar'],
    colors: ['#0EA5E9', '#06B6D4', '#10B981']
  },
  3: {
    name: 'Medieval Legends',
    description: 'Enter the realm of knights and dragons! Collect legendary medieval artifacts.',
    theme: 'medieval',
    cosmetics: ['castle_board', 'dragon_dice', 'knight_tokens', 'wizard_avatar'],
    colors: ['#DC2626', '#D97706', '#65A30D']
  },
  4: {
    name: 'Cyber Future',
    description: 'Step into the digital age! Unlock futuristic tech-themed rewards.',
    theme: 'cyber',
    cosmetics: ['neon_board', 'hologram_dice', 'robot_tokens', 'cyborg_avatar'],
    colors: ['#8B5CF6', '#06B6D4', '#F59E0B']
  }
}

// Generate seasonal battle pass with enhanced rewards
const generateSeasonalBattlePass = (season: number): BattlePass => {
  const now = new Date()
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const endDate = new Date(now.getFullYear(), now.getMonth() + 3, 0).toISOString()

  const seasonTheme = SEASONAL_THEMES[season as keyof typeof SEASONAL_THEMES] || SEASONAL_THEMES[1]
  const freeRewards: BattlePassReward[] = []
  const premiumRewards: BattlePassReward[] = []

  // Generate rewards for each level with seasonal themes
  for (let level = 1; level <= BATTLE_PASS_CONFIG.MAX_LEVEL; level++) {
    // Free rewards every 5 levels
    if (level % BATTLE_PASS_CONFIG.FREE_REWARD_FREQUENCY === 0) {
      let rewardType: 'COINS' | 'COSMETIC' | 'ACHIEVEMENT' = 'COINS'
      let itemId = 'coins'
      let quantity = 100 + (level * 10)

      if (level === 20) {
        rewardType = 'COSMETIC'
        itemId = `${seasonTheme.theme}_board_free`
        quantity = 1
      } else if (level === 40) {
        rewardType = 'COSMETIC'
        itemId = `${seasonTheme.theme}_dice_free`
        quantity = 1
      } else if (level === 60) {
        rewardType = 'COSMETIC'
        itemId = `${seasonTheme.theme}_tokens_free`
        quantity = 1
      } else if (level === 80) {
        rewardType = 'ACHIEVEMENT'
        itemId = `${seasonTheme.theme}_master`
        quantity = 1
      }

      freeRewards.push({
        level,
        type: rewardType,
        itemId,
        quantity,
        name: rewardType === 'COSMETIC' ? `${seasonTheme.name} ${itemId.split('_')[1]}` : undefined,
        rarity: level >= 60 ? 'legendary' : level >= 40 ? 'epic' : level >= 20 ? 'rare' : 'common'
      })
    }

    // Premium rewards every level with enhanced variety
    if (level % BATTLE_PASS_CONFIG.PREMIUM_REWARD_FREQUENCY === 0) {
      let rewardType: 'COINS' | 'COSMETIC' | 'ACHIEVEMENT'
      let itemId: string
      let quantity: number
      let rarity: 'common' | 'rare' | 'epic' | 'legendary' = 'common'

      if (level % 25 === 0) {
        rewardType = 'COSMETIC'
        const cosmeticIndex = Math.floor(level / 25) - 1
        itemId = seasonTheme.cosmetics[cosmeticIndex] || `${seasonTheme.theme}_premium_${level}`
        quantity = 1
        rarity = level >= 75 ? 'legendary' : level >= 50 ? 'epic' : 'rare'
      } else if (level % 15 === 0) {
        rewardType = 'ACHIEVEMENT'
        itemId = `${seasonTheme.theme}_milestone_${level}`
        quantity = 1
        rarity = 'epic'
      } else if (level % 10 === 0) {
        rewardType = 'COSMETIC'
        itemId = `${seasonTheme.theme}_variant_${level}`
        quantity = 1
        rarity = 'rare'
      } else {
        rewardType = 'COINS'
        itemId = 'coins'
        quantity = 150 + (level * 15)
      }

      premiumRewards.push({
        level,
        type: rewardType,
        itemId,
        quantity,
        name: rewardType === 'COSMETIC' ? `${seasonTheme.name} ${itemId.split('_')[1]}` : undefined,
        rarity
      })
    }
  }

  return {
    id: `season_${season}`,
    season,
    name: `Season ${season}: ${seasonTheme.name}`,
    description: seasonTheme.description,
    theme: seasonTheme.theme,
    colors: seasonTheme.colors,
    startDate,
    endDate,
    maxLevel: BATTLE_PASS_CONFIG.MAX_LEVEL,
    freeRewards,
    premiumRewards,
    price: BATTLE_PASS_CONFIG.PREMIUM_PRICE
  }
}

interface BattlePassState {
  // Current battle pass
  currentBattlePass: BattlePass | null
  userProgress: UserBattlePassProgress | null

  // Social features
  sharedAchievements: string[]
  progressHistory: { date: string; level: number; experience: number }[]

  // Actions
  initializeBattlePass: () => void
  purchasePremium: () => boolean
  addExperience: (amount: number, source?: string) => void
  claimReward: (level: number, isPremium: boolean) => boolean
  shareAchievement: (achievementId: string) => void
  getCurrentLevel: () => number
  getExperienceForNextLevel: () => number
  getUnclaimedRewards: () => { level: number; isPremium: boolean; reward: BattlePassReward }[]
  getProgressStats: () => {
    totalExperience: number
    averageExpPerDay: number
    daysRemaining: number
    projectedFinalLevel: number
  }
  getSeasonalCosmetics: () => string[]
}

export const useBattlePassStore = create<BattlePassState>()(
  persist(
    (set, get) => ({
      currentBattlePass: null,
      userProgress: null,
      sharedAchievements: [],
      progressHistory: [],

      initializeBattlePass: () => {
        const currentSeason = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 90)) + 1 // New season every 90 days
        const existingProgress = get().userProgress

        // Check if we need a new battle pass
        if (!get().currentBattlePass || get().currentBattlePass?.season !== currentSeason) {
          const newBattlePass = generateSeasonalBattlePass(currentSeason)

          set({
            currentBattlePass: newBattlePass,
            userProgress: {
              userId: 'current_user', // This would be the actual user ID
              battlePassId: newBattlePass.id,
              level: 1,
              experience: 0,
              isPremium: false,
              claimedFreeRewards: [],
              claimedPremiumRewards: []
            }
          })
        } else if (!existingProgress) {
          // Initialize progress for existing battle pass
          set({
            userProgress: {
              userId: 'current_user',
              battlePassId: get().currentBattlePass!.id,
              level: 1,
              experience: 0,
              isPremium: false,
              claimedFreeRewards: [],
              claimedPremiumRewards: []
            }
          })
        }
      },

      purchasePremium: () => {
        const { userProgress } = get()
        if (!userProgress || userProgress.isPremium) return false

        // In a real app, this would process payment
        // For now, we'll just check if user has enough coins (handled by parent component)

        set((state) => ({
          userProgress: state.userProgress ? {
            ...state.userProgress,
            isPremium: true,
            purchasedAt: new Date().toISOString()
          } : null
        }))

        return true
      },

      addExperience: (amount: number, _source?: string) => {
        const { userProgress, currentBattlePass, progressHistory } = get()
        if (!userProgress || !currentBattlePass) return

        const oldLevel = userProgress.level
        const newExperience = userProgress.experience + amount
        const newLevel = Math.min(
          Math.floor(newExperience / BATTLE_PASS_CONFIG.EXPERIENCE_PER_LEVEL) + 1,
          currentBattlePass.maxLevel
        )

        // Track progress history
        const today = new Date().toISOString().split('T')[0]
        const existingEntry = progressHistory.find(entry => entry.date === today)

        const updatedHistory = existingEntry
          ? progressHistory.map(entry =>
              entry.date === today
                ? { ...entry, level: newLevel, experience: newExperience }
                : entry
            )
          : [...progressHistory, { date: today, level: newLevel, experience: newExperience }]

        set((state) => ({
          userProgress: state.userProgress ? {
            ...state.userProgress,
            experience: newExperience,
            level: newLevel
          } : null,
          progressHistory: updatedHistory
        }))

        // Auto-share level up achievements
        if (newLevel > oldLevel && newLevel % 10 === 0) {
          get().shareAchievement(`level_${newLevel}_reached`)
        }
      },

      shareAchievement: (achievementId: string) => {
        set((state) => ({
          sharedAchievements: [...state.sharedAchievements, achievementId]
        }))

        // In a real app, this would post to social media or game feed
        console.log(`Achievement shared: ${achievementId}`)
      },

      claimReward: (level: number, isPremium: boolean) => {
        const { userProgress, currentBattlePass } = get()
        if (!userProgress || !currentBattlePass) return false

        // Check if user can claim this reward
        if (level > userProgress.level) return false
        if (isPremium && !userProgress.isPremium) return false

        const rewardList = isPremium ? currentBattlePass.premiumRewards : currentBattlePass.freeRewards
        const reward = rewardList.find(r => r.level === level)
        if (!reward) return false

        const claimedList = isPremium ? userProgress.claimedPremiumRewards : userProgress.claimedFreeRewards
        if (claimedList.includes(level)) return false

        // Claim the reward
        set((state) => ({
          userProgress: state.userProgress ? {
            ...state.userProgress,
            [isPremium ? 'claimedPremiumRewards' : 'claimedFreeRewards']: [
              ...claimedList,
              level
            ]
          } : null
        }))

        return true
      },

      getCurrentLevel: () => {
        const { userProgress } = get()
        return userProgress?.level || 1
      },

      getExperienceForNextLevel: () => {
        const { userProgress } = get()
        if (!userProgress) return BATTLE_PASS_CONFIG.EXPERIENCE_PER_LEVEL

        const currentLevelExp = (userProgress.level - 1) * BATTLE_PASS_CONFIG.EXPERIENCE_PER_LEVEL
        const expInCurrentLevel = userProgress.experience - currentLevelExp
        return BATTLE_PASS_CONFIG.EXPERIENCE_PER_LEVEL - expInCurrentLevel
      },

      getUnclaimedRewards: () => {
        const { userProgress, currentBattlePass } = get()
        if (!userProgress || !currentBattlePass) return []

        const unclaimed: { level: number; isPremium: boolean; reward: BattlePassReward }[] = []

        // Check free rewards
        currentBattlePass.freeRewards.forEach(reward => {
          if (
            reward.level <= userProgress.level &&
            !userProgress.claimedFreeRewards.includes(reward.level)
          ) {
            unclaimed.push({ level: reward.level, isPremium: false, reward })
          }
        })

        // Check premium rewards if user has premium
        if (userProgress.isPremium) {
          currentBattlePass.premiumRewards.forEach(reward => {
            if (
              reward.level <= userProgress.level &&
              !userProgress.claimedPremiumRewards.includes(reward.level)
            ) {
              unclaimed.push({ level: reward.level, isPremium: true, reward })
            }
          })
        }

        return unclaimed.sort((a, b) => a.level - b.level)
      },

      getProgressStats: () => {
        const { userProgress, currentBattlePass } = get()
        if (!userProgress || !currentBattlePass) {
          return {
            totalExperience: 0,
            averageExpPerDay: 0,
            daysRemaining: 0,
            projectedFinalLevel: 1
          }
        }

        const startDate = new Date(currentBattlePass.startDate)
        const endDate = new Date(currentBattlePass.endDate)
        const now = new Date()

        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        const daysElapsed = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        const daysRemaining = Math.max(0, totalDays - daysElapsed)

        const averageExpPerDay = daysElapsed > 0 ? userProgress.experience / daysElapsed : 0
        const projectedTotalExp = userProgress.experience + (averageExpPerDay * daysRemaining)
        const projectedFinalLevel = Math.min(
          Math.floor(projectedTotalExp / BATTLE_PASS_CONFIG.EXPERIENCE_PER_LEVEL) + 1,
          currentBattlePass.maxLevel
        )

        return {
          totalExperience: userProgress.experience,
          averageExpPerDay,
          daysRemaining,
          projectedFinalLevel
        }
      },

      getSeasonalCosmetics: () => {
        const { currentBattlePass } = get()
        if (!currentBattlePass) return []

        const seasonTheme = SEASONAL_THEMES[currentBattlePass.season as keyof typeof SEASONAL_THEMES]
        return seasonTheme ? seasonTheme.cosmetics : []
      }
    }),
    {
      name: 'battle-pass-store',
      partialize: (state) => ({
        currentBattlePass: state.currentBattlePass,
        userProgress: state.userProgress,
        sharedAchievements: state.sharedAchievements,
        progressHistory: state.progressHistory
      })
    }
  )
)
