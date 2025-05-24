import { useCallback } from 'react';
import { Player, Token } from '../types';
import {
  PLAYER_START_INDICES,
  SAFE_ZONE_INDICES,
  FINISH_LANE_BASE_POSITIONS,
  FINISH_LANE_LENGTH,
  HOME_YARD_POSITION
} from '../constants';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

interface AIMove {
  tokenId: string;
  newPosition: number;
  priority: number;
  reasoning: string;
}

export const useAI = () => {
  const calculateTokenSafety = useCallback((token: Token, newPosition: number): number => {
    // Higher score = safer position
    if (newPosition === HOME_YARD_POSITION) return 0; // Home is neutral
    if (SAFE_ZONE_INDICES.includes(newPosition)) return 10; // Safe zones are very safe

    const finishBase = FINISH_LANE_BASE_POSITIONS[token.color];
    if (newPosition >= finishBase + 1 && newPosition <= finishBase + FINISH_LANE_LENGTH) {
      return 8; // Finish lane is safe
    }

    return 3; // Regular path positions have some risk
  }, []);

  const calculateProgress = useCallback((token: Token, newPosition: number): number => {
    // Higher score = more progress toward goal
    if (newPosition === HOME_YARD_POSITION) return 0;
    if (newPosition === FINISHED_POSITION) return 100;

    const finishBase = FINISH_LANE_BASE_POSITIONS[token.color];
    if (newPosition >= finishBase + 1) {
      // In finish lane - very high progress
      return 80 + (newPosition - finishBase) * 4;
    }

    // On main path - calculate distance to finish lane entry
    const entryPoint = (finishBase - 100) % 52; // Convert back to main path position
    let distance = 0;

    if (newPosition <= entryPoint) {
      distance = entryPoint - newPosition;
    } else {
      distance = (52 - newPosition) + entryPoint;
    }

    return Math.max(0, 50 - distance);
  }, []);

  const canCaptureOpponent = useCallback((
    players: Player[],
    currentPlayer: Player,
    newPosition: number
  ): { canCapture: boolean; capturedTokens: Token[] } => {
    const capturedTokens: Token[] = [];

    for (const player of players) {
      if (player.id === currentPlayer.id) continue;

      for (const token of player.tokens) {
        if (token.position === newPosition &&
            token.state === 'ACTIVE' &&
            !SAFE_ZONE_INDICES.includes(newPosition)) {
          capturedTokens.push(token);
        }
      }
    }

    return { canCapture: capturedTokens.length > 0, capturedTokens };
  }, []);

  const evaluateMove = useCallback((
    token: Token,
    newPosition: number,
    players: Player[],
    currentPlayer: Player,
    difficulty: AIDifficulty
  ): AIMove => {
    let priority = 0;
    let reasoning = '';

    // Base progress score
    const progressScore = calculateProgress(token, newPosition);
    priority += progressScore * 0.4;

    // Safety score
    const safetyScore = calculateTokenSafety(token, newPosition);
    priority += safetyScore * 0.2;

    // Capture opportunity
    const { canCapture, capturedTokens } = canCaptureOpponent(players, currentPlayer, newPosition);
    if (canCapture) {
      priority += 25 * capturedTokens.length;
      reasoning += `Capture ${capturedTokens.length} opponent token(s). `;
    }

    // Getting out of home
    if (token.state === 'HOME' && newPosition === PLAYER_START_INDICES[token.color]) {
      priority += 15;
      reasoning += 'Move token out of home. ';
    }

    // Reaching finish
    const finishBase = FINISH_LANE_BASE_POSITIONS[token.color];
    if (newPosition === finishBase + FINISH_LANE_LENGTH) {
      priority += 50;
      reasoning += 'Finish token! ';
    }

    // Difficulty adjustments
    switch (difficulty) {
      case 'easy':
        // Easy AI makes more random decisions
        priority += Math.random() * 20 - 10;
        break;
      case 'medium':
        // Medium AI balances strategy with some randomness
        priority += Math.random() * 10 - 5;
        break;
      case 'hard':
        // Hard AI is more strategic
        // Bonus for blocking opponents (advanced strategy)
        const blockingBonus = calculateBlockingPotential(token, newPosition, players, currentPlayer);
        priority += blockingBonus;
        break;
    }

    if (!reasoning) reasoning = 'Standard move.';

    return {
      tokenId: token.id,
      newPosition,
      priority,
      reasoning: reasoning.trim()
    };
  }, [calculateProgress, calculateTokenSafety, canCaptureOpponent]);

  const calculateBlockingPotential = useCallback((
    _token: Token,
    newPosition: number,
    players: Player[],
    currentPlayer: Player
  ): number => {
    // Advanced strategy: block opponent progress
    let blockingScore = 0;

    for (const player of players) {
      if (player.id === currentPlayer.id) continue;

      for (const opponentToken of player.tokens) {
        if (opponentToken.state === 'ACTIVE') {
          // Check if this move would block the opponent's likely next moves
          for (let steps = 1; steps <= 6; steps++) {
            const opponentNextPos = calculateNextPosition(opponentToken, steps);
            if (opponentNextPos === newPosition && !SAFE_ZONE_INDICES.includes(newPosition)) {
              blockingScore += 5;
            }
          }
        }
      }
    }

    return blockingScore;
  }, []);

  const calculateNextPosition = useCallback((token: Token, steps: number): number => {
    // Simplified version of position calculation for AI analysis
    let currentPos = token.position;
    const finishBase = FINISH_LANE_BASE_POSITIONS[token.color];

    for (let i = 0; i < steps; i++) {
      if (currentPos >= finishBase + 1 && currentPos < finishBase + FINISH_LANE_LENGTH) {
        currentPos++;
      } else if (currentPos === (finishBase - 100) % 52) {
        currentPos = finishBase + 1;
      } else {
        currentPos = (currentPos + 1) % 52;
      }
    }

    return currentPos;
  }, []);

  const selectBestMove = useCallback((
    availableMoves: { tokenId: string; newPosition: number }[],
    players: Player[],
    currentPlayer: Player,
    difficulty: AIDifficulty = 'medium'
  ): { tokenId: string; newPosition: number } | null => {
    if (availableMoves.length === 0) return null;

    const evaluatedMoves: AIMove[] = availableMoves.map(move => {
      const token = currentPlayer.tokens.find(t => t.id === move.tokenId)!;
      return evaluateMove(token, move.newPosition, players, currentPlayer, difficulty);
    });

    // Sort by priority (highest first)
    evaluatedMoves.sort((a, b) => b.priority - a.priority);

    // Add some randomness even for the best moves to make AI less predictable
    const topMoves = evaluatedMoves.slice(0, Math.min(3, evaluatedMoves.length));
    const selectedMove = topMoves[Math.floor(Math.random() * topMoves.length)];

    console.log(`AI (${difficulty}) selected move:`, {
      tokenId: selectedMove.tokenId,
      priority: selectedMove.priority.toFixed(1),
      reasoning: selectedMove.reasoning
    });

    return {
      tokenId: selectedMove.tokenId,
      newPosition: selectedMove.newPosition
    };
  }, [evaluateMove]);

  return {
    selectBestMove,
    evaluateMove
  };
};

const FINISHED_POSITION = 999; // Import this from constants if available
