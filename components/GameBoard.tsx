
import React from 'react';
import { motion } from 'framer-motion';
import { Player, Token, GameState, PlayerColor, TokenState } from '../types';
import TokenIcon from './TokenIcon';
import { cn } from '../lib/utils';
import { getBoardThemeConfig } from '../constants/cosmetics';
import { useUserProfileStore } from '../store/userProfileStore';
import {
    PLAYER_SETUP_CONFIG,
    BOARD_GRID_MAPPING,
    HOME_AREA_GRID_ORIGINS,
    HOME_YARD_TOKEN_SPOTS_RELATIVE,
    HOME_AREA_CLIP_PATHS,
    PLAYER_START_INDICES,
    SAFE_ZONE_INDICES,
    FINISH_LANE_BASE_POSITIONS,
    FINISH_LANE_LENGTH,
    BOARD_DIMENSION_CLASSES,
    PLAYER_PATH_SEGMENTS,

    CENTER_SQUARE_COORD,
    PLAYER_COLORS_LIST,
    // FIX: Import TOKENS_PER_PLAYER
    TOKENS_PER_PLAYER,
} from '../constants';

interface GameBoardProps {
  players: Player[];
  onTokenClick: (tokenId: string) => void;
  availableMoves: GameState['availableMoves'];
}

