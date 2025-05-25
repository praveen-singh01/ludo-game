import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Settings, Save, Menu, Globe, Gamepad2, User, Trophy, ShoppingBag } from 'lucide-react';
import { useLudoGame } from './hooks/useLudoGame';
import { useGameStore } from './store/gameStore';
import { useMultiplayerStore } from './store/multiplayerStore';
import { useUserProfileStore } from './store/userProfileStore';
import GameBoard from './components/GameBoard';
import DiceRoll from './components/DiceRoll';
import { PlayerInfoCard, GameStatusDisplay } from './components/PlayerInfo';
import GameSetup from './components/GameSetup';
import MultiplayerSetup from './components/multiplayer/MultiplayerSetup';
import MultiplayerLobby from './components/multiplayer/MultiplayerLobby';
import ChatPanel from './components/multiplayer/ChatPanel';
import ProfilePage from './components/profile/ProfilePage';
import LeaderboardPage from './components/leaderboard/LeaderboardPage';
import ShopPage from './components/shop/ShopPage';
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

  const {
    isMultiplayerGame,
    multiplayerGameState,
    showLobby,
    currentRoom,
    rollDice: multiplayerRollDice,
    moveToken: multiplayerMoveToken,
    disconnect
  } = useMultiplayerStore();

  const {
    profile,
    isAuthenticated,
    initializeProfile
  } = useUserProfileStore();

  // State for game mode and page navigation
  const [gameMode, setGameMode] = React.useState<'menu' | 'single' | 'multiplayer'>('menu');
  const [currentPage, setCurrentPage] = React.useState<'game' | 'profile' | 'leaderboard' | 'shop'>('game');

  // Use multiplayer game state if in multiplayer mode, otherwise use single player
  const activeGameState = isMultiplayerGame ? multiplayerGameState : gameState;
  const currentPlayer = activeGameState ? getCurrentPlayer() : null;

  // Update store when game state changes
  React.useEffect(() => {
    if (!isMultiplayerGame) {
      updateGameState(gameState);
    }
  }, [gameState, updateGameState, isMultiplayerGame]);

  // Initialize user profile if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      // For demo purposes, create a default profile
      // In production, this would be handled by proper authentication
      initializeProfile('Player' + Math.floor(Math.random() * 1000));
    }
  }, [isAuthenticated, initializeProfile]);

  // Handle multiplayer lobby display
  useEffect(() => {
    if (showLobby && currentRoom) {
      setGameMode('multiplayer');
    }
  }, [showLobby, currentRoom]);

  const handleSaveGame = () => {
    if (!isMultiplayerGame) {
      const gameName = `Game ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
      saveGame(gameName);
    }
  };

  const handleNewGame = () => {
    if (isMultiplayerGame) {
      disconnect();
      setGameMode('menu');
    } else {
      initializeGame(activeGameState?.players.length || 4);
    }
  };

  const handleRollDice = () => {
    if (isMultiplayerGame) {
      multiplayerRollDice();
    } else {
      rollDice();
    }
  };

  const handleMoveToken = (tokenId: string) => {
    if (isMultiplayerGame) {
      multiplayerMoveToken(tokenId);
    } else {
      moveToken(tokenId);
    }
  };

  // Page navigation
  if (currentPage === 'profile') {
    return <ProfilePage onClose={() => setCurrentPage('game')} />;
  }

  if (currentPage === 'leaderboard') {
    return <LeaderboardPage onClose={() => setCurrentPage('game')} />;
  }

  if (currentPage === 'shop') {
    return <ShopPage onClose={() => setCurrentPage('game')} />;
  }

  // Game mode selection screen
  if (gameMode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl text-center"
        >
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-6xl font-bold text-white mb-4 drop-shadow-lg"
          >
            🎲 Ludo Master
          </motion.h1>
          <p className="text-xl text-white/80 mb-8">Choose your game mode</p>

          {/* Player Info Bar */}
          {profile && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8 flex items-center justify-center gap-6 bg-white/10 backdrop-blur-sm rounded-lg p-4"
            >
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">{profile.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">{profile.tier}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-green-400" />
                <span className="text-white font-semibold">{profile.coins.toLocaleString()} coins</span>
              </div>
            </motion.div>
          )}

          {/* Game Mode Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Button
                onClick={() => setGameMode('single')}
                variant="game"
                className="w-full h-32 flex-col gap-4 text-lg"
              >
                <Gamepad2 className="w-12 h-12" />
                <div>
                  <div className="font-bold">Single Player</div>
                  <div className="text-sm opacity-80">Play offline with AI or local players</div>
                </div>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Button
                onClick={() => setGameMode('multiplayer')}
                variant="outline"
                className="w-full h-32 flex-col gap-4 text-lg bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Globe className="w-12 h-12" />
                <div>
                  <div className="font-bold">Multiplayer</div>
                  <div className="text-sm opacity-80">Play online with friends in real-time</div>
                </div>
              </Button>
            </motion.div>
          </div>

          {/* Navigation Menu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Button
              onClick={() => setCurrentPage('profile')}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-16 flex-col gap-2"
            >
              <User className="w-6 h-6" />
              <span>Profile & Stats</span>
            </Button>
            <Button
              onClick={() => setCurrentPage('leaderboard')}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-16 flex-col gap-2"
            >
              <Trophy className="w-6 h-6" />
              <span>Leaderboard</span>
            </Button>
            <Button
              onClick={() => setCurrentPage('shop')}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-16 flex-col gap-2"
            >
              <ShoppingBag className="w-6 h-6" />
              <span>Cosmetic Shop</span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Multiplayer setup and lobby
  if (gameMode === 'multiplayer') {
    if (showLobby && currentRoom) {
      return (
        <>
          <MultiplayerLobby />
          <ChatPanel />
        </>
      );
    }
    return <MultiplayerSetup onBackToSinglePlayer={() => setGameMode('menu')} />;
  }

  // Single player setup
  if (gameMode === 'single' && (!activeGameState || activeGameState.gameStatus === 'SETUP')) {
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
          {/* Navigation Buttons */}
          <Button
            onClick={() => setCurrentPage('profile')}
            variant="outline"
            size="sm"
            className="hidden sm:flex"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
          <Button
            onClick={() => setCurrentPage('leaderboard')}
            variant="outline"
            size="sm"
            className="hidden sm:flex"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Leaderboard
          </Button>
          <Button
            onClick={() => setCurrentPage('shop')}
            variant="outline"
            size="sm"
            className="hidden sm:flex"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Shop
          </Button>

          {/* Game Actions */}
          {activeGameState?.gameStatus === 'PLAYING' && (
            <>
              {!isMultiplayerGame && (
                <Button
                  onClick={handleSaveGame}
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Game
                </Button>
              )}
              <Button
                onClick={handleNewGame}
                variant="outline"
                size="sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {isMultiplayerGame ? 'Leave Game' : 'New Game'}
              </Button>
            </>
          )}
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      <GameStatusDisplay gameState={activeGameState!} currentPlayer={currentPlayer} />

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
              {activeGameState!.players.map((player, index) => {
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
              players={activeGameState!.players}
              onTokenClick={handleMoveToken}
              availableMoves={activeGameState!.gameStatus === 'PLAYING' && activeGameState!.hasRolled ? activeGameState!.availableMoves : []}
            />
          </motion.div>
        </motion.div>

        {/* Dice and Controls */}
        <motion.div
          className="w-full xl:w-80 order-3 xl:order-3 flex flex-col items-center justify-start"
          layout
        >
          <AnimatePresence mode="wait">
            {currentPlayer && activeGameState!.gameStatus === 'PLAYING' && (
              <motion.div
                key="dice-roll"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <DiceRoll
                  diceValue={activeGameState!.diceValue}
                  onRoll={handleRollDice}
                  canRoll={!activeGameState!.hasRolled && !activeGameState!.winner}
                  currentPlayerName={PLAYER_SETUP_CONFIG[currentPlayer.id].name}
                />
              </motion.div>
            )}

            {activeGameState!.gameStatus === 'GAMEOVER' && (
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
                    Play Again ({activeGameState!.players.length} Players)
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
