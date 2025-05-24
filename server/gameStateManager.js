import { v4 as uuidv4 } from 'uuid';

export class GameStateManager {
  constructor() {
    this.games = new Map();
    this.TOKENS_PER_PLAYER = 4;
    this.HOME_YARD_POSITION = -1;
    this.FINISHED_POSITION = 999;
    this.MAIN_PATH_LENGTH = 52;
    this.FINISH_LANE_LENGTH = 6;
    this.DICE_MAX = 6;
    
    this.PLAYER_START_INDICES = {
      'RED': 1,
      'GREEN': 14,
      'YELLOW': 27,
      'BLUE': 40
    };
    
    this.FINISH_LANE_ENTRY_PREDECESSORS = {
      'RED': 51,
      'GREEN': 12,
      'YELLOW': 25,
      'BLUE': 38
    };
    
    this.FINISH_LANE_BASE_POSITIONS = {
      'RED': 100,
      'GREEN': 200,
      'YELLOW': 300,
      'BLUE': 400
    };
    
    this.SAFE_ZONE_INDICES = [1, 9, 14, 22, 27, 35, 40, 48];
  }

  initializeGame(roomId, room) {
    if (this.games.has(roomId)) {
      throw new Error('Game already exists for this room');
    }

    if (room.players.length < 2) {
      throw new Error('Need at least 2 players to start');
    }

    const players = room.players.map(roomPlayer => ({
      id: roomPlayer.color,
      name: roomPlayer.name,
      playerId: roomPlayer.id,
      tokens: this.createInitialTokens(roomPlayer.color),
      isAI: false
    }));

    const gameState = {
      roomId,
      players,
      currentPlayerIndex: 0,
      diceValue: null,
      hasRolled: false,
      winner: null,
      gameStatus: 'PLAYING',
      message: `${players[0].name}'s turn. Roll the dice.`,
      availableMoves: [],
      turnStartTime: new Date().toISOString(),
      gameStartTime: new Date().toISOString()
    };

    this.games.set(roomId, gameState);
    return gameState;
  }

  createInitialTokens(color) {
    return Array.from({ length: this.TOKENS_PER_PLAYER }, (_, i) => ({
      id: `${color}_${i}`,
      color,
      position: this.HOME_YARD_POSITION,
      state: 'HOME'
    }));
  }

  getGameState(roomId) {
    return this.games.get(roomId);
  }

  rollDice(roomId, playerId) {
    const gameState = this.getGameState(roomId);
    if (!gameState) {
      throw new Error('Game not found');
    }

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.playerId !== playerId) {
      throw new Error('Not your turn');
    }

    if (gameState.hasRolled) {
      throw new Error('Already rolled this turn');
    }

    const diceValue = Math.floor(Math.random() * this.DICE_MAX) + 1;
    gameState.diceValue = diceValue;
    gameState.hasRolled = true;

    // Calculate available moves
    const availableMoves = this.calculateAvailableMoves(currentPlayer, diceValue);
    gameState.availableMoves = availableMoves;

    if (availableMoves.length === 0) {
      // No moves available, end turn
      gameState.message = `${currentPlayer.name} rolled ${diceValue} but has no valid moves.`;
      setTimeout(() => {
        this.nextTurn(gameState, false);
      }, 2000);
    } else {
      gameState.message = `${currentPlayer.name} rolled ${diceValue}. Choose a token to move.`;
    }

