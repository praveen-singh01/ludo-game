import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  UserProfile,
  PlayerStatistics,
  RankTier,
  Achievement,
  CoinTransaction,
  DailyChallenge,
  LeaderboardEntry,
  FriendRequest,
  UserSettings,
  EquippedCosmetics
} from '../types'
import { DAILY_CHALLENGE_TEMPLATES } from '../constants/rewards'

// Default user settings
const defaultSettings: UserSettings = {
  soundEnabled: true,
  musicEnabled: true,
  masterVolume: 0.7,
  soundEffectsVolume: 0.8,
  musicVolume: 0.5,
  notificationsVolume: 0.6,
  notificationsEnabled: true,
  autoAcceptFriendRequests: false,
  showOnlineStatus: true,
  allowSpectators: true,
  preferredGameMode: 'classic',
  language: 'en',
  theme: 'auto'
}

// Default player statistics
const defaultStats: PlayerStatistics = {
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  winPercentage: 0,
  averagePosition: 0,
  totalPlayTime: 0,
  averageGameTime: 0,
  fastestWin: 0,
  longestGame: 0,
  currentWinStreak: 0,
  bestWinStreak: 0,
  currentLossStreak: 0,
  firstPlaceFinishes: 0,
  secondPlaceFinishes: 0,
  thirdPlaceFinishes: 0,
  fourthPlaceFinishes: 0,
  tokensFinished: 0,
  tokensCaptured: 0,
  tokensLost: 0,
  perfectGames: 0,
  comebackWins: 0,
  dailyGamesPlayed: 0,
  weeklyGamesPlayed: 0,
  lastGameDate: '',
  totalCoinsEarned: 0,
  totalCoinsSpent: 0,
  friendsCount: 0,
  gamesWithFriends: 0
}

// Default equipped cosmetics
const defaultEquippedCosmetics: EquippedCosmetics = {
  tokenSkin: 'default',
  boardTheme: 'classic',
  diceDesign: 'standard',
  avatar: 'default',
  victoryAnimation: 'confetti'
}

interface UserProfileState {
  // User profile
  profile: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean

  // Leaderboard
  globalLeaderboard: LeaderboardEntry[]
  friendsLeaderboard: LeaderboardEntry[]
  userRank: number

  // Achievements
  availableAchievements: Achievement[]
  unlockedAchievements: Achievement[]

  // Daily challenges
  dailyChallenges: DailyChallenge[]

  // Coin transactions
  coinTransactions: CoinTransaction[]

  // Friend system
  friendRequests: FriendRequest[]
  friends: UserProfile[]

  // Actions
  initializeProfile: (username: string, email?: string) => void
  updateProfile: (updates: Partial<UserProfile>) => void
  updateStats: (updates: Partial<PlayerStatistics>) => void
  updateSettings: (updates: Partial<UserSettings>) => void

  // Coin system
  addCoins: (amount: number, source: string, description: string, gameId?: string) => void
  spendCoins: (amount: number, source: string, description: string, itemId?: string) => boolean

  // Achievement system
  checkAchievements: () => void
  unlockAchievement: (achievementId: string) => void

  // Ranking system
  updateRank: () => void
  calculateTier: (coins: number) => RankTier

  // Daily challenges
  updateDailyChallengeProgress: (challengeId: string, progress: number) => void
  claimDailyChallenge: (challengeId: string) => void
  generateDailyChallenges: () => void

  // Friend system
  sendFriendRequest: (username: string) => void
  acceptFriendRequest: (requestId: string) => void
  declineFriendRequest: (requestId: string) => void
  removeFriend: (userId: string) => void

  // Leaderboard
  updateLeaderboard: () => void

  // Cosmetics
  equipCosmetic: (type: keyof EquippedCosmetics, itemId: string) => void
  purchaseCosmetic: (itemId: string, price: number) => boolean

