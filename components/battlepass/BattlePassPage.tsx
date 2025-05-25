import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  Star,
  Lock,
  Gift,
  Coins,
  Trophy,
  Calendar,
  Zap,
  CheckCircle,
  Sparkles,
  ArrowLeft,
  TrendingUp,
  Share2,
  BarChart3,
  Target,
  Clock,
  Palette,
  Gem
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { useBattlePassStore } from '../../store/battlePassStore';
import { useUserProfileStore } from '../../store/userProfileStore';
import { BattlePassReward } from '../../types';
import { cn } from '../../lib/utils';

interface BattlePassPageProps {
  onBack?: () => void;
}

const BattlePassPage: React.FC<BattlePassPageProps> = ({ onBack }) => {
  const {
    currentBattlePass,
    userProgress,
    initializeBattlePass,
    purchasePremium,
    claimReward,
    shareAchievement,
    getCurrentLevel,
    getExperienceForNextLevel,
    getUnclaimedRewards,
    getProgressStats,
    getSeasonalCosmetics
  } = useBattlePassStore();

  const { profile, spendCoins } = useUserProfileStore();
  const [activeTab, setActiveTab] = useState<'rewards' | 'analytics' | 'cosmetics'>('rewards');

  useEffect(() => {
    initializeBattlePass();
  }, [initializeBattlePass]);

  const handlePurchasePremium = () => {
    if (!currentBattlePass || !profile) return;

    const success = spendCoins(
      currentBattlePass.price,
      'BATTLE_PASS',
      `Premium Battle Pass - ${currentBattlePass.name}`
    );

    if (success) {
      purchasePremium();
    }
  };

  const handleClaimReward = (level: number, isPremium: boolean) => {
    const success = claimReward(level, isPremium);
    if (success) {
      // In a real app, you'd add the reward to the user's inventory
      console.log(`Claimed ${isPremium ? 'premium' : 'free'} reward for level ${level}`);
    }
  };

  const getRewardIcon = (reward: BattlePassReward) => {
    switch (reward.type) {
      case 'COINS':
        return <Coins className="w-4 h-4" />;
      case 'COSMETIC':
        return <Sparkles className="w-4 h-4" />;
      case 'ACHIEVEMENT':
        return <Trophy className="w-4 h-4" />;
      default:
        return <Gift className="w-4 h-4" />;
    }
  };

  const getRewardColor = (reward: BattlePassReward) => {
    switch (reward.type) {
      case 'COINS':
        return 'text-yellow-600';
      case 'COSMETIC':
        return 'text-purple-600';
      case 'ACHIEVEMENT':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'legendary':
        return 'from-yellow-400 to-orange-500';
      case 'epic':
        return 'from-purple-400 to-pink-500';
      case 'rare':
        return 'from-blue-400 to-cyan-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getThemeColors = () => {
    if (!currentBattlePass?.colors) return ['#4F46E5', '#7C3AED', '#EC4899'];
    return currentBattlePass.colors;
  };

  const handleShareAchievement = (level: number) => {
    shareAchievement(`battle_pass_level_${level}`);
    // In a real app, this would open a share dialog
    alert(`Shared Battle Pass Level ${level} achievement!`);
  };

  const getTimeRemaining = () => {
    if (!currentBattlePass) return '';

    const now = new Date();
    const endDate = new Date(currentBattlePass.endDate);
    const diff = endDate.getTime() - now.getTime();

    if (diff <= 0) return 'Season Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return `${days}d ${hours}h remaining`;
  };

  const currentLevel = getCurrentLevel();
  const expForNext = getExperienceForNextLevel();
  const unclaimedRewards = getUnclaimedRewards();
  const progressStats = getProgressStats();
  const seasonalCosmetics = getSeasonalCosmetics();
  const themeColors = getThemeColors();

  if (!currentBattlePass || !userProgress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Crown className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-bold mb-2">Loading Battle Pass...</h3>
            <p className="text-gray-600">Please wait while we prepare your seasonal content.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
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

          {/* Seasonal Theme Header */}
          <div
            className="relative p-8 rounded-2xl mb-6 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${themeColors[0]}, ${themeColors[1]}, ${themeColors[2]})`
            }}
          >
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 text-white">
              <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
                <Palette className="w-10 h-10" />
                {currentBattlePass.name}
              </h1>
              <p className="text-white/90 mb-4 max-w-2xl mx-auto">
                {currentBattlePass.description}
              </p>

              {/* Theme Badge */}
              {currentBattlePass.theme && (
                <Badge className="bg-white/20 text-white border-white/30 mb-4">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {currentBattlePass.theme.charAt(0).toUpperCase() + currentBattlePass.theme.slice(1)} Theme
                </Badge>
              )}

              <div className="flex items-center justify-center gap-6 text-sm">
                <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                  <Calendar className="w-4 h-4" />
                  {getTimeRemaining()}
                </span>
                <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4" />
                  Level {currentLevel} / {currentBattlePass.maxLevel}
                </span>
                <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                  <Trophy className="w-4 h-4" />
                  Season {currentBattlePass.season}
                </span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center gap-2 mb-6">
            <Button
              variant={activeTab === 'rewards' ? 'default' : 'outline'}
              onClick={() => setActiveTab('rewards')}
              className="flex items-center gap-2"
            >
              <Gift className="w-4 h-4" />
              Rewards
            </Button>
            <Button
              variant={activeTab === 'analytics' ? 'default' : 'outline'}
              onClick={() => setActiveTab('analytics')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </Button>
            <Button
              variant={activeTab === 'cosmetics' ? 'default' : 'outline'}
              onClick={() => setActiveTab('cosmetics')}
              className="flex items-center gap-2"
            >
              <Palette className="w-4 h-4" />
              Cosmetics
            </Button>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'rewards' && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Progress Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <Star className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold text-gray-800">{currentLevel}</div>
                    <div className="text-sm text-gray-600">Current Level</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <Zap className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-gray-800">{expForNext}</div>
                    <div className="text-sm text-gray-600">XP to Next Level</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <Gift className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold text-gray-800">{unclaimedRewards.length}</div>
                    <div className="text-sm text-gray-600">Unclaimed Rewards</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                    <div className="text-2xl font-bold text-gray-800">{progressStats.projectedFinalLevel}</div>
                    <div className="text-sm text-gray-600">Projected Level</div>
                  </CardContent>
                </Card>
              </div>

        {/* Premium Purchase */}
        {!userProgress.isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-6 h-6" />
                  Upgrade to Premium
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-2">
                      Unlock premium rewards, exclusive cosmetics, and bonus experience!
                    </p>
                    <div className="flex items-center gap-2 text-sm opacity-90">
                      <Coins className="w-4 h-4" />
                      {currentBattlePass.price.toLocaleString()} coins
                    </div>
                  </div>
                  <Button
                    onClick={handlePurchasePremium}
                    disabled={!profile || profile.coins < currentBattlePass.price}
                    className="bg-white text-purple-600 hover:bg-gray-100"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Unclaimed Rewards */}
        {unclaimedRewards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Gift className="w-5 h-5" />
                  Unclaimed Rewards ({unclaimedRewards.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {unclaimedRewards.slice(0, 6).map(({ level, isPremium, reward }) => (
                    <div
                      key={`${level}-${isPremium}`}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border"
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "p-2 rounded-lg",
                          isPremium ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                        )}>
                          {getRewardIcon(reward)}
                        </div>
                        <div>
                          <div className="font-medium text-sm">Level {level}</div>
                          <div className="text-xs text-gray-600">
                            {reward.type === 'COINS' ? `${reward.quantity} coins` : reward.itemId}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleClaimReward(level, isPremium)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Claim
                      </Button>
                    </div>
                  ))}
                </div>
                {unclaimedRewards.length > 6 && (
                  <p className="text-center text-sm text-gray-600 mt-3">
                    +{unclaimedRewards.length - 6} more rewards available
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Battle Pass Tiers Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Reward Tiers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Free Track */}
                <div>
                  <h4 className="font-semibold text-blue-600 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Free Track
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {currentBattlePass.freeRewards.slice(0, 12).map((reward) => (
                      <div
                        key={`free-${reward.level}`}
                        className={cn(
                          "p-3 rounded-lg border text-center cursor-pointer transition-all",
                          reward.level <= currentLevel ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200",
                          userProgress.claimedFreeRewards.includes(reward.level) && "ring-2 ring-green-500"
                        )}
                        onClick={() => console.log('Selected level:', reward.level)}
                      >
                        <div className={cn("text-lg mb-1", getRewardColor(reward))}>
                          {getRewardIcon(reward)}
                        </div>
                        <div className="text-xs font-medium">Lv.{reward.level}</div>
                        {userProgress.claimedFreeRewards.includes(reward.level) && (
                          <CheckCircle className="w-3 h-3 text-green-500 mx-auto mt-1" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Premium Track */}
                <div>
                  <h4 className="font-semibold text-purple-600 mb-2 flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Premium Track
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {currentBattlePass.premiumRewards.slice(0, 12).map((reward) => (
                      <div
                        key={`premium-${reward.level}`}
                        className={cn(
                          "p-3 rounded-lg border text-center cursor-pointer transition-all",
                          userProgress.isPremium && reward.level <= currentLevel
                            ? "bg-purple-50 border-purple-200"
                            : "bg-gray-50 border-gray-200",
                          !userProgress.isPremium && "opacity-50",
                          userProgress.claimedPremiumRewards.includes(reward.level) && "ring-2 ring-green-500"
                        )}
                        onClick={() => console.log('Selected premium level:', reward.level)}
                      >
                        <div className={cn("text-lg mb-1", getRewardColor(reward))}>
                          {!userProgress.isPremium ? <Lock className="w-4 h-4" /> : getRewardIcon(reward)}
                        </div>
                        <div className="text-xs font-medium">Lv.{reward.level}</div>
                        {userProgress.claimedPremiumRewards.includes(reward.level) && (
                          <CheckCircle className="w-3 h-3 text-green-500 mx-auto mt-1" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Progress Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold text-gray-800">
                      {progressStats.averageExpPerDay.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Avg XP/Day</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-gray-800">
                      {progressStats.daysRemaining}
                    </div>
                    <div className="text-sm text-gray-600">Days Left</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <Target className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold text-gray-800">
                      {progressStats.projectedFinalLevel}
                    </div>
                    <div className="text-sm text-gray-600">Projected Level</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <Zap className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                    <div className="text-2xl font-bold text-gray-800">
                      {progressStats.totalExperience.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total XP</div>
                  </CardContent>
                </Card>
              </div>

              {/* Progress Chart */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Progress Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Season Progress</span>
                        <span>{currentLevel} / {currentBattlePass.maxLevel}</span>
                      </div>
                      <Progress
                        value={(currentLevel / currentBattlePass.maxLevel) * 100}
                        className="h-3"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Time Progress</span>
                        <span>{Math.max(0, 90 - progressStats.daysRemaining)} / 90 days</span>
                      </div>
                      <Progress
                        value={Math.max(0, (90 - progressStats.daysRemaining) / 90) * 100}
                        className="h-3"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Performance</h4>
                        <p className="text-sm text-blue-600">
                          {progressStats.averageExpPerDay > 50
                            ? "Excellent progress! You're on track to complete the battle pass."
                            : progressStats.averageExpPerDay > 25
                            ? "Good progress! Keep playing to reach higher levels."
                            : "Consider playing more games to maximize your battle pass rewards."
                          }
                        </p>
                      </div>

                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">Projection</h4>
                        <p className="text-sm text-green-600">
                          At your current pace, you'll reach level {progressStats.projectedFinalLevel} by season end.
                          {progressStats.projectedFinalLevel >= currentBattlePass.maxLevel
                            ? " You'll complete the entire battle pass!"
                            : ` You need ${((currentBattlePass.maxLevel - currentLevel) * 100 / progressStats.daysRemaining).toFixed(0)} more XP per day to max out.`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Sharing */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Share Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                    <div>
                      <h4 className="font-semibold">Level {currentLevel} Achievement</h4>
                      <p className="text-sm text-gray-600">
                        Share your battle pass progress with friends!
                      </p>
                    </div>
                    <Button
                      onClick={() => handleShareAchievement(currentLevel)}
                      className="bg-gradient-to-r from-purple-500 to-blue-500"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Cosmetics Tab */}
          {activeTab === 'cosmetics' && (
            <motion.div
              key="cosmetics"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Seasonal Theme Info */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    {currentBattlePass.theme?.charAt(0).toUpperCase() + currentBattlePass.theme?.slice(1)} Collection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Exclusive {currentBattlePass.theme} themed cosmetics available this season.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {seasonalCosmetics.map((cosmetic, index) => (
                      <div
                        key={cosmetic}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="w-full h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-3 flex items-center justify-center">
                          <Gem className="w-8 h-8 text-gray-500" />
                        </div>
                        <h4 className="font-semibold text-sm mb-1 capitalize">
                          {cosmetic.replace('_', ' ')}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {currentBattlePass.theme} Theme
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Rarity Breakdown */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Rarity Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['common', 'rare', 'epic', 'legendary'].map((rarity) => {
                      const count = [...currentBattlePass.freeRewards, ...currentBattlePass.premiumRewards]
                        .filter(r => r.rarity === rarity).length;

                      return (
                        <div key={rarity} className="text-center p-4 border rounded-lg">
                          <div className={cn(
                            "w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br flex items-center justify-center",
                            getRarityColor(rarity)
                          )}>
                            <Gem className="w-6 h-6 text-white" />
                          </div>
                          <div className="font-semibold capitalize">{rarity}</div>
                          <div className="text-sm text-gray-600">{count} items</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BattlePassPage;
