import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Crown,
  Medal,
  Users,
  Globe,
  RefreshCw,
  Search,
  Star,
  TrendingUp,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useUserProfileStore } from '../../store/userProfileStore';
import { LeaderboardEntry, RankTier } from '../../types';
import { RANK_TIERS } from '../../constants/rewards';

interface LeaderboardPageProps {
  onClose: () => void;
}

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ onClose }) => {
  const { profile, friendsLeaderboard, updateLeaderboard } = useUserProfileStore();
  const [activeTab, setActiveTab] = useState<'global' | 'friends'>('global');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<RankTier | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState(false);

  // Mock leaderboard data for demonstration
  const mockGlobalLeaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      userId: 'user1',
      username: 'LudoMaster2024',
      avatar: 'crown',
      tier: RankTier.GRANDMASTER,
      coins: 125000,
      gamesWon: 450,
      winPercentage: 89.2,
      isOnline: true,
      isFriend: false
    },
    {
      rank: 2,
      userId: 'user2',
      username: 'GameChampion',
      avatar: 'knight',
      tier: RankTier.MASTER,
      coins: 87500,
      gamesWon: 320,
      winPercentage: 85.7,
      isOnline: true,
      isFriend: true
    },
    {
      rank: 3,
      userId: 'user3',
      username: 'DiceRoller',
      avatar: 'wizard',
      tier: RankTier.DIAMOND,
      coins: 65000,
      gamesWon: 280,
      winPercentage: 82.1,
      isOnline: false,
      isFriend: false
    },
    {
      rank: 4,
      userId: 'user4',
      username: 'TokenKing',
      avatar: 'dragon',
      tier: RankTier.DIAMOND,
      coins: 58000,
      gamesWon: 245,
      winPercentage: 79.8,
      isOnline: true,
      isFriend: true
    },
    {
      rank: 5,
      userId: 'user5',
      username: 'BoardMaster',
      avatar: 'default',
      tier: RankTier.PLATINUM,
      coins: 45000,
      gamesWon: 200,
      winPercentage: 76.5,
      isOnline: false,
      isFriend: false
    }
  ];

  // Add current user to leaderboard if profile exists
  const currentUserEntry: LeaderboardEntry | null = profile ? {
    rank: 156,
    userId: profile.id,
    username: profile.username,
    avatar: profile.avatar,
    tier: profile.tier,
    coins: profile.coins,
    gamesWon: profile.stats.gamesWon,
    winPercentage: profile.stats.winPercentage,
    isOnline: true,
    isFriend: false
  } : null;

  const displayLeaderboard = activeTab === 'global' ? mockGlobalLeaderboard : friendsLeaderboard;

  const filteredLeaderboard = displayLeaderboard.filter(entry => {
    const matchesSearch = entry.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier === 'ALL' || entry.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateLeaderboard();
    setIsLoading(false);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-500" />;
    return <span className="w-6 h-6 flex items-center justify-center font-bold text-gray-600">#{rank}</span>;
  };

  const getTierInfo = (tier: RankTier) => RANK_TIERS[tier];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              ← Back
            </Button>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-8 h-8" />
              Leaderboard
            </h1>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-lg p-1">
            <button
              onClick={() => setActiveTab('global')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all ${
                activeTab === 'global'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span className="font-medium">Global</span>
            </button>
            <button
              onClick={() => setActiveTab('friends')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all ${
                activeTab === 'friends'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="font-medium">Friends</span>
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search players..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={filterTier}
                    onChange={(e) => setFilterTier(e.target.value as RankTier | 'ALL')}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="ALL">All Tiers</option>
                    {Object.values(RankTier).map(tier => (
                      <option key={tier} value={tier}>{tier}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Current User Position (if not in top 10) */}
        {currentUserEntry && currentUserEntry.rank > 10 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-purple-300">
              <CardHeader>
                <CardTitle className="text-sm text-purple-600">Your Position</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full">
                    <span className="font-bold text-purple-600">#{currentUserEntry.rank}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">{currentUserEntry.username}</span>
                      <div
                        className="px-2 py-1 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: getTierInfo(currentUserEntry.tier).color }}
                      >
                        {currentUserEntry.tier}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{currentUserEntry.coins.toLocaleString()} coins</span>
                      <span>{currentUserEntry.gamesWon} wins</span>
                      <span>{currentUserEntry.winPercentage.toFixed(1)}% win rate</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                {activeTab === 'global' ? 'Global Rankings' : 'Friends Rankings'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredLeaderboard.length > 0 ? (
                <div className="space-y-2">
                  <AnimatePresence>
                    {filteredLeaderboard.map((entry, index) => {
                      const tierInfo = getTierInfo(entry.tier);
                      return (
                        <motion.div
                          key={entry.userId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center gap-4 p-4 rounded-lg transition-all hover:bg-gray-50 ${
                            entry.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' : 'bg-gray-50'
                          } ${entry.userId === profile?.id ? 'ring-2 ring-purple-300' : ''}`}
                        >
                          {/* Rank */}
                          <div className="flex items-center justify-center w-12">
                            {getRankIcon(entry.rank)}
                          </div>

                          {/* Avatar */}
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                              {entry.username.charAt(0).toUpperCase()}
                            </div>
                            {entry.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                            )}
                          </div>

                          {/* Player Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-lg">{entry.username}</span>
                              {entry.isFriend && (
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              )}
                              <div
                                className="px-2 py-1 rounded-full text-xs font-bold text-white"
                                style={{ backgroundColor: tierInfo.color }}
                              >
                                {tierInfo.icon} {entry.tier}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Trophy className="w-3 h-3" />
                                {entry.gamesWon} wins
                              </span>
                              <span className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {entry.winPercentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>

                          {/* Coins */}
                          <div className="text-right">
                            <div className="text-xl font-bold text-yellow-600">
                              {entry.coins.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">coins</div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-12">
                  {activeTab === 'friends' ? (
                    <>
                      <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-bold mb-2">No Friends on Leaderboard</h3>
                      <p className="text-gray-600">Add friends to see their rankings here!</p>
                    </>
                  ) : (
                    <>
                      <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-bold mb-2">No Players Found</h3>
                      <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Tier Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Ranking Tiers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {Object.entries(RANK_TIERS).map(([tier, info]) => (
                  <div key={tier} className="text-center p-3 rounded-lg bg-gray-50">
                    <div
                      className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: info.color }}
                    >
                      {info.icon}
                    </div>
                    <div className="font-bold text-sm">{tier}</div>
                    <div className="text-xs text-gray-500">
                      {info.min.toLocaleString()}+ coins
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
