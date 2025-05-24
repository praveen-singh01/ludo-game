import { PlayerColor } from './types';

export const PLAYER_COLORS_LIST: PlayerColor[] = [PlayerColor.RED, PlayerColor.GREEN, PlayerColor.YELLOW, PlayerColor.BLUE];
export const TOKENS_PER_PLAYER = 4;
export const MAIN_PATH_LENGTH = 52;
export const FINISH_LANE_LENGTH = 6;

export const DICE_MIN = 1;
export const DICE_MAX = 6;

export const HOME_YARD_POSITION = -1;
export const FINISHED_POSITION = 999;

export const PLAYER_START_INDICES: Record<PlayerColor, number> = {
  [PlayerColor.RED]: 1,
  [PlayerColor.GREEN]: 14,
  [PlayerColor.YELLOW]: 27,
  [PlayerColor.BLUE]: 40,
};

export const FINISH_LANE_ENTRY_PREDECESSORS: Record<PlayerColor, number> = {
  [PlayerColor.RED]: 51,
  [PlayerColor.GREEN]: 12,
  [PlayerColor.YELLOW]: 25,
  [PlayerColor.BLUE]: 38,
};

export const FINISH_LANE_BASE_POSITIONS: Record<PlayerColor, number> = {
  [PlayerColor.RED]: 100,
  [PlayerColor.GREEN]: 200,
  [PlayerColor.YELLOW]: 300,
  [PlayerColor.BLUE]: 400,
};

export const SAFE_ZONE_INDICES: number[] = [1, 9, 14, 22, 27, 35, 40, 48];

// Helper to convert hex to rgba for dynamic shades/highlights
const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};


export const PLAYER_SETUP_CONFIG: Record<PlayerColor, {
  name: string;
  baseColor: string; // Tailwind class e.g., 'bg-red-600'
  rawBaseColor: string; // Hex value e.g., '#DC2626' (Was for 3D gradients, less critical now)
  lightColor: string;
  darkColor: string;
  textColor: string;
  tokenShadeColor: string; // CSS color value (Was for 3D effect, less critical now)
  tokenHighlightColor: string; // CSS color value (Was for 3D effect, less critical now)
  pathColor: string;
  homeAreaBaseColor: string;
  startIndicatorColor: string;
}> = {
  [PlayerColor.RED]: {
    name: 'Red',
    baseColor: 'bg-red-600', rawBaseColor: '#DC2626',
    lightColor: 'bg-red-400', darkColor: 'bg-red-800',
    textColor: 'text-red-700',
    tokenShadeColor: hexToRgba('#DC2626', 0.5),
    tokenHighlightColor: hexToRgba('#F87171', 0.8),
    pathColor: 'bg-red-500', homeAreaBaseColor: 'bg-red-300', startIndicatorColor: 'text-red-700 font-bold',
  },
  [PlayerColor.GREEN]: {
    name: 'Green',
    baseColor: 'bg-green-600', rawBaseColor: '#16A34A',
    lightColor: 'bg-green-400', darkColor: 'bg-green-800',
    textColor: 'text-green-700',
    tokenShadeColor: hexToRgba('#16A34A', 0.5),
    tokenHighlightColor: hexToRgba('#4ADE80', 0.8),
    pathColor: 'bg-green-500', homeAreaBaseColor: 'bg-green-300', startIndicatorColor: 'text-green-700 font-bold',
  },
  [PlayerColor.YELLOW]: {
    name: 'Yellow',
    baseColor: 'bg-yellow-500', rawBaseColor: '#EAB308',
    lightColor: 'bg-yellow-300', darkColor: 'bg-yellow-700',
    textColor: 'text-yellow-600',
    tokenShadeColor: hexToRgba('#EAB308', 0.5),
    tokenHighlightColor: hexToRgba('#FDE047', 0.8),
    pathColor: 'bg-yellow-400', homeAreaBaseColor: 'bg-yellow-200', startIndicatorColor: 'text-yellow-600 font-bold',
  },
  [PlayerColor.BLUE]: {
    name: 'Blue',
    baseColor: 'bg-blue-600', rawBaseColor: '#2563EB',
    lightColor: 'bg-blue-400', darkColor: 'bg-blue-800',
    textColor: 'text-blue-700',
    tokenShadeColor: hexToRgba('#2563EB', 0.5),
    tokenHighlightColor: hexToRgba('#60A5FA', 0.8),
    pathColor: 'bg-blue-500', homeAreaBaseColor: 'bg-blue-300', startIndicatorColor: 'text-blue-700 font-bold',
  },
};