  // Game result processing
  processGameResult: (position: number, playerCount: number, gameData: any) => void
}

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: null,
      isAuthenticated: false,
      isLoading: false,
      globalLeaderboard: [],
      friendsLeaderboard: [],
      userRank: 0,
      availableAchievements: [],
      unlockedAchievements: [],
      dailyChallenges: [],
      coinTransactions: [],
      friendRequests: [],
      friends: [],

      // Initialize user profile
      initializeProfile: (username: string, email?: string, selectedAvatar?: string) => {
        const now = new Date().toISOString()
        const avatarId = selectedAvatar || 'default'
        const profile: UserProfile = {
          id: `user_${Date.now()}`,
          username,
          email,
          avatar: avatarId,
          createdAt: now,
          lastLoginAt: now,
          isOnline: true,
          coins: 1000, // Starting coins
          totalCoinsEarned: 1000,
          rank: 0,
          tier: RankTier.BRONZE,
          experience: 0,
          stats: { ...defaultStats },
          friends: [],
          friendRequests: [],
          ownedCosmetics: ['default_token', 'classic_board', 'standard_dice', 'default', 'male_knight', 'female_knight'],
          equippedCosmetics: {
            ...defaultEquippedCosmetics,
            avatar: avatarId
          },
          achievements: [],
          settings: { ...defaultSettings }
        }

        set({
          profile,
          isAuthenticated: true,
          coinTransactions: [{
            id: `tx_${Date.now()}`,
            userId: profile.id,
            type: 'BONUS',
            amount: 1000,
            source: 'WELCOME_BONUS',
            description: 'Welcome bonus for new players',
            timestamp: now
          }]
        })

        // Generate initial daily challenges
        get().generateDailyChallenges()
      },

      // Update profile
      updateProfile: (updates) => {
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null
        }))
      },

      // Update statistics
      updateStats: (updates) => {
        set((state) => ({
          profile: state.profile ? {
            ...state.profile,
            stats: { ...state.profile.stats, ...updates }
          } : null
        }))
      },

      // Update settings
      updateSettings: (updates) => {
        set((state) => ({
          profile: state.profile ? {
            ...state.profile,
            settings: { ...state.profile.settings, ...updates }
          } : null
        }))
      },

      // Add coins
      addCoins: (amount, source, description, gameId) => {
        const { profile } = get()
        if (!profile) return

        const transaction: CoinTransaction = {
          id: `tx_${Date.now()}`,
          userId: profile.id,
          type: 'EARNED',
          amount,
          source,
          description,
          timestamp: new Date().toISOString(),
          gameId
        }

        set((state) => ({
          profile: state.profile ? {
            ...state.profile,
            coins: state.profile.coins + amount,
            totalCoinsEarned: state.profile.totalCoinsEarned + amount
          } : null,
          coinTransactions: [transaction, ...state.coinTransactions].slice(0, 100)
        }))

        // Update rank after coin change
        get().updateRank()
      },

      // Spend coins
      spendCoins: (amount, source, description, itemId) => {
        const { profile } = get()
        if (!profile || profile.coins < amount) return false

        const transaction: CoinTransaction = {
          id: `tx_${Date.now()}`,
          userId: profile.id,
          type: 'SPENT',
          amount: -amount,
          source,
          description,
          timestamp: new Date().toISOString(),
          itemId
        }

        set((state) => ({
          profile: state.profile ? {
            ...state.profile,
            coins: state.profile.coins - amount,
            stats: {
              ...state.profile.stats,
              totalCoinsSpent: state.profile.stats.totalCoinsSpent + amount
            }
          } : null,
          coinTransactions: [transaction, ...state.coinTransactions].slice(0, 100)
        }))

        return true
      },

      // Calculate tier based on coins
      calculateTier: (coins) => {
        if (coins >= 100000) return RankTier.GRANDMASTER
        if (coins >= 50000) return RankTier.MASTER
        if (coins >= 25000) return RankTier.DIAMOND
        if (coins >= 10000) return RankTier.PLATINUM
        if (coins >= 5000) return RankTier.GOLD
        if (coins >= 2000) return RankTier.SILVER
        return RankTier.BRONZE
      },

      // Update rank
      updateRank: () => {
        const { profile } = get()
        if (!profile) return

        const newTier = get().calculateTier(profile.coins)

        set((state) => ({
          profile: state.profile ? {
            ...state.profile,
            tier: newTier
          } : null
        }))
      },

      // Process game result
      processGameResult: (position, playerCount, gameData) => {
        const { profile } = get()
        if (!profile) return

        // Calculate coin rewards based on position and player count
        let coinsEarned = 0
        if (playerCount === 4) {
          const rewards = [500, 250, 100, 0]
          coinsEarned = rewards[position - 1] || 0
        } else if (playerCount === 3) {
          const rewards = [400, 200, 50]
          coinsEarned = rewards[position - 1] || 0
        } else if (playerCount === 2) {
          const rewards = [300, 0]
          coinsEarned = rewards[position - 1] || 0
        }

        // Update statistics
        const isWin = position === 1
        const newStats: Partial<PlayerStatistics> = {
          gamesPlayed: profile.stats.gamesPlayed + 1,
          gamesWon: isWin ? profile.stats.gamesWon + 1 : profile.stats.gamesWon,
          gamesLost: !isWin ? profile.stats.gamesLost + 1 : profile.stats.gamesLost,
          currentWinStreak: isWin ? profile.stats.currentWinStreak + 1 : 0,
          currentLossStreak: !isWin ? profile.stats.currentLossStreak + 1 : 0,
          bestWinStreak: isWin ? Math.max(profile.stats.bestWinStreak, profile.stats.currentWinStreak + 1) : profile.stats.bestWinStreak,
          lastGameDate: new Date().toISOString()
        }

        // Update position statistics
        if (position === 1) newStats.firstPlaceFinishes = profile.stats.firstPlaceFinishes + 1
        else if (position === 2) newStats.secondPlaceFinishes = profile.stats.secondPlaceFinishes + 1
        else if (position === 3) newStats.thirdPlaceFinishes = profile.stats.thirdPlaceFinishes + 1
        else if (position === 4) newStats.fourthPlaceFinishes = profile.stats.fourthPlaceFinishes + 1

        // Calculate win percentage
        newStats.winPercentage = ((newStats.gamesWon || 0) / (newStats.gamesPlayed || 1)) * 100

        // Calculate average position
        const totalPositions = (profile.stats.firstPlaceFinishes * 1) +
                              (profile.stats.secondPlaceFinishes * 2) +
                              (profile.stats.thirdPlaceFinishes * 3) +
                              (profile.stats.fourthPlaceFinishes * 4) +
                              position
        newStats.averagePosition = totalPositions / (newStats.gamesPlayed || 1)

        get().updateStats(newStats)

        // Add coins if earned
        if (coinsEarned > 0) {
          get().addCoins(coinsEarned, 'GAME_WIN', `${position === 1 ? 'Won' : `Finished ${position}${position === 2 ? 'nd' : position === 3 ? 'rd' : 'th'}`} in ${playerCount}-player game`, gameData?.gameId)
        }

        // Check for achievements
        get().checkAchievements()

        // Update daily challenge progress
        const today = new Date().toISOString().split('T')[0]
        const activeChallenges = get().dailyChallenges.filter(c =>
          c.expiresAt.startsWith(today) && !c.completed
        )

        activeChallenges.forEach(challenge => {
          if (challenge.type === 'PLAY_GAMES') {
            get().updateDailyChallengeProgress(challenge.id, challenge.progress + 1)
          } else if (challenge.type === 'WIN_GAMES' && isWin) {
            get().updateDailyChallengeProgress(challenge.id, challenge.progress + 1)
          } else if (challenge.type === 'EARN_COINS' && coinsEarned > 0) {
            get().updateDailyChallengeProgress(challenge.id, challenge.progress + coinsEarned)
          }
        })
      },

      // Placeholder implementations for other methods
      checkAchievements: () => {
        // TODO: Implement achievement checking logic
      },

      unlockAchievement: (_achievementId: string) => {
        // TODO: Implement achievement unlocking
      },

      updateDailyChallengeProgress: (challengeId: string, progress: number) => {
        set((state) => ({
          dailyChallenges: state.dailyChallenges.map(challenge => {
            if (challenge.id === challengeId) {
              const newProgress = Math.min(progress, challenge.target)
              const completed = newProgress >= challenge.target
              return {
                ...challenge,
                progress: newProgress,
                completed
              }
            }
            return challenge
          })
        }))
      },

      claimDailyChallenge: (challengeId: string) => {
        const challenge = get().dailyChallenges.find(c => c.id === challengeId)
        if (!challenge || !challenge.completed || challenge.claimedAt) return

        // Add rewards
        get().addCoins(challenge.coinReward, 'DAILY_CHALLENGE', `Completed: ${challenge.name}`)

        // Mark as claimed
        set((state) => ({
          dailyChallenges: state.dailyChallenges.map(c =>
            c.id === challengeId
              ? { ...c, claimedAt: new Date().toISOString() }
              : c
          )
        }))
      },

      generateDailyChallenges: () => {
        const { profile } = get()
        if (!profile) return

        const now = new Date()
        const today = now.toISOString().split('T')[0]

        // Check if challenges already exist for today
        const existingChallenges = get().dailyChallenges.filter(
          challenge => challenge.expiresAt.startsWith(today)
        )

        if (existingChallenges.length > 0) return

        // Generate 3 random daily challenges
        const templates = Object.values(DAILY_CHALLENGE_TEMPLATES)
        const selectedTemplates = templates
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)

        const newChallenges: DailyChallenge[] = selectedTemplates.map((template, index) => {
          const target = template.targets[Math.floor(Math.random() * template.targets.length)]
          const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()

          return {
            id: `daily_${today}_${index}`,
            name: template.name,
            description: template.description.replace('{target}', target.toString()),
            type: template.type as DailyChallenge['type'],
            target,
            progress: 0,
            coinReward: template.coinReward,
            experienceReward: template.experienceReward,
            expiresAt,
            completed: false
          }
        })

        set((state) => ({
          dailyChallenges: [...state.dailyChallenges.filter(c => !c.expiresAt.startsWith(today)), ...newChallenges]
        }))
      },

      sendFriendRequest: (username: string) => {
        const { profile } = get()
        if (!profile) return

        // In a real app, this would send a request to the server
        // For now, we'll simulate finding the user and creating a request
        const requestId = `req_${Date.now()}`
        const mockTargetUserId = `user_${username.toLowerCase()}`

        const friendRequest: FriendRequest = {
          id: requestId,
          fromUserId: profile.id,
          fromUsername: profile.username,
          toUserId: mockTargetUserId,
          status: 'PENDING',
          createdAt: new Date().toISOString()
        }

        set((state) => ({
          friendRequests: [...state.friendRequests, friendRequest]
        }))
      },

      acceptFriendRequest: (requestId: string) => {
        const { profile } = get()
        if (!profile) return

        const request = get().friendRequests.find(r => r.id === requestId)
        if (!request || request.status !== 'PENDING') return

        // Create mock friend profile
        const friendProfile: UserProfile = {
          id: request.fromUserId,
          username: request.fromUsername,
          avatar: 'default',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          isOnline: Math.random() > 0.5, // Random online status
          coins: Math.floor(Math.random() * 10000) + 1000,
          totalCoinsEarned: Math.floor(Math.random() * 15000) + 2000,
          rank: Math.floor(Math.random() * 1000) + 1,
          tier: Object.values(RankTier)[Math.floor(Math.random() * Object.values(RankTier).length)],
          experience: Math.floor(Math.random() * 5000),
          stats: { ...defaultStats },
          friends: [],
          friendRequests: [],
          ownedCosmetics: ['default_token', 'classic_board', 'standard_dice', 'default'],
          equippedCosmetics: { ...defaultEquippedCosmetics },
          achievements: [],
          settings: { ...defaultSettings }
        }

        // Update friend request status and add friend
        set((state) => ({
          friendRequests: state.friendRequests.map(r =>
            r.id === requestId ? { ...r, status: 'ACCEPTED' as const } : r
          ),
          friends: [...state.friends, friendProfile],
          profile: state.profile ? {
            ...state.profile,
            friends: [...state.profile.friends, request.fromUserId],
            stats: {
              ...state.profile.stats,
              friendsCount: state.profile.stats.friendsCount + 1
            }
          } : null
        }))
      },

      declineFriendRequest: (requestId: string) => {
        set((state) => ({
          friendRequests: state.friendRequests.map(r =>
            r.id === requestId ? { ...r, status: 'DECLINED' as const } : r
          )
        }))
      },

      removeFriend: (userId: string) => {
        const { profile } = get()
        if (!profile) return

        set((state) => ({
          friends: state.friends.filter(f => f.id !== userId),
          profile: state.profile ? {
            ...state.profile,
            friends: state.profile.friends.filter(id => id !== userId),
            stats: {
              ...state.profile.stats,
              friendsCount: Math.max(0, state.profile.stats.friendsCount - 1)
            }
          } : null
        }))
      },

      updateLeaderboard: () => {
        // TODO: Implement leaderboard updates
      },

      equipCosmetic: (type, itemId) => {
        set((state) => ({
          profile: state.profile ? {
            ...state.profile,
            equippedCosmetics: {
              ...state.profile.equippedCosmetics,
              [type]: itemId
            }
          } : null
        }))
      },

      purchaseCosmetic: (itemId, price) => {
        const success = get().spendCoins(price, 'SHOP_PURCHASE', `Purchased cosmetic: ${itemId}`, itemId)
        if (success) {
          set((state) => ({
            profile: state.profile ? {
              ...state.profile,
              ownedCosmetics: [...state.profile.ownedCosmetics, itemId]
            } : null
          }))
        }
        return success
      }
    }),
    {
      name: 'user-profile-store',
      partialize: (state) => ({
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
        coinTransactions: state.coinTransactions,
        dailyChallenges: state.dailyChallenges,
        friendRequests: state.friendRequests
      })
    }
  )
)
