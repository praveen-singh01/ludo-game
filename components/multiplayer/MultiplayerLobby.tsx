import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Copy,
  Check,
  Crown,
  Wifi,
  WifiOff,
  Play,
  LogOut,
  MessageCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useMultiplayerStore } from '../../store/multiplayerStore';
import { PLAYER_SETUP_CONFIG } from '../../constants';

const MultiplayerLobby: React.FC = () => {
  const {
    currentRoom,
    playerId,
    setPlayerReady,
    startGame,
    leaveRoom,
    setShowChat,
    showChat
  } = useMultiplayerStore();

  const [copiedRoomId, setCopiedRoomId] = useState(false);

  if (!currentRoom) return null;

  const currentPlayer = currentRoom.players.find(p => p.id === playerId);
  const isHost = currentPlayer?.isHost || false;
  const canStartGame = currentRoom.players.length >= 2 &&
                      currentRoom.players.every(p => p.isReady && p.connected);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(currentRoom.id);
      setCopiedRoomId(true);
      setTimeout(() => setCopiedRoomId(false), 2000);
    } catch (err) {
      console.error('Failed to copy room ID:', err);
    }
  };

  const handleReadyToggle = () => {
    if (currentPlayer) {
      setPlayerReady(!currentPlayer.isReady);
    }
  };

  const handleStartGame = () => {
    if (isHost && canStartGame) {
      startGame();
    }
  };

  const getPlayerColorConfig = (color: string) => {
    return PLAYER_SETUP_CONFIG[color as keyof typeof PLAYER_SETUP_CONFIG];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-5xl font-bold text-white mb-4 drop-shadow-lg"
          >
            🎲 Game Lobby
          </motion.h1>
          <p className="text-xl text-white/80">Waiting for players to join...</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Room Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Room Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Room ID</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-gray-100 rounded-md font-mono text-lg">
                      {currentRoom.id}
                    </code>
                    <Button
                      onClick={copyRoomId}
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                    >
                      {copiedRoomId ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Share this ID with friends to invite them
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Players:</span>
                    <span className="ml-2 font-semibold">
                      {currentRoom.players.length}/{currentRoom.maxPlayers}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-2 font-semibold capitalize">
                      {currentRoom.gameStatus}
                    </span>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Button
                    onClick={handleReadyToggle}
                    variant={currentPlayer?.isReady ? "default" : "outline"}
                    className="w-full"
                  >
                    {currentPlayer?.isReady ? "Ready!" : "Mark as Ready"}
                  </Button>

                  {isHost && (
                    <Button
                      onClick={handleStartGame}
                      disabled={!canStartGame}
                      variant="game"
                      className="w-full"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Game
                    </Button>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowChat(!showChat)}
                      variant="outline"
                      className="flex-1"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                    <Button
                      onClick={leaveRoom}
                      variant="destructive"
                      className="flex-1"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Leave
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Players List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle>Players ({currentRoom.players.length}/{currentRoom.maxPlayers})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {currentRoom.players.map((player, index) => {
                      const colorConfig = getPlayerColorConfig(player.color);
                      return (
                        <motion.div
                          key={player.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                        >
                          <Card className={`relative overflow-hidden ${
                            player.id === playerId ? 'ring-2 ring-purple-500' : ''
                          }`}>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                {/* Player Color */}
                                <div
                                  className={`w-12 h-12 rounded-full ${colorConfig.baseColor} flex items-center justify-center shadow-lg`}
                                >
                                  <span className="text-white font-bold text-lg">
                                    {player.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>

                                {/* Player Info */}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-lg">
                                      {player.name}
                                    </h3>
                                    {player.isHost && (
                                      <Crown className="w-4 h-4 text-yellow-500" />
                                    )}
                                    {player.id === playerId && (
                                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                        You
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-4 mt-1">
                                    {/* Connection Status */}
                                    <div className="flex items-center gap-1">
                                      {player.connected ? (
                                        <Wifi className="w-3 h-3 text-green-500" />
                                      ) : (
                                        <WifiOff className="w-3 h-3 text-red-500" />
                                      )}
                                      <span className="text-xs text-gray-600">
                                        {player.connected ? 'Online' : 'Offline'}
                                      </span>
                                    </div>

                                    {/* Ready Status */}
                                    <div className={`text-xs px-2 py-1 rounded-full ${
                                      player.isReady
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}>
                                      {player.isReady ? 'Ready' : 'Not Ready'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {/* Empty Slots */}
                  {Array.from({ length: currentRoom.maxPlayers - currentRoom.players.length }).map((_, index) => (
                    <motion.div
                      key={`empty-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: (currentRoom.players.length + index) * 0.1 }}
                    >
                      <Card className="border-dashed border-2 border-gray-300">
                        <CardContent className="p-4 flex items-center justify-center h-20">
                          <div className="text-center text-gray-400">
                            <Users className="w-6 h-6 mx-auto mb-1" />
                            <span className="text-sm">Waiting for player...</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {!canStartGame && currentRoom.players.length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                  >
                    <p className="text-sm text-yellow-800">
                      ⏳ Waiting for all players to be ready and connected before starting the game.
                    </p>
                  </motion.div>
                )}

                {currentRoom.players.length < 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <p className="text-sm text-blue-800">
                      👥 Need at least 2 players to start the game. Share the room ID with friends!
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default MultiplayerLobby;
