
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Settings, Trophy, Users, Gamepad2, Clock, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useGameStore } from '../store/gameStore';

interface GameSetupProps {
  onSetupComplete: (numPlayers: number, gameMode?: string) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onSetupComplete }) => {
  const [numPlayers, setNumPlayers] = useState<number>(4);
  const [gameMode, setGameMode] = useState<string>('classic');
  const { stats, getSavedGames } = useGameStore();
  const savedGames = getSavedGames();

  const handleStartGame = () => {
    if (numPlayers >= 2 && numPlayers <= 4) {
      onSetupComplete(numPlayers, gameMode);
    }
  };

  const gameModes = [
    {
      id: 'classic',
      name: 'Classic Ludo',
      description: 'Traditional Ludo rules with all features',
      icon: <Gamepad2 className="w-6 h-6" />,
      duration: '30-45 min'
    },
    {
      id: 'quick',
      name: 'Quick Game',
      description: 'Faster gameplay with simplified rules',
      icon: <Zap className="w-6 h-6" />,
      duration: '15-20 min'
    },
    {
      id: 'custom',
      name: 'Custom Rules',
      description: 'Customize game rules to your preference',
      icon: <Settings className="w-6 h-6" />,
      duration: 'Variable'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-6xl font-bold text-white mb-4 drop-shadow-lg"
          >
            🎲 Ludo Master
          </motion.h1>
          <p className="text-xl text-white/80">The Ultimate Board Game Experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Setup Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Play className="w-6 h-6 text-purple-600" />
                  Start New Game
                </CardTitle>
                <CardDescription>
                  Configure your game settings and begin your Ludo adventure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Player Count Selection */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-lg font-medium">
                    <Users className="w-5 h-5" />
                    Number of Players
                  </label>
                  <Select value={numPlayers.toString()} onValueChange={(value) => setNumPlayers(parseInt(value))}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Players</SelectItem>
                      <SelectItem value="3">3 Players</SelectItem>
                      <SelectItem value="4">4 Players</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Game Mode Selection */}
                <div className="space-y-3">
                  <label className="text-lg font-medium">Game Mode</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {gameModes.map((mode) => (
                      <motion.div
                        key={mode.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all duration-200 ${
                            gameMode === mode.id
                              ? 'ring-2 ring-purple-500 bg-purple-50'
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => setGameMode(mode.id)}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="flex flex-col items-center gap-2">
                              {mode.icon}
                              <h3 className="font-semibold">{mode.name}</h3>
                              <p className="text-sm text-gray-600">{mode.description}</p>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                {mode.duration}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleStartGame}
                  variant="game"
                  size="xl"
                  className="w-full"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Game
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats and Saved Games */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-6"
          >
            {/* Player Stats */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Games Played:</span>
                  <span className="font-semibold">{stats.gamesPlayed}</span>
                </div>
                <div className="flex justify-between">
                  <span>Games Won:</span>
                  <span className="font-semibold text-green-600">{stats.gamesWon}</span>
                </div>
                <div className="flex justify-between">
                  <span>Win Rate:</span>
                  <span className="font-semibold">
                    {stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Saved Games */}
            {savedGames.length > 0 && (
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle>Continue Game</CardTitle>
                  <CardDescription>Resume your saved games</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {savedGames.slice(0, 3).map((game) => (
                      <Button
                        key={game.id}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          // Load saved game logic will be implemented
                          console.log('Load game:', game.id);
                        }}
                      >
                        <div className="text-left">
                          <div className="font-medium">{game.name}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(game.date).toLocaleDateString()}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default GameSetup;
