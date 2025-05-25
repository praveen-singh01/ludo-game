import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Users,
  Clock,
  Coins,
  Crown,
  Zap,
  Target,
  Star,
  UserPlus,
  UserMinus,
  ArrowLeft,
  Eye,
  Play
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useTournamentStore } from '../../store/tournamentStore';
import { useUserProfileStore } from '../../store/userProfileStore';
import { Tournament } from '../../types';
import { cn } from '../../lib/utils';
import TournamentBracket from './TournamentBracket';

interface TournamentPageProps {
  onBack?: () => void;
}

const TournamentPage: React.FC<TournamentPageProps> = ({ onBack }) => {
  const {
    tournaments,
    userRegistrations,
    initializeTournaments,
    registerForTournament,
    unregisterFromTournament,
    getUserTournaments
  } = useTournamentStore();

  const { profile, spendCoins } = useUserProfileStore();
  const [activeTab, setActiveTab] = useState<'available' | 'registered'>('available');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'bracket'>('list');

  useEffect(() => {
    initializeTournaments();
  }, [initializeTournaments]);

  const handleRegister = (tournament: Tournament) => {
    if (!profile) return;

    const success = spendCoins(
      tournament.entryFee,
      'TOURNAMENT_ENTRY',
      `Tournament Entry: ${tournament.name}`
    );

    if (success) {
      registerForTournament(tournament.id, profile.id, profile.username, profile.tier);
    }
  };

  const handleUnregister = (tournamentId: string) => {
    if (!profile) return;
    unregisterFromTournament(tournamentId, profile.id);
    // In a real app, you might refund the entry fee
  };

  const getTimeUntilStart = (startTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start.getTime() - now.getTime();

    if (diff <= 0) return 'Started';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }

    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: Tournament['status']) => {
    switch (status) {
      case 'REGISTRATION':
        return 'text-green-600 bg-green-100';
      case 'IN_PROGRESS':
        return 'text-blue-600 bg-blue-100';
      case 'COMPLETED':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getGameModeIcon = (gameMode: string) => {
    switch (gameMode) {
      case 'quick':
        return <Zap className="w-4 h-4" />;
      case 'classic':
        return <Target className="w-4 h-4" />;
      default:
        return <Trophy className="w-4 h-4" />;
    }
  };

  const handleViewBracket = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setViewMode('bracket');
  };

  const handleSpectateMatch = (gameId: string) => {
    // In a real app, this would navigate to the game spectator view
    console.log('Spectating game:', gameId);
    alert(`Spectating game ${gameId} - This would open the live game view!`);
  };

  const availableTournaments = tournaments.filter(t => t.status === 'REGISTRATION');
  const userTournaments = getUserTournaments();

  // Show bracket view if selected
  if (viewMode === 'bracket' && selectedTournament) {
    return (
      <TournamentBracket
        tournament={selectedTournament}
        onSpectateMatch={handleSpectateMatch}
        onBack={() => {
          setViewMode('list');
          setSelectedTournament(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {onBack && (
            <div className="flex items-center justify-start mb-4">
              <Button
                onClick={onBack}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Menu
              </Button>
            </div>
          )}
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
            Tournaments
          </h1>
          <p className="text-gray-600">
            Compete in tournaments to win exclusive rewards and climb the leaderboards!
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <div className="text-2xl font-bold text-gray-800">{availableTournaments.length}</div>
              <div className="text-sm text-gray-600">Available</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-gray-800">{userTournaments.length}</div>
              <div className="text-sm text-gray-600">Registered</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Coins className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-gray-800">
                {tournaments.reduce((sum, t) => sum + t.prizePool, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Prizes</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Crown className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-gray-800">
                {profile?.coins || 0}
              </div>
              <div className="text-sm text-gray-600">Your Coins</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2"
        >
          <Button
            variant={activeTab === 'available' ? 'default' : 'outline'}
            onClick={() => setActiveTab('available')}
            className="flex items-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            Available ({availableTournaments.length})
          </Button>
          <Button
            variant={activeTab === 'registered' ? 'default' : 'outline'}
            onClick={() => setActiveTab('registered')}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            My Tournaments ({userTournaments.length})
          </Button>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'available' ? (
            <motion.div
              key="available"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {availableTournaments.length > 0 ? (
                availableTournaments.map((tournament, index) => {
                  const isRegistered = userRegistrations.includes(tournament.id);
                  const canAfford = profile && profile.coins >= tournament.entryFee;
                  const isFull = tournament.currentParticipants >= tournament.maxParticipants;

                  return (
                    <motion.div
                      key={tournament.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                {getGameModeIcon(tournament.rules.gameMode)}
                                {tournament.name}
                              </CardTitle>
                              <p className="text-sm text-gray-600 mt-1">{tournament.description}</p>
                            </div>
                            <div className={cn(
                              "px-3 py-1 rounded-full text-sm font-medium",
                              getStatusColor(tournament.status)
                            )}>
                              {tournament.status.replace('_', ' ')}
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <Coins className="w-4 h-4 text-yellow-600" />
                              <div>
                                <div className="text-sm text-gray-600">Entry Fee</div>
                                <div className="font-semibold">{tournament.entryFee} coins</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Trophy className="w-4 h-4 text-purple-600" />
                              <div>
                                <div className="text-sm text-gray-600">Prize Pool</div>
                                <div className="font-semibold">{tournament.prizePool.toLocaleString()} coins</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-blue-600" />
                              <div>
                                <div className="text-sm text-gray-600">Participants</div>
                                <div className="font-semibold">
                                  {tournament.currentParticipants} / {tournament.maxParticipants}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-green-600" />
                              <div>
                                <div className="text-sm text-gray-600">Starts In</div>
                                <div className="font-semibold">{getTimeUntilStart(tournament.startTime)}</div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                {tournament.rules.gameMode} mode
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {tournament.rules.timeLimit}min limit
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                {tournament.rules.eliminationStyle} elimination
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* View Bracket Button for In Progress/Completed tournaments */}
                              {(tournament.status === 'IN_PROGRESS' || tournament.status === 'COMPLETED') && (
                                <Button
                                  onClick={() => handleViewBracket(tournament)}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Bracket
                                </Button>
                              )}

                              {isRegistered ? (
                                <Button
                                  onClick={() => handleUnregister(tournament.id)}
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <UserMinus className="w-4 h-4 mr-2" />
                                  Unregister
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => handleRegister(tournament)}
                                  disabled={!canAfford || isFull}
                                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                                >
                                  <UserPlus className="w-4 h-4 mr-2" />
                                  {isFull ? 'Full' : !canAfford ? 'Insufficient Coins' : 'Register'}
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              ) : (
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-bold mb-2">No Tournaments Available</h3>
                    <p className="text-gray-600">
                      Check back later for new tournament opportunities!
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="registered"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {userTournaments.length > 0 ? (
                userTournaments.map((tournament, index) => (
                  <motion.div
                    key={tournament.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/90 backdrop-blur-sm">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            {getGameModeIcon(tournament.rules.gameMode)}
                            {tournament.name}
                          </CardTitle>
                          <div className={cn(
                            "px-3 py-1 rounded-full text-sm font-medium",
                            getStatusColor(tournament.status)
                          )}>
                            {tournament.status.replace('_', ' ')}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-600" />
                            <div>
                              <div className="text-sm text-gray-600">Your Position</div>
                              <div className="font-semibold">
                                {tournament.participants.findIndex(p => p.userId === profile?.id) + 1} / {tournament.currentParticipants}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-purple-600" />
                            <div>
                              <div className="text-sm text-gray-600">Prize Pool</div>
                              <div className="font-semibold">{tournament.prizePool.toLocaleString()} coins</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-green-600" />
                            <div>
                              <div className="text-sm text-gray-600">
                                {tournament.status === 'REGISTRATION' ? 'Starts In' : 'Status'}
                              </div>
                              <div className="font-semibold">
                                {tournament.status === 'REGISTRATION'
                                  ? getTimeUntilStart(tournament.startTime)
                                  : tournament.status.replace('_', ' ')
                                }
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end">
                          {(tournament.status === 'IN_PROGRESS' || tournament.status === 'COMPLETED') && (
                            <Button
                              onClick={() => handleViewBracket(tournament)}
                              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Tournament Bracket
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-bold mb-2">No Registered Tournaments</h3>
                    <p className="text-gray-600 mb-4">
                      You haven't registered for any tournaments yet.
                    </p>
                    <Button
                      onClick={() => setActiveTab('available')}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                    >
                      Browse Available Tournaments
                    </Button>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TournamentPage;
