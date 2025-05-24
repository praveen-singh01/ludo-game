import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Users, 
  Wifi, 
  WifiOff, 
  Loader2, 
  AlertCircle,
  Gamepad2,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { useMultiplayerStore } from '../../store/multiplayerStore';

interface MultiplayerSetupProps {
  onBackToSinglePlayer: () => void;
}

const MultiplayerSetup: React.FC<MultiplayerSetupProps> = ({ onBackToSinglePlayer }) => {
  const {
    connected,
    connecting,
    connectionError,
    connect,
    createRoom,
    joinRoom,
    playerName,
    setPlayerName,
    clearError
  } = useMultiplayerStore();

  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
  const [roomId, setRoomId] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [isPrivate, setIsPrivate] = useState(false);
  const [localPlayerName, setLocalPlayerName] = useState(playerName || '');

  useEffect(() => {
    // Auto-connect when component mounts
    if (!connected && !connecting) {
      connect();
    }
  }, [connected, connecting, connect]);

  useEffect(() => {
    // Clear errors after 5 seconds
    if (connectionError) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [connectionError, clearError]);

  const handleCreateRoom = () => {
    if (!localPlayerName.trim()) return;
    
    setPlayerName(localPlayerName.trim());
    createRoom(localPlayerName.trim(), maxPlayers, isPrivate);
  };

  const handleJoinRoom = () => {
    if (!localPlayerName.trim() || !roomId.trim()) return;
    
    setPlayerName(localPlayerName.trim());
    joinRoom(roomId.trim().toUpperCase(), localPlayerName.trim());
  };

  const ConnectionStatus = () => (
    <div className="flex items-center gap-2 text-sm">
      {connecting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          <span className="text-blue-600">Connecting to server...</span>
        </>
      ) : connected ? (
        <>
          <Wifi className="w-4 h-4 text-green-500" />
          <span className="text-green-600">Connected to multiplayer server</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-red-500" />
          <span className="text-red-600">Disconnected from server</span>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-5xl font-bold text-white mb-4 drop-shadow-lg"
          >
            🌐 Multiplayer Ludo
          </motion.h1>
          <p className="text-xl text-white/80">Play with friends online in real-time</p>
        </div>

        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardContent className="p-4">
              <ConnectionStatus />
            </CardContent>
          </Card>
        </motion.div>

        {/* Error Alert */}
        {connectionError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{connectionError}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-6 h-6 text-purple-600" />
                {mode === 'menu' && 'Multiplayer Options'}
                {mode === 'create' && 'Create Game Room'}
                {mode === 'join' && 'Join Game Room'}
              </CardTitle>
              <CardDescription>
                {mode === 'menu' && 'Choose how you want to play with others'}
                {mode === 'create' && 'Set up a new game room for your friends'}
                {mode === 'join' && 'Enter a room ID to join an existing game'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {mode === 'menu' && (
                <div className="space-y-4">
                  {/* Player Name Input */}
                  <div className="space-y-2">
                    <Label htmlFor="playerName">Your Name</Label>
                    <Input
                      id="playerName"
                      value={localPlayerName}
                      onChange={(e) => setLocalPlayerName(e.target.value)}
                      placeholder="Enter your name"
                      maxLength={20}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={() => setMode('create')}
                      disabled={!connected || !localPlayerName.trim()}
                      variant="game"
                      className="h-20 flex-col gap-2"
                    >
                      <Plus className="w-6 h-6" />
                      <div>
                        <div className="font-semibold">Create Room</div>
                        <div className="text-xs opacity-80">Start a new game</div>
                      </div>
                    </Button>

                    <Button
                      onClick={() => setMode('join')}
                      disabled={!connected || !localPlayerName.trim()}
                      variant="outline"
                      className="h-20 flex-col gap-2"
                    >
                      <Users className="w-6 h-6" />
                      <div>
                        <div className="font-semibold">Join Room</div>
                        <div className="text-xs opacity-80">Enter room ID</div>
                      </div>
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      onClick={onBackToSinglePlayer}
                      variant="ghost"
                      className="w-full"
                    >
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      Back to Single Player
                    </Button>
                  </div>
                </div>
              )}

              {mode === 'create' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxPlayers">Maximum Players</Label>
                    <select
                      id="maxPlayers"
                      value={maxPlayers}
                      onChange={(e) => setMaxPlayers(Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value={2}>2 Players</option>
                      <option value={3}>3 Players</option>
                      <option value={4}>4 Players</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPrivate"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="isPrivate">Private Room</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleCreateRoom}
                      disabled={!connected || !localPlayerName.trim()}
                      variant="game"
                      className="flex-1"
                    >
                      Create Room
                    </Button>
                    <Button
                      onClick={() => setMode('menu')}
                      variant="outline"
                    >
                      Back
                    </Button>
                  </div>
                </div>
              )}

              {mode === 'join' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomId">Room ID</Label>
                    <Input
                      id="roomId"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                      placeholder="Enter 8-character room ID"
                      maxLength={8}
                      className="font-mono text-lg"
                    />
                    <p className="text-xs text-gray-500">
                      Ask your friend for the room ID they received when creating the game
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleJoinRoom}
                      disabled={!connected || !localPlayerName.trim() || !roomId.trim()}
                      variant="game"
                      className="flex-1"
                    >
                      Join Room
                    </Button>
                    <Button
                      onClick={() => setMode('menu')}
                      variant="outline"
                    >
                      Back
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-sm text-gray-600 space-y-2">
                <p className="font-semibold">How it works:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Create a room and share the room ID with friends</li>
                  <li>• Or join an existing room using a room ID</li>
                  <li>• All players must be ready before starting</li>
                  <li>• Game state is synchronized in real-time</li>
                  <li>• Players can reconnect if disconnected</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MultiplayerSetup;