const GameBoard: React.FC<GameBoardProps> = ({ players, onTokenClick, availableMoves }) => {
  const { profile } = useUserProfileStore();
  const allTokens = players.flatMap(p => p.tokens);

  // Get equipped board theme
  const equippedBoardTheme = profile?.equippedCosmetics?.boardTheme || 'classic';
  const boardThemeConfig = getBoardThemeConfig(equippedBoardTheme);

  const renderTokensInCell = (tokensOnCell: Token[]) => {
    const count = tokensOnCell.length;
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {tokensOnCell.map((token, index) => (
          <motion.div
            key={token.id}
            className="absolute"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            style={{
              zIndex: index + 1,
              transform: count > 1 ? `translateX(${(index - (count -1) / 2) * 4}px) translateY(${(index - (count -1) / 2) * 3}px)` : 'none',
            }}
          >
            <TokenIcon
              token={token}
              onClick={() => onTokenClick(token.id)}
              isPlayable={availableMoves.some(move => move.tokenId === token.id)}
              stackedCount={count}
            />
          </motion.div>
        ))}
      </div>
    );
  };

  const boardCellsRender: JSX.Element[] = [];

  // 1. Render Home Areas (Triangular colored areas) and Home Yard Token Spots
  PLAYER_COLORS_LIST.forEach(playerColor => {
    const playerConfig = PLAYER_SETUP_CONFIG[playerColor];
    const homeOrigin = HOME_AREA_GRID_ORIGINS[playerColor];
    const clipPath = HOME_AREA_CLIP_PATHS[playerColor];
    const player = players.find(p => p.id === playerColor);
    const homeTokens = player ? player.tokens.filter(t => t.state === TokenState.HOME) : [];

    // Render the large triangular home area background
    // This div will span the 6x6 grid cells allocated for the home area
    boardCellsRender.push(
        <div
            key={`home-area-bg-${playerColor}`}
            className={`home-area-triangle ${playerConfig.homeAreaBaseColor} opacity-70`} // Make it slightly transparent to see grid lines if desired
            style={{
                gridColumnStart: homeOrigin.colStart + 1,
                gridColumnEnd: homeOrigin.colStart + 1 + 6,
                gridRowStart: homeOrigin.rowStart + 1,
                gridRowEnd: homeOrigin.rowStart + 1 + 6,
                clipPath: clipPath,
            }}
        />
    );

    // Render the 4 token spots within this home area using relative positioning
    HOME_YARD_TOKEN_SPOTS_RELATIVE.forEach((spotRel, spotIndex) => {
        const [relCol, relRow] = spotRel; // These are relative to the 6x6 home area block
        // FIX: TOKENS_PER_PLAYER was not defined, now imported. This line uses it.
        const tokenInThisSpot = homeTokens.find(t => parseInt(t.id.split('_')[1]) % TOKENS_PER_PLAYER === spotIndex);

        // Calculate absolute grid position for the spot
        const spotAbsCol = homeOrigin.colStart + Math.floor(relCol);
        const spotAbsRow = homeOrigin.rowStart + Math.floor(relRow);

        boardCellsRender.push(
            <motion.div
                key={`home-spot-${playerColor}-${spotIndex}`}
                className={cn(
                    "home-yard-cell flex items-center justify-center",
                    "border-2 border-dashed border-gray-400 rounded-full",
                    boardThemeConfig?.homeColor || "bg-white/60",
                    "backdrop-blur-sm shadow-inner",
                    "hover:bg-white/80 transition-all duration-200"
                )}
                style={{
                    gridColumnStart: spotAbsCol + 1,
                    gridRowStart: spotAbsRow + 1,
                    zIndex: 2,
                    width: 'calc(100% / 15 * 0.9)',
                    height: 'calc(100% / 15 * 0.9)',
                    margin: 'auto',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: spotIndex * 0.1, duration: 0.3 }}
            >
            {tokenInThisSpot && renderTokensInCell([tokenInThisSpot])}
            </motion.div>
        );
    });
  });


  // 2. Render Main Path Cells (0-51)
  for (let i = 0; i <= 51; i++) {
    const coord = BOARD_GRID_MAPPING[i];
    if (!coord) continue;
    const [col, row] = coord;
    const tokensOnCell = allTokens.filter(t => t.position === i && t.state === TokenState.ACTIVE);

    const isStart = Object.values(PLAYER_START_INDICES).includes(i);
    const isSafe = SAFE_ZONE_INDICES.includes(i);
    let cellBgColor = boardThemeConfig?.pathColor || ((i % 2 === 0) ? 'bg-stone-100' : 'bg-stone-200');
    let cellBorderColor = boardThemeConfig?.borderColor || 'border-stone-400';

    let playerPathColor: string | undefined = undefined;
    let playerStartIndicatorColor: string | undefined = undefined;

    PLAYER_COLORS_LIST.forEach(pColor => {
      const startIdx = PLAYER_START_INDICES[pColor];
      const pathSegment = PLAYER_PATH_SEGMENTS[pColor];
      if (i >= pathSegment.start && i <= pathSegment.end) {
          playerPathColor = PLAYER_SETUP_CONFIG[pColor].pathColor;
      }
      if (isStart && i === startIdx) {
         playerPathColor = PLAYER_SETUP_CONFIG[pColor].pathColor;
         playerStartIndicatorColor = PLAYER_SETUP_CONFIG[pColor].startIndicatorColor;
      }
    });

    if (playerPathColor) {
        cellBgColor = playerPathColor;
        cellBorderColor = PLAYER_SETUP_CONFIG[Object.keys(PLAYER_SETUP_CONFIG).find(pc => PLAYER_SETUP_CONFIG[pc as PlayerColor].pathColor === playerPathColor) as PlayerColor].darkColor.replace('bg-','border-');
    }
    if (isSafe && !playerPathColor) {
        cellBgColor = boardThemeConfig?.safeZoneColor || 'bg-amber-200';
        cellBorderColor = boardThemeConfig?.borderColor || 'border-amber-400';
    }


    boardCellsRender.push(
      <motion.div
        key={`path-${i}`}
        className={cn(
          "path-cell border-2 relative overflow-hidden",
          cellBorderColor,
          cellBgColor,
          "shadow-lg hover:shadow-xl transition-all duration-200",
          isSafe && "ring-2 ring-yellow-400 ring-opacity-50",
          isStart && "ring-2 ring-blue-500 ring-opacity-70"
        )}
        style={{
          gridColumnStart: col + 1,
          gridRowStart: row + 1,
          zIndex: 2,
          minHeight: 'calc(100% / 15)',
          minWidth: 'calc(100% / 15)'
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: i * 0.01, duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
      >
        {/* Cell Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-white to-transparent" />
        </div>

        {/* Start Indicator */}
        {isStart && playerStartIndicatorColor && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <span className={`${playerStartIndicatorColor} text-lg font-black drop-shadow-md`}>
              ★
            </span>
          </div>
        )}

        {/* Safe Zone Indicator */}
        {isSafe && !isStart && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <span className="text-yellow-600 text-lg drop-shadow-md animate-pulse">
              ⚡
            </span>
          </div>
        )}

        {/* Tokens */}
        {tokensOnCell.length > 0 && (
          <div className="absolute inset-0 z-10">
            {renderTokensInCell(tokensOnCell)}
          </div>
        )}
      </motion.div>
    );
  }

  // 3. Render Finish Lane Cells
  players.forEach(player => {
    const basePos = FINISH_LANE_BASE_POSITIONS[player.id];
    const playerConfig = PLAYER_SETUP_CONFIG[player.id];
    for (let laneStep = 1; laneStep <= FINISH_LANE_LENGTH; laneStep++) {
      const logicalPos = basePos + laneStep;
      const coord = BOARD_GRID_MAPPING[logicalPos];
      if (!coord) continue;
      const [col, row] = coord;
      const tokensOnCell = allTokens.filter(t => t.position === logicalPos && (t.state === TokenState.ACTIVE || t.state === TokenState.FINISHED));

      const isActualGoalCell = laneStep === FINISH_LANE_LENGTH; // The very last step is part of the central goal
      const cellBgColor = playerConfig.pathColor; // Finish lane consistently colored
      const cellBorderColor = playerConfig.darkColor.replace('bg-','border-');

      boardCellsRender.push(
        <motion.div
          key={`finish-${player.id}-${laneStep}`}
          className={cn(
            "path-cell border-2 relative overflow-hidden",
            cellBorderColor,
            cellBgColor,
            isActualGoalCell ? 'rounded-lg ring-4 ring-yellow-400 ring-opacity-70' : '',
            "shadow-lg hover:shadow-xl transition-all duration-200"
          )}
          style={{
            gridColumnStart: col + 1,
            gridRowStart: row + 1,
            zIndex: isActualGoalCell ? 4 : 3,
            minHeight: 'calc(100% / 15)',
            minWidth: 'calc(100% / 15)'
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: (laneStep + 52) * 0.01, duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          {/* Finish Lane Gradient */}
          <div className="absolute inset-0 opacity-20">
            <div className={`w-full h-full bg-gradient-to-center ${playerConfig.baseColor}`} />
          </div>

          {/* Goal Cell Special Effect */}
          {isActualGoalCell && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="text-yellow-500 text-xl drop-shadow-lg">
                🏆
              </span>
            </motion.div>
          )}

          {/* Tokens */}
          {tokensOnCell.length > 0 && (
            <div className="absolute inset-0 z-10">
              {renderTokensInCell(tokensOnCell)}
            </div>
          )}
        </motion.div>
      );
    }
  });

  // 4. Render Central Goal Area (visual triangles pointing to the center square)
  // This is handled by the finish lane cells and center square below

   // Add a distinct center square if it's not fully covered by finish lane goal cells
   const [centerCol, centerRow] = CENTER_SQUARE_COORD;
   boardCellsRender.push(
    <motion.div
        key="center-target-square"
        className={cn(
          "flex items-center justify-center shadow-2xl border-4 border-yellow-600 rounded-lg relative overflow-hidden",
          boardThemeConfig?.centerColor || "bg-gradient-to-br from-yellow-300 to-yellow-500"
        )}
        style={{
            gridColumnStart: centerCol + 1,
            gridRowStart: centerRow + 1,
            zIndex: 5
        }}
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ duration: 1, delay: 1, ease: "easeOut" }}
    >
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle, rgba(255,215,0,0.8) 0%, rgba(255,193,7,0.6) 100%)',
              'radial-gradient(circle, rgba(255,193,7,0.6) 0%, rgba(255,215,0,0.8) 100%)',
              'radial-gradient(circle, rgba(255,215,0,0.8) 0%, rgba(255,193,7,0.6) 100%)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Center Logo */}
        <motion.div
          className="relative z-10 text-2xl"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          🎯
        </motion.div>

        {/* Player Color Segments */}
        <div className="absolute inset-1 rounded-md overflow-hidden">
          <div className="w-1/2 h-1/2 bg-red-500 opacity-30 absolute top-0 left-0"></div>
          <div className="w-1/2 h-1/2 bg-green-500 opacity-30 absolute top-0 right-0"></div>
          <div className="w-1/2 h-1/2 bg-yellow-400 opacity-30 absolute bottom-0 left-0"></div>
          <div className="w-1/2 h-1/2 bg-blue-500 opacity-30 absolute bottom-0 right-0"></div>
        </div>
    </motion.div>
   );


  return (
    <motion.div
      className={cn(
        "board-frame relative mx-auto my-4",
        BOARD_DIMENSION_CLASSES
      )}
      initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        background: 'linear-gradient(145deg, #8B4513, #A0522D)',
        padding: '12px',
        borderRadius: '16px',
        boxShadow: `
          0 0 0 6px #654321,
          inset 0 0 20px rgba(0,0,0,0.4),
          0 20px 40px rgba(0,0,0,0.3),
          0 0 60px rgba(139, 69, 19, 0.2)
        `
      }}
    >
      {/* Board Inner Glow */}
      <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-yellow-100/20 to-transparent pointer-events-none" />

      <motion.div
        className={cn(
          "ludo-grid-container w-full h-full grid grid-cols-15 grid-rows-15 gap-0.5 rounded-xl overflow-hidden relative",
          boardThemeConfig?.backgroundColor || "bg-gradient-to-br from-amber-100 to-amber-200"
        )}
        style={{
          background: boardThemeConfig?.backgroundColor?.includes('gradient')
            ? undefined
            : 'linear-gradient(145deg, #deb887, #d2b48c)',
          border: `3px solid ${boardThemeConfig?.borderColor?.replace('border-', '') || '#8B4513'}`,
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {boardCellsRender}

        {/* Board Overlay Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(139, 69, 19, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(160, 82, 45, 0.3) 0%, transparent 50%)
            `
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default GameBoard;