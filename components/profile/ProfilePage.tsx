import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Trophy,
  Coins,
  TrendingUp,
  Award,
  Settings,
  Edit3,
  Crown,
  Star,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useUserProfileStore } from '../../store/userProfileStore';
import { RANK_TIERS } from '../../constants/rewards';
import { RankTier } from '../../types';

interface ProfilePageProps {
  onClose: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onClose }) => {
  const { profile, coinTransactions } = useUserProfileStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'achievements' | 'transactions'>('overview');

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-bold mb-2">No Profile Found</h2>
            <p className="text-gray-600 mb-4">Please create a profile to view your stats.</p>
            <Button onClick={onClose}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tierInfo = RANK_TIERS[profile.tier];
  const progressToNextTier = profile.tier !== RankTier.GRANDMASTER
    ? ((profile.coins - tierInfo.min) / (tierInfo.max - tierInfo.min)) * 100
    : 100;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'stats', label: 'Statistics', icon: TrendingUp },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'transactions', label: 'Transactions', icon: Coins }
  ];

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
            <h1 className="text-3xl font-bold text-white">Player Profile</h1>
          </div>
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </motion.div>

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                    {profile.username.charAt(0).toUpperCase()}
                  </div>
                  <div
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-lg"
                    style={{ backgroundColor: tierInfo.color }}
                  >
                    {tierInfo.icon}
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{profile.username}</h2>
                    <Button variant="ghost" size="sm">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5" style={{ color: tierInfo.color }} />
                      <span className="font-semibold" style={{ color: tierInfo.color }}>
                        {profile.tier}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <span className="font-semibold">Rank #{profile.rank || 'Unranked'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-yellow-500" />
                      <span className="font-semibold">{profile.coins.toLocaleString()} coins</span>
                    </div>
                  </div>

                  {/* Tier Progress */}
                  {profile.tier !== RankTier.GRANDMASTER && (
                    <div className="w-full max-w-md">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{profile.tier}</span>
                        <span>Next Tier</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${progressToNextTier}%`,
                            backgroundColor: tierInfo.color
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{tierInfo.min.toLocaleString()}</span>
                        <span>{tierInfo.max.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{profile.stats.gamesWon}</div>
                    <div className="text-sm text-gray-600">Wins</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{profile.stats.gamesPlayed}</div>
                    <div className="text-sm text-gray-600">Games</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {profile.stats.winPercentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Win Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {profile.stats.averagePosition.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Avg Position</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-purple-600 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {coinTransactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(transaction.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                        <div className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements Preview */}
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.achievements.slice(0, 3).map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <div className="font-medium">{achievement.name}</div>
                          <div className="text-sm text-gray-500">{achievement.description}</div>
                        </div>
                        <div className="ml-auto text-yellow-500 font-bold">
                          +{achievement.coinReward}
                        </div>
                      </div>
                    ))}
                    {profile.achievements.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        <Star className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No achievements yet. Start playing to unlock them!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Game Statistics */}
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Game Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Games Played</span>
                    <span className="font-bold">{profile.stats.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Games Won</span>
                    <span className="font-bold text-green-600">{profile.stats.gamesWon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Games Lost</span>
                    <span className="font-bold text-red-600">{profile.stats.gamesLost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Win Percentage</span>
                    <span className="font-bold">{profile.stats.winPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Position</span>
                    <span className="font-bold">{profile.stats.averagePosition.toFixed(1)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Streak Statistics */}
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Streaks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Current Win Streak</span>
                    <span className="font-bold text-green-600">{profile.stats.currentWinStreak}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Best Win Streak</span>
                    <span className="font-bold text-blue-600">{profile.stats.bestWinStreak}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Loss Streak</span>
                    <span className="font-bold text-red-600">{profile.stats.currentLossStreak}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Position Statistics */}
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Position Finishes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>🥇 1st Place</span>
                    <span className="font-bold text-yellow-500">{profile.stats.firstPlaceFinishes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🥈 2nd Place</span>
                    <span className="font-bold text-gray-400">{profile.stats.secondPlaceFinishes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🥉 3rd Place</span>
                    <span className="font-bold text-orange-500">{profile.stats.thirdPlaceFinishes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>4th Place</span>
                    <span className="font-bold">{profile.stats.fourthPlaceFinishes}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'achievements' && (
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profile.achievements.map((achievement) => (
                      <div key={achievement.id} className="p-4 border rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50">
                        <div className="text-center">
                          <div className="text-4xl mb-2">{achievement.icon}</div>
                          <h3 className="font-bold text-lg">{achievement.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                          <div className="text-yellow-600 font-bold">+{achievement.coinReward} coins</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-bold mb-2">No Achievements Yet</h3>
                    <p className="text-gray-600">Start playing games to unlock achievements and earn rewards!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'transactions' && (
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Coin Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {coinTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-gray-500">
                          {transaction.source} • {new Date(transaction.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className={`font-bold text-lg ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                      </div>
                    </div>
                  ))}
                  {coinTransactions.length === 0 && (
                    <div className="text-center py-12">
                      <Coins className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-bold mb-2">No Transactions Yet</h3>
                      <p className="text-gray-600">Your coin transactions will appear here.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
