import React from 'react';
import { motion } from 'framer-motion';
import { Token, TokenState } from '../types';
import { PLAYER_SETUP_CONFIG, TOKEN_SIZE_CLASSES } from '../constants';
import { getTokenSkinConfig } from '../constants/cosmetics';
import { useUserProfileStore } from '../store/userProfileStore';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { cn } from '../lib/utils';

interface TokenIconProps {
  token: Token;
  onClick?: () => void;
  isPlayable?: boolean;
  stackedCount?: number;
  sizeClass?: string;
}

const TokenIcon: React.FC<TokenIconProps> = ({ token, onClick, isPlayable, stackedCount = 1, sizeClass }) => {
  const config = PLAYER_SETUP_CONFIG[token.color];
  const { profile } = useUserProfileStore();
  const { playSound } = useSoundEffects();

  // Get equipped token skin
  const equippedTokenSkin = profile?.equippedCosmetics?.tokenSkin || 'default';
  const tokenSkinConfig = getTokenSkinConfig(equippedTokenSkin);

  let currentSizeClass = TOKEN_SIZE_CLASSES.default;
  if (sizeClass) {
    currentSizeClass = sizeClass;
  } else if (token.state === TokenState.HOME) {
    currentSizeClass = TOKEN_SIZE_CLASSES.home;
  } else if (stackedCount > 1) {
    currentSizeClass = TOKEN_SIZE_CLASSES.stacked;
  }

  const handleClick = () => {
    if (onClick && isPlayable) {
      playSound('button-click');
      onClick();
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={!onClick || !isPlayable}
      className={cn(
        "relative flex items-center justify-center group",
        currentSizeClass,
        (!onClick || !isPlayable) ? 'cursor-not-allowed' : 'cursor-pointer'
      )}
      style={{ zIndex: isPlayable ? 10 : 5 }}
      whileHover={onClick && isPlayable ? { scale: 1.15 } : {}}
      whileTap={onClick && isPlayable ? { scale: 0.95 } : {}}
      animate={isPlayable ? {
        boxShadow: [
          '0 0 0 0 rgba(147, 51, 234, 0)',
          '0 0 0 8px rgba(147, 51, 234, 0.3)',
          '0 0 0 0 rgba(147, 51, 234, 0)'
        ]
      } : {}}
      transition={{
        duration: 1.5,
        repeat: isPlayable ? Infinity : 0,
        ease: "easeInOut"
      }}
      aria-label={`${token.color} token ${token.id}`}
    >
      {/* Token Base with 3D Effect and Cosmetic Styling */}
      <div
        className={cn(
          "w-full h-full relative overflow-hidden",
          tokenSkinConfig?.baseStyle || "rounded-full border-2 border-gray-800 shadow-lg",
          tokenSkinConfig?.gradient || config.baseColor,
          tokenSkinConfig?.glowEffect,
          tokenSkinConfig?.animation
        )}
        style={{
          background: tokenSkinConfig?.gradient
            ? undefined
            : `radial-gradient(circle at 30% 30%, ${config.rawBaseColor}dd, ${config.rawBaseColor}88, ${config.rawBaseColor})`,
          boxShadow: isPlayable
            ? `0 4px 12px rgba(0,0,0,0.3), 0 0 0 3px rgba(147, 51, 234, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)`
            : tokenSkinConfig?.glowEffect
              ? undefined // Let CSS handle the glow
              : `0 3px 8px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.3)`
        }}
      >
        {/* Inner Highlight */}
        <div
          className="absolute top-1 left-1 w-1/3 h-1/3 rounded-full bg-white/40"
          style={{ filter: 'blur(1px)' }}
        />

        {/* Token Number/ID */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-xs drop-shadow-md">
            {token.id.split('_')[1]}
          </span>
        </div>

        {/* Special Effects for Premium Skins */}
        {equippedTokenSkin === 'crystal_tokens' && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        )}

        {equippedTokenSkin === 'golden_tokens' && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 opacity-20"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {equippedTokenSkin === 'neon_tokens' && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              background: [
                'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(236, 72, 153, 0) 70%)',
                'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(168, 85, 247, 0) 70%)',
                'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0) 70%)',
                'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(236, 72, 153, 0) 70%)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Playable Glow Effect */}
        {isPlayable && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              background: [
                'radial-gradient(circle, rgba(147, 51, 234, 0) 0%, rgba(147, 51, 234, 0) 100%)',
                'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, rgba(147, 51, 234, 0) 70%)',
                'radial-gradient(circle, rgba(147, 51, 234, 0) 0%, rgba(147, 51, 234, 0) 100%)'
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>

      {/* Stack Indicator */}
      {stackedCount > 1 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-md">
          {stackedCount}
        </div>
      )}
    </motion.button>
  );
};

export default TokenIcon;