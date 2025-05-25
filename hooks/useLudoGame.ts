
import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Player, PlayerColor, Token, TokenState } from '../types';
import {
  PLAYER_COLORS_LIST,
  TOKENS_PER_PLAYER,
  HOME_YARD_POSITION,
  FINISHED_POSITION,
  MAIN_PATH_LENGTH,
  FINISH_LANE_LENGTH,
  PLAYER_START_INDICES,
  FINISH_LANE_ENTRY_PREDECESSORS,
  FINISH_LANE_BASE_POSITIONS,
  SAFE_ZONE_INDICES,
  DICE_MAX,
} from '../constants';
import { useAI, AIDifficulty } from './useAI';
import { useBattlePassStore } from '../store/battlePassStore';
import { useUserProfileStore } from '../store/userProfileStore';

const createInitialTokens = (color: PlayerColor): Token[] => {
  return Array.from({ length: TOKENS_PER_PLAYER }, (_, i) => ({
    id: `${color}_${i}`,
    color,
    position: HOME_YARD_POSITION,
    state: TokenState.HOME,
  }));
};

export const useLudoGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentPlayerIndex: 0,
    diceValue: null,
    hasRolled: false,
    winner: null,
    gameStatus: 'SETUP',
    message: 'Select number of players to start.',
    availableMoves: [],
  });

  const { selectBestMove } = useAI();
  const { addExperience } = useBattlePassStore();
  const { addCoins } = useUserProfileStore();
  const aiTimeoutRef = useRef<NodeJS.Timeout>();

  const initializeGame = useCallback((
    numPlayers: number,
    aiPlayers: { playerIndex: number; difficulty: AIDifficulty }[] = []
  ) => {
    if (numPlayers < 2 || numPlayers > 4) {
      setGameState(prev => ({ ...prev, message: "Number of players must be between 2 and 4."}));
      return;
    }

    const players: Player[] = PLAYER_COLORS_LIST.slice(0, numPlayers).map((color, index) => {
      const aiConfig = aiPlayers.find(ai => ai.playerIndex === index);
      const isAI = !!aiConfig;
      const difficulty = aiConfig?.difficulty || 'medium';

      return {
        id: color,
        name: isAI
          ? `AI ${color.charAt(0) + color.slice(1).toLowerCase()} (${difficulty})`
          : color.charAt(0) + color.slice(1).toLowerCase(),
        tokens: createInitialTokens(color),
        isAI,
        aiDifficulty: isAI ? difficulty : undefined,
      };
    });

    setGameState({
      players,
      currentPlayerIndex: 0,
      diceValue: null,
      hasRolled: false,
      winner: null,
      gameStatus: 'PLAYING',
      message: `${players[0].name}'s turn. Roll the dice.`,
      availableMoves: [],
    });
  }, []);

  const getCurrentPlayer = useCallback(() => {
    if (gameState.players.length === 0) return null;
    return gameState.players[gameState.currentPlayerIndex];
  }, [gameState.players, gameState.currentPlayerIndex]);

  const calculatePathPosition = useCallback((token: Token, steps: number): number => {
    // const playerStart = PLAYER_START_INDICES[token.color];
    const finishEntryPred = FINISH_LANE_ENTRY_PREDECESSORS[token.color];
    const finishBase = FINISH_LANE_BASE_POSITIONS[token.color];

    let currentPathPos = token.position;

    let newPos = currentPathPos;

    for (let i = 0; i < steps; i++) {
      // Are we currently in this token's finish lane (but not the final goal square yet)?
      if (newPos >= finishBase + 1 && newPos < finishBase + FINISH_LANE_LENGTH) {
        newPos++;
      } else if (newPos === finishEntryPred) { // Is token at the square just before its finish lane?
        newPos = finishBase + 1; // Move to first step of finish lane
      } else { // On main path
        newPos = (newPos + 1) % MAIN_PATH_LENGTH;
      }
    }

    // Check for overshooting the finish lane (e.g. needs 3 to finish, rolls 4)
    if (newPos > finishBase + FINISH_LANE_LENGTH) {
        return -1; // Invalid move (overshot)
    }
    return newPos;
  }, []);

  const findAvailableMoves = useCallback((player: Player, dice: number) => {
    const moves: { tokenId: string; newPosition: number }[] = [];
    player.tokens.forEach(token => {
      if (token.state === TokenState.FINISHED) return;

      if (token.state === TokenState.HOME && dice === DICE_MAX) {
        const startPos = PLAYER_START_INDICES[token.color];
        // Check if start position is blocked by own token
        // const tokenAtStart = player.tokens.find(t => t.position === startPos && t.state === TokenState.ACTIVE);
        // For Ludo, you can't have two of your own tokens on the same non-safe start square if it's not a safe zone in general, but typically start squares are safe.
        // Simplified: allow move out if start square isn't blocked by two of own tokens (stacking usually not allowed or handled differently)
        // Here we assume if start square is occupied by another of current player's tokens, it may be an issue unless it's a "blob" or specific rule.
        // For simplicity, let's check if any of *our* tokens is already there. A common rule is you can't land on your own token unless it forms a block.
        // We'll allow the move out, and if it lands on an opponent, that's handled later. If it lands on own token, that's usually not allowed or needs specific rule.
        // For this version, we'll assume the start square can be occupied.
        moves.push({ tokenId: token.id, newPosition: startPos });
      } else if (token.state === TokenState.ACTIVE) {
        const newPos = calculatePathPosition(token, dice);
        if (newPos !== -1) { // -1 indicates invalid move like overshooting finish
            const finishBase = FINISH_LANE_BASE_POSITIONS[token.color];
            if (newPos > finishBase + FINISH_LANE_LENGTH) {
                // Overshot, this token cannot make this move. (This check is also in calculatePathPosition)
            } else {
                 moves.push({ tokenId: token.id, newPosition: newPos });
            }
        }
      }
    });
    return moves;
  }, [calculatePathPosition]);




  const nextTurn = useCallback((playerWhoMoved: Player | null, gainedExtraTurn: boolean) => {
    if (!playerWhoMoved && !gainedExtraTurn) { // Case where turn passes due to no moves.
        const currentPlayer = getCurrentPlayer();
        if(!currentPlayer) return; // Should not happen in normal flow
        playerWhoMoved = currentPlayer;
    } else if (!playerWhoMoved && gainedExtraTurn) { // Should not happen. Gained extra turn implies a player moved.
        const currentPlayer = getCurrentPlayer();
         if(!currentPlayer) return;
        playerWhoMoved = currentPlayer; // Assume current player gets extra turn
    }

    if (playerWhoMoved && playerWhoMoved.tokens.every(t => t.state === TokenState.FINISHED)) {
      setGameState(prev => ({
        ...prev,
        winner: playerWhoMoved.id,
        gameStatus: 'GAMEOVER',
        message: `${playerWhoMoved.name} wins!`,
      }));
      return;
    }

    let nextPlayerIndex = gameState.currentPlayerIndex;
    if (!gainedExtraTurn) {
      nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    }

    const nextPlayer = gameState.players[nextPlayerIndex];
    setGameState(prev => ({
      ...prev,
      currentPlayerIndex: nextPlayerIndex,
      diceValue: null,
      hasRolled: false,
      availableMoves: [],
      message: `${nextPlayer.name}'s turn. Roll the dice.`,
    }));
  }, [gameState.currentPlayerIndex, gameState.players, getCurrentPlayer]);


  const rollDice = useCallback(() => {
    if (gameState.gameStatus !== 'PLAYING' || gameState.hasRolled || gameState.winner) return;

    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer) return;

    const roll = Math.floor(Math.random() * DICE_MAX) + 1;
    const moves = findAvailableMoves(currentPlayer, roll);

    setGameState(prev => ({
      ...prev,
      diceValue: roll,
      hasRolled: true,
      availableMoves: moves,
      message: moves.length > 0
                 ? `${currentPlayer.name} rolled a ${roll}. Select a token to move.`
                 : `${currentPlayer.name} rolled a ${roll}. No moves available. ${roll === DICE_MAX ? 'Roll again.' : 'Turn passes.'}`,
    }));

    // If no moves are available
    if (moves.length === 0) {
      if (roll !== DICE_MAX) { // Not a 6, turn passes
        setTimeout(() => {
            nextTurn(currentPlayer, false);
        }, 1500);
      } else { // Rolled a 6 but no moves (e.g., all tokens blocked in by other tokens on start or path)
        // Player gets to roll again
        setTimeout(() => {
             setGameState(prev => ({
                ...prev,
                hasRolled: false, // Allow another roll
                diceValue: null, // Reset dice for next roll visual
                availableMoves: [],
                message: `${currentPlayer.name} rolled a 6 but has no valid moves. Roll again.`,
            }));
        }, 1500);
      }
    }
  }, [gameState.gameStatus, gameState.hasRolled, gameState.winner, getCurrentPlayer, findAvailableMoves, nextTurn]);


  const moveToken = useCallback((tokenId: string) => {
    if (gameState.gameStatus !== 'PLAYING' || !gameState.hasRolled || !gameState.diceValue || gameState.winner) return;

    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer) return;

    const move = gameState.availableMoves.find(m => m.tokenId === tokenId);
    if (!move) {
      setGameState(prev => ({ ...prev, message: "Invalid move. Select a highlighted token." }));
      return;
    }

    let newPlayersState = gameState.players.map(p => ({
        ...p,
        tokens: p.tokens.map(t => {
            if (t.id === tokenId) {
                const isReachingGoal = move.newPosition === FINISH_LANE_BASE_POSITIONS[t.color] + FINISH_LANE_LENGTH;

                // const newState = isReachingGoal ? TokenState.FINISHED : TokenState.ACTIVE;
                // If it's now HOME state (was HOME and moved to start), new state is ACTIVE
                // If it was ACTIVE and moved, it's still ACTIVE unless it reached goal
                const currentTokenState = t.state;
                let nextState = TokenState.ACTIVE; // Default for any move from HOME or ACTIVE
                if (isReachingGoal) {
                    nextState = TokenState.FINISHED;
                } else if (currentTokenState === TokenState.HOME && move.newPosition === PLAYER_START_INDICES[t.color]) {
                    nextState = TokenState.ACTIVE; // Moving out of home
                }


                const finalPosition = nextState === TokenState.FINISHED ? FINISHED_POSITION : move.newPosition;
                return { ...t, position: finalPosition, state: nextState };
            }
            return t;
        })
    }));

    let landedOnOpponent = false;
    const movedTokenDetails = newPlayersState[gameState.currentPlayerIndex].tokens.find(t => t.id === tokenId)!;

    // Check for captures only if the token is active and not in a safe zone or its own finish lane
    if (movedTokenDetails.state === TokenState.ACTIVE &&
        !SAFE_ZONE_INDICES.includes(movedTokenDetails.position) &&
        !(movedTokenDetails.position >= FINISH_LANE_BASE_POSITIONS[movedTokenDetails.color] + 1 && movedTokenDetails.position <= FINISH_LANE_BASE_POSITIONS[movedTokenDetails.color] + FINISH_LANE_LENGTH)
       ) {
        newPlayersState = newPlayersState.map((player, pIndex) => {
            if (pIndex === gameState.currentPlayerIndex) return player; // Don't capture own tokens
            return {
                ...player,
                tokens: player.tokens.map(opponentToken => {
                    // Opponent token must be on the same square and be active (not in their home)
                    if (opponentToken.position === movedTokenDetails.position && opponentToken.state === TokenState.ACTIVE) {
                        landedOnOpponent = true;
                        return { ...opponentToken, position: HOME_YARD_POSITION, state: TokenState.HOME };
                    }
                    return opponentToken;
                })
            };
        });
    }

    const playerAfterMove = newPlayersState[gameState.currentPlayerIndex];
    const tokenThatMoved = playerAfterMove.tokens.find(t=>t.id === tokenId);
    // Gained extra turn if: rolled a 6, OR landed on an opponent, OR token reached goal.
    const gainedExtraTurn = gameState.diceValue === DICE_MAX || landedOnOpponent || (tokenThatMoved && tokenThatMoved.state === TokenState.FINISHED);

    setGameState(prev => ({
      ...prev,
      players: newPlayersState,
      // message will be set by nextTurn or if game ends
    }));

    // Check for winner immediately after state update from move
    const allTokensFinished = playerAfterMove.tokens.every(t => t.state === TokenState.FINISHED);
    if (allTokensFinished) {
      // Award rewards for game completion
      // const isWinner = true;
      const hasAIOpponents = newPlayersState.some(p => p.isAI && p.id !== playerAfterMove.id);

      // Calculate rewards based on game type and performance
      let coinReward = 50; // Base reward
      let experienceReward = 25; // Base experience

      if (hasAIOpponents) {
        // Bonus for playing against AI
        const aiDifficulties = newPlayersState
          .filter(p => p.isAI)
          .map(p => (p as any).aiDifficulty || 'medium');

        const difficultyMultiplier = aiDifficulties.reduce((mult, diff) => {
          return mult + (diff === 'hard' ? 1.5 : diff === 'medium' ? 1.2 : 1.0);
        }, 0) / aiDifficulties.length;

        coinReward = Math.floor(coinReward * difficultyMultiplier);
        experienceReward = Math.floor(experienceReward * difficultyMultiplier);
      }

      // Bonus for perfect game (no tokens captured)
      const tokensLost = playerAfterMove.tokens.filter(_t =>
        // This is a simplified check - in a real implementation you'd track captures
        false // For now, no perfect game detection
      ).length;

      if (tokensLost === 0) {
        coinReward += 25;
        experienceReward += 15;
      }

      // Award rewards only to human players
      if (!playerAfterMove.isAI) {
        addCoins(coinReward, 'GAME_WIN', `Won game against ${newPlayersState.length - 1} opponents`);
        addExperience(experienceReward, 'GAME_COMPLETION');
      }

      setGameState(prev => ({
        ...prev,
        players: newPlayersState, // ensure players state is the latest
        winner: playerAfterMove.id,
        gameStatus: 'GAMEOVER',
        message: `${playerAfterMove.name} wins!${!playerAfterMove.isAI ? ` +${coinReward} coins, +${experienceReward} XP` : ''}`,
        hasRolled: false, // Prevent further actions
        availableMoves: [],
      }));
      return; // Stop further processing like nextTurn
    }

    // If no win, proceed to next turn logic
    setTimeout(() => nextTurn(playerAfterMove, gainedExtraTurn || false), 200); // Slight delay for UI

  }, [gameState, getCurrentPlayer, nextTurn]);

  const handleAITurn = useCallback(() => {
    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer?.isAI || gameState.gameStatus !== 'PLAYING') return;

    // Clear any existing AI timeout
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
    }

    const difficulty = (currentPlayer as any).aiDifficulty || 'medium';
    const delay = difficulty === 'easy' ? 2000 : difficulty === 'medium' ? 1500 : 1000;

    if (!gameState.hasRolled) {
      // AI needs to roll dice
      aiTimeoutRef.current = setTimeout(() => {
        rollDice();
      }, delay + Math.random() * 500); // Add some randomness
    } else if (gameState.availableMoves.length > 0) {
      // AI needs to make a move
      const bestMove = selectBestMove(
        gameState.availableMoves,
        gameState.players,
        currentPlayer,
        difficulty
      );

      if (bestMove) {
        aiTimeoutRef.current = setTimeout(() => {
          moveToken(bestMove.tokenId);
        }, delay + Math.random() * 500);
      }
    }
  }, [gameState, getCurrentPlayer, selectBestMove, rollDice, moveToken]);

  // Handle AI turns
  useEffect(() => {
    const currentPlayer = getCurrentPlayer();
    if (currentPlayer?.isAI && gameState.gameStatus === 'PLAYING') {
      handleAITurn();
    }
  }, [gameState.currentPlayerIndex, gameState.hasRolled, gameState.availableMoves, handleAITurn, getCurrentPlayer]);

  // Cleanup AI timeouts on unmount
  useEffect(() => {
    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
      }
    };
  }, []);

  return {
    gameState,
    initializeGame,
    rollDice,
    moveToken,
    getCurrentPlayer,
    handleAITurn,
  };
};
