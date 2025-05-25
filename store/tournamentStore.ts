import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Tournament, TournamentParticipant, TournamentBracket, RankTier } from '../types'

// Generate mock tournaments
const generateMockTournaments = (): Tournament[] => {
  const now = new Date()
  const tournaments: Tournament[] = []

  // Weekly Tournament
  const weeklyStart = new Date(now.getTime() + 2 * 60 * 60 * 1000) // 2 hours from now
  const weeklyEnd = new Date(weeklyStart.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days later

  tournaments.push({
    id: 'weekly_tournament',
    name: 'Weekly Championship',
    description: 'Compete against players from around the world in this weekly tournament. Top players win exclusive rewards!',
    entryFee: 100,
    prizePool: 5000,
    maxParticipants: 64,
    currentParticipants: 23,
    status: 'REGISTRATION',
    startTime: weeklyStart.toISOString(),
    endTime: weeklyEnd.toISOString(),
    participants: [],
    brackets: [],
    rules: {
      gameMode: 'classic',
      timeLimit: 30,
      eliminationStyle: 'SINGLE',
      tieBreaker: 'COINS'
    }
  })

  // Daily Tournament
  const dailyStart = new Date(now.getTime() + 30 * 60 * 1000) // 30 minutes from now
  const dailyEnd = new Date(dailyStart.getTime() + 24 * 60 * 60 * 1000) // 24 hours later

  tournaments.push({
    id: 'daily_tournament',
    name: 'Daily Blitz',
    description: 'Fast-paced daily tournament with quick games. Perfect for players who want instant action!',
    entryFee: 50,
    prizePool: 1000,
    maxParticipants: 32,
    currentParticipants: 18,
    status: 'REGISTRATION',
    startTime: dailyStart.toISOString(),
    endTime: dailyEnd.toISOString(),
    participants: [],
    brackets: [],
    rules: {
      gameMode: 'quick',
      timeLimit: 15,
      eliminationStyle: 'SINGLE',
      tieBreaker: 'TIME'
    }
  })

  // Premium Tournament
  const premiumStart = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours from now
  const premiumEnd = new Date(premiumStart.getTime() + 3 * 24 * 60 * 60 * 1000) // 3 days later

  tournaments.push({
    id: 'premium_tournament',
    name: 'Grand Masters Cup',
    description: 'Elite tournament for the best players. High entry fee, but massive rewards for the winners!',
    entryFee: 500,
    prizePool: 25000,
    maxParticipants: 128,
    currentParticipants: 45,
    status: 'REGISTRATION',
    startTime: premiumStart.toISOString(),
    endTime: premiumEnd.toISOString(),
    participants: [],
    brackets: [],
    rules: {
      gameMode: 'classic',
      timeLimit: 45,
      eliminationStyle: 'DOUBLE',
      tieBreaker: 'COINS'
    }
  })

  return tournaments
}

// Generate tournament brackets
const generateBrackets = (participants: TournamentParticipant[]): TournamentBracket[] => {
  const brackets: TournamentBracket[] = []

  // For simplicity, we'll create a single elimination bracket
  let currentRound = 1
  let currentParticipants = [...participants]

  while (currentParticipants.length > 1) {
    const roundBrackets: TournamentBracket[] = []

    for (let i = 0; i < currentParticipants.length; i += 2) {
      const participant1 = currentParticipants[i]
      const participant2 = currentParticipants[i + 1]

      if (participant2) {
        roundBrackets.push({
          id: `bracket_${currentRound}_${Math.floor(i / 2)}`,
          round: currentRound,
          match: Math.floor(i / 2) + 1,
          participants: [participant1.userId, participant2.userId],
          status: 'PENDING'
        })
      } else {
        // Bye - participant advances automatically
        roundBrackets.push({
          id: `bracket_${currentRound}_${Math.floor(i / 2)}`,
          round: currentRound,
          match: Math.floor(i / 2) + 1,
          participants: [participant1.userId],
          winner: participant1.userId,
          status: 'COMPLETED'
        })
      }
    }

    brackets.push(...roundBrackets)
    currentParticipants = roundBrackets
      .filter(b => b.winner)
      .map(b => participants.find(p => p.userId === b.winner)!)
      .filter(Boolean)

    currentRound++
  }

  return brackets
}

interface TournamentState {
  tournaments: Tournament[]
  userRegistrations: string[] // Tournament IDs user is registered for

  // Actions
  initializeTournaments: () => void
  registerForTournament: (tournamentId: string, userId: string, username: string, tier: RankTier) => boolean
  unregisterFromTournament: (tournamentId: string, userId: string) => boolean
  startTournament: (tournamentId: string) => boolean
  updateBracketResult: (tournamentId: string, bracketId: string, winnerId: string) => boolean
  getTournamentById: (tournamentId: string) => Tournament | undefined
  getUserTournaments: () => Tournament[]
}

export const useTournamentStore = create<TournamentState>()(
  persist(
    (set, get) => ({
      tournaments: [],
      userRegistrations: [],

      initializeTournaments: () => {
        const existingTournaments = get().tournaments
        if (existingTournaments.length === 0) {
          set({ tournaments: generateMockTournaments() })
        }
      },

      registerForTournament: (tournamentId: string, userId: string, username: string, tier: RankTier) => {
        const tournament = get().tournaments.find(t => t.id === tournamentId)
        if (!tournament || tournament.status !== 'REGISTRATION') return false
        if (tournament.currentParticipants >= tournament.maxParticipants) return false
        if (tournament.participants.some(p => p.userId === userId)) return false

        const participant: TournamentParticipant = {
          userId,
          username,
          tier,
          registeredAt: new Date().toISOString(),
          currentRound: 1,
          isEliminated: false
        }

        set((state) => ({
          tournaments: state.tournaments.map(t =>
            t.id === tournamentId
              ? {
                  ...t,
                  participants: [...t.participants, participant],
                  currentParticipants: t.currentParticipants + 1
                }
              : t
          ),
          userRegistrations: [...state.userRegistrations, tournamentId]
        }))

        return true
      },

      unregisterFromTournament: (tournamentId: string, userId: string) => {
        const tournament = get().tournaments.find(t => t.id === tournamentId)
        if (!tournament || tournament.status !== 'REGISTRATION') return false

        set((state) => ({
          tournaments: state.tournaments.map(t =>
            t.id === tournamentId
              ? {
                  ...t,
                  participants: t.participants.filter(p => p.userId !== userId),
                  currentParticipants: Math.max(0, t.currentParticipants - 1)
                }
              : t
          ),
          userRegistrations: state.userRegistrations.filter(id => id !== tournamentId)
        }))

        return true
      },

      startTournament: (tournamentId: string) => {
        const tournament = get().tournaments.find(t => t.id === tournamentId)
        if (!tournament || tournament.status !== 'REGISTRATION') return false
        if (tournament.participants.length < 4) return false // Minimum participants

        const brackets = generateBrackets(tournament.participants)

        set((state) => ({
          tournaments: state.tournaments.map(t =>
            t.id === tournamentId
              ? {
                  ...t,
                  status: 'IN_PROGRESS' as const,
                  brackets
                }
              : t
          )
        }))

        return true
      },

      updateBracketResult: (tournamentId: string, bracketId: string, winnerId: string) => {
        const tournament = get().tournaments.find(t => t.id === tournamentId)
        if (!tournament || tournament.status !== 'IN_PROGRESS') return false

        const bracket = tournament.brackets.find(b => b.id === bracketId)
        if (!bracket || !bracket.participants.includes(winnerId)) return false

        set((state) => ({
          tournaments: state.tournaments.map(t =>
            t.id === tournamentId
              ? {
                  ...t,
                  brackets: t.brackets.map(b =>
                    b.id === bracketId
                      ? { ...b, winner: winnerId, status: 'COMPLETED' as const }
                      : b
                  ),
                  participants: t.participants.map(p =>
                    bracket.participants.includes(p.userId) && p.userId !== winnerId
                      ? { ...p, isEliminated: true }
                      : p
                  )
                }
              : t
          )
        }))

        // Check if tournament is complete
        const updatedTournament = get().tournaments.find(t => t.id === tournamentId)
        if (updatedTournament) {
          const finalBracket = updatedTournament.brackets
            .filter(b => b.status === 'COMPLETED')
            .sort((a, b) => b.round - a.round)[0]

          if (finalBracket && finalBracket.round === Math.ceil(Math.log2(updatedTournament.participants.length))) {
            // Tournament is complete
            set((state) => ({
              tournaments: state.tournaments.map(t =>
                t.id === tournamentId
                  ? { ...t, status: 'COMPLETED' as const }
                  : t
              )
            }))
          }
        }

        return true
      },

      getTournamentById: (tournamentId: string) => {
        return get().tournaments.find(t => t.id === tournamentId)
      },

      getUserTournaments: () => {
        const userRegistrations = get().userRegistrations
        return get().tournaments.filter(t => userRegistrations.includes(t.id))
      }
    }),
    {
      name: 'tournament-store',
      partialize: (state) => ({
        tournaments: state.tournaments,
        userRegistrations: state.userRegistrations
      })
    }
  )
)
