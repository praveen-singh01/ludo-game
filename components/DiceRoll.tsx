import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { getDiceDesignConfig } from '../constants/cosmetics';
import { useUserProfileStore } from '../store/userProfileStore';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { cn } from '../lib/utils';

interface DiceRollProps {
  diceValue: number | null;
  onRoll: () => void;
  canRoll: boolean;
  currentPlayerName: string;
}

const DiceIcon: React.FC<{ value: number; className?: string }> = ({ value, className }) => {
  const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
  const Icon = icons[value - 1] || Dice1;
  return <Icon className={className} />;
};

const DiceFace: React.FC<{ value: number; isRolling?: boolean }> = ({ value, isRolling = false }) => {
  const { profile } = useUserProfileStore();

  // Get equipped dice design
  const equippedDiceDesign = profile?.equippedCosmetics?.diceDesign || 'standard';
  const diceConfig = getDiceDesignConfig(equippedDiceDesign);

  const dotPositions: { [key: number]: number[] } = {
    1: [4], // Center
    2: [0, 8], // Top-left, Bottom-right
    3: [0, 4, 8], // Top-left, Center, Bottom-right
    4: [0, 2, 6, 8], // Four corners
    5: [0, 2, 4, 6, 8], // Four corners + Center
    6: [0, 2, 3, 5, 6, 8], // Two columns
  };

  const dotsToRender = (value > 0 && value <= 6) ? dotPositions[value] : [];

  return (
    <motion.div
      className={cn(
        "w-24 h-24 rounded-2xl p-3 grid grid-cols-3 grid-rows-3 gap-1",
        diceConfig?.backgroundColor || "bg-white",
        diceConfig?.borderColor || "border-gray-800",
        diceConfig?.shadow || "shadow-2xl",
        diceConfig?.animation,
        "border-3",
        isRolling && "animate-dice-roll"
      )}
      animate={isRolling ? {
        rotateX: [0, 360, 720, 1080],
        rotateY: [0, 180, 360, 540],
        scale: [1, 1.1, 1, 1.1, 1]
      } : {}}
      transition={{
        duration: 0.8,
        ease: "easeInOut"
      }}
      style={{
        background: diceConfig?.backgroundColor?.includes('gradient')
          ? undefined
          : 'linear-gradient(145deg, #ffffff, #f0f0f0)',
        boxShadow: isRolling
          ? '0 10px 30px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.8)'
          : diceConfig?.shadow?.includes('shadow')
            ? undefined // Let CSS handle the shadow
            : '0 8px 20px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.8)'
      }}
    >
      <AnimatePresence>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="w-full h-full flex justify-center items-center">
            {dotsToRender.includes(i) && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
                className={cn(
                  "w-3 h-3 rounded-full shadow-inner",
                  diceConfig?.dotColor || "bg-gray-800"
                )}
                style={{
                  background: diceConfig?.dotColor?.includes('text')
                    ? undefined
                    : 'radial-gradient(circle at 30% 30%, #4a4a4a, #1a1a1a)',
                }}
              />
            )}
          </div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};


const DiceRoll: React.FC<DiceRollProps> = ({ diceValue, onRoll, canRoll, currentPlayerName }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const { playSound } = useSoundEffects();

  const handleRoll = async () => {
    if (!canRoll) return;

    setIsRolling(true);
    setShowResult(false);

    // Play dice roll sound sequence
    playSound('dice-roll-sequence');

    // Simulate rolling animation duration
    setTimeout(() => {
      onRoll();
      setIsRolling(false);
      setShowResult(true);
    }, 800);
  };

  useEffect(() => {
    if (diceValue && !isRolling) {
      setShowResult(true);
    }
  }, [diceValue, isRolling]);

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 shadow-2xl border-2">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <DiceIcon value={diceValue || 1} className="w-6 h-6 text-purple-600" />
          {currentPlayerName}'s Turn
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6 p-6">
        <div className="relative">
          <DiceFace value={diceValue || 1} isRolling={isRolling} />

          {/* Result Animation */}
          <AnimatePresence>
            {showResult && diceValue && !isRolling && (
              <motion.div
                initial={{ scale: 0, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-8 left-1/2 transform -translate-x-1/2"
              >
                <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  {diceValue}!
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          whileHover={{ scale: canRoll ? 1.05 : 1 }}
          whileTap={{ scale: canRoll ? 0.95 : 1 }}
          className="w-full"
        >
          <Button
            onClick={handleRoll}
            disabled={!canRoll || isRolling}
            variant={canRoll ? "game" : "secondary"}
            size="lg"
            className="w-full relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {isRolling ? (
                <motion.div
                  key="rolling"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  Rolling...
                </motion.div>
              ) : canRoll ? (
                <motion.div
                  key="roll"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-2"
                >
                  <DiceIcon value={1} className="w-4 h-4" />
                  Roll Dice
                </motion.div>
              ) : (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {diceValue ? `Rolled: ${diceValue}` : 'Waiting...'}
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>

        {/* Dice Value History */}
        {diceValue && !isRolling && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-sm text-gray-600">
              {diceValue === 6 ? "🎉 Six! Roll again!" : `Moved ${diceValue} step${diceValue > 1 ? 's' : ''}`}
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiceRoll;