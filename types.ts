
export enum PlayerColor {
  RED = 'RED',
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  BLUE = 'BLUE',
}

export enum TokenState {
  HOME = 'HOME',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

export interface Token {
  id: string; // Unique ID like 'RED_0', 'GREEN_1'
  color: PlayerColor;
  position: number; // -1: home yard, 0-51: main path, 101-106 series for finish lanes, 999: finished
  state: TokenState;
}

export interface Player {
  id: PlayerColor;
  name: string;
  tokens: Token[];
  isAI: boolean; // For future extension, currently all human
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number | null;
  hasRolled: boolean;
  winner: PlayerColor | null;
  gameStatus: 'SETUP' | 'PLAYING' | 'GAMEOVER';
  message: string;
  availableMoves: { tokenId: string; newPosition: number }[];
}

export interface BoardCell {
  type: 'path' | 'home_yard' | 'finish_lane' | 'start_square' | 'safe_zone' | 'center_goal';
  playerColor?: PlayerColor; // For colored paths/home yards
  gridRow: number;
  gridCol: number;
  tokens: Token[]; // Tokens currently on this cell visually
  logicalPosition?: number; // Reference to logical path position
}