// Defines the triangular home area using CSS clip-path polygon coordinates (percentage based)
export const HOME_AREA_CLIP_PATHS: Record<PlayerColor, string> = {
    [PlayerColor.RED]:    'polygon(0% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 50%)',
    [PlayerColor.GREEN]:  'polygon(0% 0%, 100% 0%, 100% 50%, 50% 100%, 0% 100%)',
    [PlayerColor.YELLOW]: 'polygon(0% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%)',
    [PlayerColor.BLUE]:   'polygon(0% 0%, 50% 0%, 100% 50%, 100% 100%, 0% 100%)',
};

export const HOME_YARD_TOKEN_SPOTS_RELATIVE: [number, number][] = [
    [1.5, 1.5], [1.5, 3.5],
    [3.5, 1.5], [3.5, 3.5],
];
export const HOME_AREA_GRID_ORIGINS: Record<PlayerColor, { colStart: number, rowStart: number }> = {
    [PlayerColor.RED]: { colStart: 0, rowStart: 0 },
    [PlayerColor.GREEN]: { colStart: 9, rowStart: 0 },
    [PlayerColor.YELLOW]: { colStart: 9, rowStart: 9 },
    [PlayerColor.BLUE]: { colStart: 0, rowStart: 9 },
};


export const BOARD_GRID_MAPPING: Record<number, [number, number]> = {
    0: [6,0], 1: [6,1], 2: [6,2], 3: [6,3], 4: [6,4], 5: [6,5],
    6: [5,6], 7: [4,6], 8: [3,6], 9: [2,6], 10: [1,6], 11: [0,6],
    12: [0,7], 13: [0,8], 14: [1,8], 15: [2,8], 16: [3,8], 17: [4,8], 18: [5,8],
    19: [6,9], 20: [6,10], 21: [6,11], 22: [6,12], 23: [6,13], 24: [6,14],
    25: [7,14], 26: [8,14], 27: [8,13], 28: [8,12], 29: [8,11], 30: [8,10], 31: [8,9],
    32: [9,8], 33: [10,8], 34: [11,8], 35: [12,8], 36: [13,8], 37: [14,8],
    38: [14,7], 39: [14,6], 40: [13,6], 41: [12,6], 42: [11,6], 43: [10,6], 44: [9,6],
    45: [8,5], 46: [8,4], 47: [8,3], 48: [8,2], 49: [8,1], 50: [8,0],
    51: [7,0],

    101: [7,1], 102: [7,2], 103: [7,3], 104: [7,4], 105: [7,5], 106: [7,6],
    201: [13,7], 202: [12,7], 203: [11,7], 204: [10,7], 205: [9,7], 206: [8,7],
    301: [7,13], 302: [7,12], 303: [7,11], 304: [7,10], 305: [7,9], 306: [7,8],
    401: [1,7], 402: [2,7], 403: [3,7], 404: [4,7], 405: [5,7], 406: [6,7],
};

export const CENTRAL_GOAL_TRIANGLE_POINTS: Record<PlayerColor, [number, number]> = {
    [PlayerColor.RED]:    BOARD_GRID_MAPPING[106],
    [PlayerColor.GREEN]:  BOARD_GRID_MAPPING[206],
    [PlayerColor.YELLOW]: BOARD_GRID_MAPPING[306],
    [PlayerColor.BLUE]:   BOARD_GRID_MAPPING[406],
};
export const CENTER_SQUARE_COORD: [number, number] = [7,7];


export const BOARD_DIMENSION_CLASSES = "w-[480px] h-[480px] sm:w-[540px] sm:h-[540px] md:w-[600px] md:h-[600px] lg:w-[675px] lg:h-[675px]";

// Enhanced token sizes for better visibility
export const TOKEN_SIZE_CLASSES = {
    default: "w-8 h-8",         // For tokens on path cells - larger and fixed size
    home: "w-10 h-10",          // For tokens in home yard spots - even larger
    stacked: "w-7 h-7",         // Slightly smaller if stacked
    finishedDisplay: "w-6 h-6"  // For the small icons in PlayerInfoCard
};


export const PLAYER_PATH_SEGMENTS: Record<PlayerColor, {start: number, end: number}> = {
    [PlayerColor.RED]: {start: 1, end: 1+5},
    [PlayerColor.GREEN]: {start: 14, end: 14+5},
    [PlayerColor.YELLOW]: {start: 27, end: 27+5},
    [PlayerColor.BLUE]: {start: 40, end: 40+5},
};


export const HOME_AREA_DEFINITION = HOME_AREA_GRID_ORIGINS;
export const HOME_YARD_TOKEN_SPOTS = HOME_YARD_TOKEN_SPOTS_RELATIVE;
export const CENTER_TRIANGLE_COORDS = CENTRAL_GOAL_TRIANGLE_POINTS;