    return {
      gameState,
      diceValue,
      availableMoves,
      currentPlayer: currentPlayer.playerId
    };
  }

  calculateAvailableMoves(player, diceValue) {
    const moves = [];

    for (const token of player.tokens) {
      if (token.state === 'HOME' && diceValue === this.DICE_MAX) {
        // Can move out of home with a 6
        const startPos = this.PLAYER_START_INDICES[token.color];
        moves.push({ tokenId: token.id, newPosition: startPos });
      } else if (token.state === 'ACTIVE') {
        // Calculate new position for active tokens
        const newPosition = this.calculatePathPosition(token, diceValue);
        if (newPosition !== null) {
          moves.push({ tokenId: token.id, newPosition });
        }
      }
    }

    return moves;
  }

  calculatePathPosition(token, steps) {
    const finishEntryPred = this.FINISH_LANE_ENTRY_PREDECESSORS[token.color];
    const finishBase = this.FINISH_LANE_BASE_POSITIONS[token.color];
    let currentPathPos = token.position;

    for (let i = 0; i < steps; i++) {
      if (currentPathPos >= finishBase + 1 && currentPathPos < finishBase + this.FINISH_LANE_LENGTH) {
        // In finish lane
        currentPathPos++;
      } else if (currentPathPos === finishEntryPred) {
        // Enter finish lane
        currentPathPos = finishBase + 1;
      } else {
        // Regular path movement
        currentPathPos = (currentPathPos + 1) % this.MAIN_PATH_LENGTH;
      }
    }

    // Check if move is valid (not overshooting finish)
    if (currentPathPos > finishBase + this.FINISH_LANE_LENGTH) {
      return null; // Invalid move
    }

    return currentPathPos;
  }

  moveToken(roomId, playerId, tokenId) {
    const gameState = this.getGameState(roomId);
    if (!gameState) {
      throw new Error('Game not found');
    }

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.playerId !== playerId) {
      throw new Error('Not your turn');
    }

    if (!gameState.hasRolled) {
      throw new Error('Must roll dice first');
    }

    const move = gameState.availableMoves.find(m => m.tokenId === tokenId);
    if (!move) {
      throw new Error('Invalid move');
    }

    // Execute the move
    const token = currentPlayer.tokens.find(t => t.id === tokenId);
    const oldPosition = token.position;
    token.position = move.newPosition;

    // Update token state
    if (token.state === 'HOME') {
      token.state = 'ACTIVE';
    } else if (move.newPosition === this.FINISH_LANE_BASE_POSITIONS[token.color] + this.FINISH_LANE_LENGTH) {
      token.state = 'FINISHED';
    }

    // Check for captures
    const capturedTokens = this.checkForCaptures(gameState, token, move.newPosition);

    // Check for win condition
    const finishedTokens = currentPlayer.tokens.filter(t => t.state === 'FINISHED').length;
    if (finishedTokens === this.TOKENS_PER_PLAYER) {
      gameState.winner = currentPlayer.id;
      gameState.gameStatus = 'GAMEOVER';
      gameState.message = `${currentPlayer.name} wins!`;
    }

    // Determine if player gets extra turn (rolled 6 or captured)
    const gainedExtraTurn = gameState.diceValue === this.DICE_MAX || capturedTokens.length > 0;

    if (gameState.gameStatus !== 'GAMEOVER') {
      this.nextTurn(gameState, gainedExtraTurn);
    }

    return {
      gameState,
      move: {
        playerId,
        tokenId,
        from: oldPosition,
        to: move.newPosition,
        capturedTokens
      },
      gainedExtraTurn
    };
  }

  checkForCaptures(gameState, movingToken, newPosition) {
    const capturedTokens = [];

    // Can't capture on safe zones or in finish lanes
    if (this.SAFE_ZONE_INDICES.includes(newPosition) || newPosition >= 100) {
      return capturedTokens;
    }

    // Check all other players' tokens
    for (const player of gameState.players) {
      if (player.id === movingToken.color) continue;

      for (const token of player.tokens) {
        if (token.position === newPosition && token.state === 'ACTIVE') {
          // Capture the token
          token.position = this.HOME_YARD_POSITION;
          token.state = 'HOME';
          capturedTokens.push({
            tokenId: token.id,
            playerId: player.id,
            playerName: player.name
          });
        }
      }
    }

    return capturedTokens;
  }

  nextTurn(gameState, gainedExtraTurn) {
    if (!gainedExtraTurn) {
      gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    }

    gameState.diceValue = null;
    gameState.hasRolled = false;
    gameState.availableMoves = [];
    gameState.turnStartTime = new Date().toISOString();

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    gameState.message = `${currentPlayer.name}'s turn. Roll the dice.`;
  }

  deleteGame(roomId) {
    return this.games.delete(roomId);
  }

  getActiveGamesCount() {
    return this.games.size;
  }

  // Get game statistics
  getGameStats(roomId) {
    const gameState = this.getGameState(roomId);
    if (!gameState) return null;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const playerStats = gameState.players.map(player => ({
      id: player.id,
      name: player.name,
      tokensHome: player.tokens.filter(t => t.state === 'HOME').length,
      tokensActive: player.tokens.filter(t => t.state === 'ACTIVE').length,
      tokensFinished: player.tokens.filter(t => t.state === 'FINISHED').length
    }));

    return {
      roomId,
      gameStatus: gameState.gameStatus,
      currentPlayer: currentPlayer.playerId,
      currentPlayerName: currentPlayer.name,
      turnNumber: gameState.currentPlayerIndex + 1,
      diceValue: gameState.diceValue,
      hasRolled: gameState.hasRolled,
      winner: gameState.winner,
      playerStats,
      gameStartTime: gameState.gameStartTime,
      turnStartTime: gameState.turnStartTime
    };
  }
}
