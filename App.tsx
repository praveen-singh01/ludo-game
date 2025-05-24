import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Settings, Save, Menu } from 'lucide-react';
import { useLudoGame } from './hooks/useLudoGame';
import { useGameStore } from './store/gameStore';
import GameBoard from './components/GameBoard';
import DiceRoll from './components/DiceRoll';
import { PlayerInfoCard, GameStatusDisplay } from './components/PlayerInfo';
import GameSetup from './components/GameSetup';
import { Button } from './components/ui/button';
import { PLAYER_SETUP_CONFIG } from './constants';

const App: React.FC = () => {
  const {
    gameState,
    initializeGame,
    rollDice,
    moveToken,
    getCurrentPlayer,
  } = useLudoGame();

  const { updateGameState, saveGame } = useGameStore();
  const currentPlayer = getCurrentPlayer();

  // Update store when game state changes
  React.useEffect(() => {
    updateGameState(gameState);
  }, [gameState, updateGameState]);

  const handleSaveGame = () => {
    const gameName = `Game ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
    saveGame(gameName);
  };

  const handleNewGame = () => {
    initializeGame(gameState.players.length);
  };

  if (gameState.gameStatus === 'SETUP') {
    return <GameSetup onSetupComplete={(numPlayers) => initializeGame(numPlayers)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center p-2 sm:p-4"
    >
      {/* Header with Game Controls */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-7xl flex justify-between items-center mb-4"
      >
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">🎲 Ludo Master</h1>
        </div>

        <div className="flex items-center gap-2">
          {gameState.gameStatus === 'PLAYING' && (
            <>
              <Button
                onClick={handleSaveGame}
                variant="outline"
                size="sm"
                className="hidden sm:flex"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Game
              </Button>
              <Button
                onClick={handleNewGame}
                variant="outline"
                size="sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                New Game
              </Button>
            </>
          )}
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      <GameStatusDisplay gameState={gameState} currentPlayer={currentPlayer} />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="w-full max-w-7xl flex flex-col xl:flex-row gap-4 md:gap-6"
      >
        {/* Player Info Cards */}
        <motion.div
          className="w-full xl:w-80 order-2 xl:order-1"
          layout
        >
          <div className="grid grid-cols-2 xl:grid-cols-1 gap-3">
            <AnimatePresence>
              {gameState.players.map((player, index) => {
                const finishedCount = player.tokens.filter(t => t.state === 'FINISHED').length;
                return (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <PlayerInfoCard
                      player={player}
                      isCurrentPlayer={currentPlayer?.id === player.id}
                      finishedTokensCount={finishedCount}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Game Board */}
        <motion.div
          className="flex-1 order-1 xl:order-2 flex justify-center items-center"
          layout
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <GameBoard
              players={gameState.players}
              onTokenClick={moveToken}
              availableMoves={gameState.gameStatus === 'PLAYING' && gameState.hasRolled ? gameState.availableMoves : []}
            />
          </motion.div>
        </motion.div>

        {/* Dice and Controls */}
        <motion.div
          className="w-full xl:w-80 order-3 xl:order-3 flex flex-col items-center justify-start"
          layout
        >
          <AnimatePresence mode="wait">
            {currentPlayer && gameState.gameStatus === 'PLAYING' && (
              <motion.div
                key="dice-roll"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <DiceRoll
                  diceValue={gameState.diceValue}
                  onRoll={rollDice}
                  canRoll={!gameState.hasRolled && !gameState.winner}
                  currentPlayerName={PLAYER_SETUP_CONFIG[currentPlayer.id].name}
                />
              </motion.div>
            )}

            {gameState.gameStatus === 'GAMEOVER' && (
              <motion.div
                key="game-over"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                className="w-full space-y-4"
              >
                <div className="text-center space-y-4">
                  <div className="text-4xl">🎉</div>
                  <Button
                    onClick={handleNewGame}
                    variant="game"
                    size="xl"
                    className="w-full"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Play Again ({gameState.players.length} Players)
                  </Button>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="w-full"
                  >
                    <Menu className="w-4 h-4 mr-2" />
                    Main Menu
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="text-center text-gray-600 text-sm mt-8 pb-4"
      >
        <p>🎲 Ludo Master - Production Ready Game Experience</p>
        <p className="text-xs mt-1">Built with React, TypeScript, Tailwind CSS & Framer Motion</p>
      </motion.footer>
    </motion.div>
  );
};

export default App;
