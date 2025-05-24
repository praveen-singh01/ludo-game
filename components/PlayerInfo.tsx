import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Home, Play, Trophy, Target } from 'lucide-react';
import { Player, GameState } from '../types';
import { PLAYER_SETUP_CONFIG, TOKENS_PER_PLAYER, TOKEN_SIZE_CLASSES } from '../constants';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import TokenIcon from './TokenIcon';

interface PlayerInfoProps {
  player: Player;
  isCurrentPlayer: boolean;
  finishedTokensCount: number;
}

const PlayerInfoCard: React.FC<PlayerInfoProps> = ({ player, isCurrentPlayer, finishedTokensCount }) => {
  const config = PLAYER_SETUP_CONFIG[player.id];
  const homeTokens = player.tokens.filter(t => t.state === 'HOME').length;
  const activeTokens = player.tokens.filter(t => t.state === 'ACTIVE').length;
  const progressPercentage = (finishedTokensCount / TOKENS_PER_PLAYER) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className={`transition-all duration-300 ${
        isCurrentPlayer
          ? `ring-2 ring-purple-500 ring-offset-2 shadow-xl bg-gradient-to-br from-white to-purple-50`
          : 'shadow-md hover:shadow-lg bg-white'
      }`}>
        <CardHeader className="pb-3">
          <CardTitle className={`flex items-center gap-2 text-lg ${config.textColor}`}>
            <div className={`w-4 h-4 rounded-full ${config.baseColor}`} />
            {player.name}
            {isCurrentPlayer && (
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className="w-5 h-5 text-yellow-500" />
              </motion.div>
            )}
          </CardTitle>
          {isCurrentPlayer && (
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-sm text-purple-600 font-semibold flex items-center gap-1"
            >
              <Play className="w-3 h-3" />
              Your Turn!
            </motion.p>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold">{finishedTokensCount}/{TOKENS_PER_PLAYER}</span>
            </div>
            <Progress
              value={progressPercentage}
              className="h-2"
            />
          </div>

          {/* Token Status */}
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <Home className="w-4 h-4 mx-auto mb-1 text-gray-600" />
              <div className="font-semibold">{homeTokens}</div>
              <div className="text-xs text-gray-500">Home</div>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <Target className="w-4 h-4 mx-auto mb-1 text-blue-600" />
              <div className="font-semibold">{activeTokens}</div>
              <div className="text-xs text-gray-500">Active</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <Trophy className="w-4 h-4 mx-auto mb-1 text-green-600" />
              <div className="font-semibold">{finishedTokensCount}</div>
              <div className="text-xs text-gray-500">Finished</div>
            </div>
          </div>

          {/* Finished Tokens Display */}
          {finishedTokensCount > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Completed Tokens:</div>
              <div className="flex flex-wrap gap-1">
                {player.tokens.filter(t => t.state === 'FINISHED').map((token, index) => (
                  <motion.div
                    key={token.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <TokenIcon
                      token={token}
                      sizeClass={TOKEN_SIZE_CLASSES.finishedDisplay}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};


interface GameStatusDisplayProps {
  gameState: GameState;
  currentPlayer: Player | null;
}

const GameStatusDisplay: React.FC<GameStatusDisplayProps> = ({ gameState, currentPlayer }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl"
    >
      <Card className="bg-gradient-to-r from-white to-gray-50 shadow-2xl border-2">
        <CardContent className="p-6 text-center">
          {gameState.gameStatus === 'SETUP' && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xl md:text-2xl font-semibold text-gray-700">{gameState.message}</p>
            </motion.div>
          )}

          {gameState.gameStatus === 'PLAYING' && currentPlayer && (
            <motion.div
              key={currentPlayer.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-2"
            >
              <h2 className={`text-2xl md:text-3xl font-bold ${PLAYER_SETUP_CONFIG[currentPlayer.id].textColor} flex items-center justify-center gap-3`}>
                <div className={`w-6 h-6 rounded-full ${PLAYER_SETUP_CONFIG[currentPlayer.id].baseColor}`} />
                {PLAYER_SETUP_CONFIG[currentPlayer.id].name}'s Turn
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Crown className="w-6 h-6 text-yellow-500" />
                </motion.div>
              </h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-md md:text-lg text-gray-600 px-2"
              >
                {gameState.message}
              </motion.p>
            </motion.div>
          )}

          {gameState.gameStatus === 'GAMEOVER' && gameState.winner && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              className="space-y-4"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <h2 className={`text-3xl md:text-4xl font-bold ${PLAYER_SETUP_CONFIG[gameState.winner].textColor} py-2 flex items-center justify-center gap-3`}>
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  {PLAYER_SETUP_CONFIG[gameState.winner].name} Wins!
                  <Trophy className="w-8 h-8 text-yellow-500" />
                </h2>
              </motion.div>
              <div className="text-2xl">🎉 🎊 🏆 🎊 🎉</div>
            </motion.div>
          )}

          {gameState.gameStatus === 'GAMEOVER' && !gameState.winner && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-700 py-2">Game Over!</h2>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};


export { PlayerInfoCard, GameStatusDisplay };