import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Search,
  Check,
  X,
  MessageCircle,
  Coins,
  Trophy,
  Clock,
  UserMinus,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useUserProfileStore } from '../../store/userProfileStore';
import { getAvatarConfig } from '../../constants/cosmetics';
import { RANK_TIERS } from '../../constants/rewards';
import { cn } from '../../lib/utils';

interface FriendsPageProps {
  onBack?: () => void;
}

const FriendsPage: React.FC<FriendsPageProps> = ({ onBack }) => {
  const {
    friends,
    friendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend
  } = useUserProfileStore();

  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');
  const [searchUsername, setSearchUsername] = useState('');

  const handleSendFriendRequest = () => {
    if (searchUsername.trim()) {
      sendFriendRequest(searchUsername.trim());
      setSearchUsername('');
    }
  };

  const pendingRequests = friendRequests.filter(r => r.status === 'PENDING');
  const onlineFriends = friends.filter(f => f.isOnline);
  const offlineFriends = friends.filter(f => !f.isOnline);

  const getTierInfo = (tier: string) => {
    return RANK_TIERS[tier as keyof typeof RANK_TIERS] || RANK_TIERS.BRONZE;
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Friends
          </h1>
          <p className="text-gray-600">
            Connect with other players and challenge them to games!
          </p>
        </motion.div>

        {/* Add Friend Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Add Friend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Enter username..."
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    className="pl-10"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendFriendRequest()}
                  />
                </div>
                <Button
                  onClick={handleSendFriendRequest}
                  disabled={!searchUsername.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Send Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-gray-800">{friends.length}</div>
              <div className="text-sm text-gray-600">Total Friends</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div className="text-2xl font-bold text-gray-800">{onlineFriends.length}</div>
              <div className="text-sm text-gray-600">Online Now</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <UserPlus className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-gray-800">{pendingRequests.length}</div>
              <div className="text-sm text-gray-600">Pending Requests</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-2"
        >
          <Button
            variant={activeTab === 'friends' ? 'default' : 'outline'}
            onClick={() => setActiveTab('friends')}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Friends ({friends.length})
          </Button>
          <Button
            variant={activeTab === 'requests' ? 'default' : 'outline'}
            onClick={() => setActiveTab('requests')}
            className="flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Requests ({pendingRequests.length})
          </Button>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'friends' ? (
            <motion.div
              key="friends"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {friends.length > 0 ? (
                <>
                  {/* Online Friends */}
                  {onlineFriends.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        Online ({onlineFriends.length})
                      </h3>
                      {onlineFriends.map((friend) => {
                        const avatarConfig = getAvatarConfig(friend.avatar || 'default');
                        const tierInfo = getTierInfo(friend.tier);

                        return (
                          <Card key={friend.id} className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    <div className={cn(
                                      "w-12 h-12 rounded-full flex items-center justify-center text-xl",
                                      avatarConfig.backgroundColor,
                                      avatarConfig.borderColor,
                                      "border-2"
                                    )}>
                                      {avatarConfig.emoji}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-semibold">{friend.username}</h4>
                                      <div
                                        className="px-2 py-1 rounded-full text-xs font-bold text-white"
                                        style={{ backgroundColor: tierInfo.color }}
                                      >
                                        {tierInfo.icon} {friend.tier}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                      <span className="flex items-center gap-1">
                                        <Coins className="w-3 h-3" />
                                        {friend.coins.toLocaleString()}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Trophy className="w-3 h-3" />
                                        Rank #{friend.rank}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="outline">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Invite
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => removeFriend(friend.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <UserMinus className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}

                  {/* Offline Friends */}
                  {offlineFriends.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        Offline ({offlineFriends.length})
                      </h3>
                      {offlineFriends.map((friend) => {
                        const avatarConfig = getAvatarConfig(friend.avatar || 'default');
                        const tierInfo = getTierInfo(friend.tier);

                        return (
                          <Card key={friend.id} className="bg-white/70 backdrop-blur-sm">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    <div className={cn(
                                      "w-12 h-12 rounded-full flex items-center justify-center text-xl opacity-70",
                                      avatarConfig.backgroundColor,
                                      avatarConfig.borderColor,
                                      "border-2"
                                    )}>
                                      {avatarConfig.emoji}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-400 rounded-full border-2 border-white"></div>
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-semibold text-gray-700">{friend.username}</h4>
                                      <div
                                        className="px-2 py-1 rounded-full text-xs font-bold text-white opacity-80"
                                        style={{ backgroundColor: tierInfo.color }}
                                      >
                                        {tierInfo.icon} {friend.tier}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {getTimeAgo(friend.lastLoginAt)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeFriend(friend.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <UserMinus className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-bold mb-2">No Friends Yet</h3>
                    <p className="text-gray-600 mb-4">
                      Start building your friend network by sending friend requests!
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="requests"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {pendingRequests.length > 0 ? (
                pendingRequests.map((request) => (
                  <Card key={request.id} className="bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {request.fromUsername.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-semibold">{request.fromUsername}</h4>
                            <p className="text-sm text-gray-600">
                              Sent {getTimeAgo(request.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => acceptFriendRequest(request.id)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => declineFriendRequest(request.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <UserPlus className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-bold mb-2">No Pending Requests</h3>
                    <p className="text-gray-600">
                      Friend requests will appear here when you receive them.
                    </p>
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

export default FriendsPage;
