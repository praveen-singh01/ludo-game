import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Settings, Play, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { PlayerColor } from '../types';
import { AIDifficulty } from '../hooks/useAI';

interface PlayerConfig {
  color: PlayerColor;
  name: string;
  isAI: boolean;
  difficulty: AIDifficulty;
}

interface AIGameSetupProps {
  onSetupComplete: (numPlayers: number, aiPlayers: { playerIndex: number; difficulty: AIDifficulty }[]) => void;
  onBack: () => void;
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 border-green-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  hard: 'bg-red-100 text-red-800 border-red-300'
};

const difficultyDescriptions = {
  easy: 'Makes occasional mistakes, good for beginners',
  medium: 'Balanced strategy with some unpredictability',
  hard: 'Advanced tactics and strategic blocking'
};

export const AIGameSetup: React.FC<AIGameSetupProps> = ({ onSetupComplete, onBack }) => {
  const [numPlayers, setNumPlayers] = useState<number>(2);
  const [playerConfigs, setPlayerConfigs] = useState<PlayerConfig[]>([
    { color: PlayerColor.RED, name: 'Player 1', isAI: false, difficulty: 'medium' },
    { color: PlayerColor.BLUE, name: 'AI Blue (medium)', isAI: true, difficulty: 'medium' },
    { color: PlayerColor.YELLOW, name: 'AI Yellow (medium)', isAI: true, difficulty: 'medium' },
    { color: PlayerColor.GREEN, name: 'AI Green (medium)', isAI: true, difficulty: 'medium' }
  ]);

  const updatePlayerConfig = (index: number, updates: Partial<PlayerConfig>) => {
    setPlayerConfigs(prev => prev.map((config, i) => {
      if (i === index) {
        const updated = { ...config, ...updates };
        // Update name when AI status or difficulty changes
        if (updates.isAI !== undefined || updates.difficulty !== undefined) {
          const colorName = updated.color.charAt(0) + updated.color.slice(1).toLowerCase();
          updated.name = updated.isAI
            ? `AI ${colorName} (${updated.difficulty})`
            : `Player ${index + 1}`;
        }
        return updated;
      }
      return config;
    }));
  };

  const handleStartGame = () => {
    const aiPlayers = playerConfigs
      .slice(0, numPlayers)
      .map((config, index) => ({ playerIndex: index, difficulty: config.difficulty }))
      .filter((_, index) => playerConfigs[index].isAI);

    onSetupComplete(numPlayers, aiPlayers);
  };

  const getColorClass = (color: PlayerColor) => {
    const colorMap = {
      [PlayerColor.RED]: 'bg-red-500',
      [PlayerColor.BLUE]: 'bg-blue-500',
      [PlayerColor.YELLOW]: 'bg-yellow-500',
      [PlayerColor.GREEN]: 'bg-green-500'
    };
    return colorMap[color];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl"
      >
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Settings className="w-6 h-6 text-purple-600" />
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Game Setup
                </CardTitle>
              </div>
              <div className="w-20" /> {/* Spacer for centering */}
            </div>
            <p className="text-gray-600">Configure players and AI opponents</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Number of Players */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Number of Players</h3>
              <div className="flex justify-center gap-2">
                {[2, 3, 4].map(num => (
                  <Button
                    key={num}
                    variant={numPlayers === num ? "default" : "outline"}
                    onClick={() => setNumPlayers(num)}
                    className="w-16 h-16 text-lg font-bold"
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>

            {/* Player Configuration */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-center">Player Configuration</h3>
              <div className="grid gap-4">
                {playerConfigs.slice(0, numPlayers).map((config, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-2 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          {/* Color Indicator */}
                          <div className={`w-12 h-12 rounded-full ${getColorClass(config.color)} flex items-center justify-center text-white font-bold`}>
                            {index + 1}
                          </div>

                          {/* Player Name */}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{config.name}</h4>
                            <p className="text-sm text-gray-600">
                              {config.color.charAt(0) + config.color.slice(1).toLowerCase()} Player
                            </p>
                          </div>

                          {/* Player Type Toggle */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant={!config.isAI ? "default" : "outline"}
                              size="sm"
                              onClick={() => updatePlayerConfig(index, { isAI: false })}
                              className="flex items-center gap-1"
                            >
                              <User className="w-4 h-4" />
                              Human
                            </Button>
                            <Button
                              variant={config.isAI ? "default" : "outline"}
                              size="sm"
                              onClick={() => updatePlayerConfig(index, { isAI: true })}
                              className="flex items-center gap-1"
                            >
                              <Bot className="w-4 h-4" />
                              AI
                            </Button>
                          </div>

                          {/* AI Difficulty */}
                          {config.isAI && (
                            <div className="min-w-[120px]">
                              <Select
                                value={config.difficulty}
                                onValueChange={(value: AIDifficulty) =>
                                  updatePlayerConfig(index, { difficulty: value })
                                }
                              >
                                <SelectTrigger className={`${difficultyColors[config.difficulty]} border-2`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="easy">
                                    <div>
                                      <div className="font-medium">Easy</div>
                                      <div className="text-xs text-gray-500">Beginner friendly</div>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="medium">
                                    <div>
                                      <div className="font-medium">Medium</div>
                                      <div className="text-xs text-gray-500">Balanced strategy</div>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="hard">
                                    <div>
                                      <div className="font-medium">Hard</div>
                                      <div className="text-xs text-gray-500">Advanced tactics</div>
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>

                        {/* AI Difficulty Description */}
                        {config.isAI && (
                          <div className="mt-3 p-2 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-600">
                              {difficultyDescriptions[config.difficulty]}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Start Game Button */}
            <div className="text-center pt-4">
              <Button
                onClick={handleStartGame}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Game
              </Button>
            </div>

            {/* Game Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Game Information</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• AI players will make moves automatically with realistic timing</li>
                <li>• Different difficulty levels provide varying challenge levels</li>
                <li>• You can mix human and AI players in the same game</li>
                <li>• AI players follow the same rules as human players</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
