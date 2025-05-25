import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Clock,
  Coins,
  Trophy,
  CheckCircle,
  Gift,
  Calendar,
  Star,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { useUserProfileStore } from '../../store/userProfileStore';
import { DailyChallenge } from '../../types';
import { cn } from '../../lib/utils';

interface DailyChallengesPageProps {
  onBack?: () => void;
}

const DailyChallengesPage: React.FC<DailyChallengesPageProps> = ({ onBack }) => {
  const {
    dailyChallenges,
    generateDailyChallenges,
    claimDailyChallenge
  } = useUserProfileStore();

  useEffect(() => {
    generateDailyChallenges();
  }, [generateDailyChallenges]);

  const getTimeUntilExpiry = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  const getChallengeIcon = (type: DailyChallenge['type']) => {
    switch (type) {
      case 'WIN_GAMES':
        return <Trophy className="w-5 h-5" />;
      case 'PLAY_GAMES':
        return <Target className="w-5 h-5" />;
      case 'EARN_COINS':
        return <Coins className="w-5 h-5" />;
      case 'CAPTURE_TOKENS':
        return <Zap className="w-5 h-5" />;
      case 'FINISH_TOKENS':
        return <Star className="w-5 h-5" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  const getChallengeColor = (type: DailyChallenge['type']) => {
    switch (type) {
      case 'WIN_GAMES':
        return 'from-yellow-500 to-orange-500';
      case 'PLAY_GAMES':
        return 'from-blue-500 to-purple-500';
      case 'EARN_COINS':
        return 'from-green-500 to-emerald-500';
      case 'CAPTURE_TOKENS':
        return 'from-red-500 to-pink-500';
      case 'FINISH_TOKENS':
        return 'from-indigo-500 to-blue-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const activeChallenges = dailyChallenges.filter(
    challenge => new Date(challenge.expiresAt) > new Date()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Daily Challenges
          </h1>
          <p className="text-gray-600">
            Complete daily challenges to earn coins and experience!
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-gray-800">
                {activeChallenges.length}
              </div>
              <div className="text-sm text-gray-600">Active Challenges</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-gray-800">
                {activeChallenges.filter(c => c.completed).length}
              </div>
              <div className="text-sm text-gray-600">Completed Today</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Coins className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <div className="text-2xl font-bold text-gray-800">
                {activeChallenges.reduce((sum, c) => sum + (c.completed && !c.claimedAt ? c.coinReward : 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Coins to Claim</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Challenges List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Target className="w-6 h-6" />
            Today's Challenges
          </h2>

          {activeChallenges.length > 0 ? (
            <div className="grid gap-4">
              <AnimatePresence>
                {activeChallenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={cn(
                      "overflow-hidden transition-all duration-300",
                      challenge.completed
                        ? "ring-2 ring-green-500 bg-green-50"
                        : "hover:shadow-lg bg-white/90 backdrop-blur-sm"
                    )}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "p-2 rounded-lg bg-gradient-to-r text-white",
                              getChallengeColor(challenge.type)
                            )}>
                              {getChallengeIcon(challenge.type)}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{challenge.name}</CardTitle>
                              <p className="text-sm text-gray-600">{challenge.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              {getTimeUntilExpiry(challenge.expiresAt)}
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {/* Progress */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span className="font-medium">
                                {challenge.progress} / {challenge.target}
                              </span>
                            </div>
                            <Progress
                              value={(challenge.progress / challenge.target) * 100}
                              className="h-2"
                            />
                          </div>

                          {/* Rewards and Action */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1 text-yellow-600">
                                <Coins className="w-4 h-4" />
                                <span className="font-medium">{challenge.coinReward}</span>
                              </div>
                              <div className="flex items-center gap-1 text-purple-600">
                                <Star className="w-4 h-4" />
                                <span className="font-medium">{challenge.experienceReward} XP</span>
                              </div>
                            </div>

                            {challenge.completed && !challenge.claimedAt ? (
                              <Button
                                onClick={() => claimDailyChallenge(challenge.id)}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                              >
                                <Gift className="w-4 h-4 mr-2" />
                                Claim Reward
                              </Button>
                            ) : challenge.claimedAt ? (
                              <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-medium">Claimed</span>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500">
                                In Progress
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold mb-2">No Active Challenges</h3>
                <p className="text-gray-600 mb-4">
                  New challenges will be available tomorrow!
                </p>
                <Button
                  onClick={generateDailyChallenges}
                  variant="outline"
                >
                  Refresh Challenges
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DailyChallengesPage;
