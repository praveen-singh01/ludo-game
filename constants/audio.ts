// Audio configuration constants for Ludo King-style sound effects

export interface AudioConfig {
  id: string;
  name: string;
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume: number;
  fadeIn?: number;
  fadeOut?: number;
}

export interface SequenceStep {
  frequency: number;
  duration: number;
  delay?: number;
  type?: OscillatorType;
  volume?: number;
}

export interface AudioSequence {
  id: string;
  name: string;
  steps: SequenceStep[];
  loop?: boolean;
}

// Individual sound effect configurations
export const AUDIO_CONFIGS = {
  // Dice roll sounds - realistic rolling with multiple bounces
  DICE_ROLL_START: {
    id: 'dice_roll_start',
    name: 'Dice Roll Start',
    frequency: 800,
    duration: 0.1,
    type: 'square' as OscillatorType,
    volume: 0.3
  },
  
  DICE_BOUNCE: {
    id: 'dice_bounce',
    name: 'Dice Bounce',
    frequency: 600,
    duration: 0.08,
    type: 'square' as OscillatorType,
    volume: 0.25
  },

  DICE_SETTLE: {
    id: 'dice_settle',
    name: 'Dice Settle',
    frequency: 400,
    duration: 0.15,
    type: 'sine' as OscillatorType,
    volume: 0.2
  },

  // Token movement sounds
  TOKEN_STEP: {
    id: 'token_step',
    name: 'Token Step',
    frequency: 440,
    duration: 0.1,
    type: 'sine' as OscillatorType,
    volume: 0.2
  },

  TOKEN_STEP_SAFE: {
    id: 'token_step_safe',
    name: 'Token Step Safe Zone',
    frequency: 523,
    duration: 0.12,
    type: 'sine' as OscillatorType,
    volume: 0.25
  },

  // Game event sounds
  TOKEN_CAPTURE: {
    id: 'token_capture',
    name: 'Token Capture',
    frequency: 200,
    duration: 0.3,
    type: 'sawtooth' as OscillatorType,
    volume: 0.4
  },

  TOKEN_HOME_ENTRY: {
    id: 'token_home_entry',
    name: 'Token Home Entry',
    frequency: 659,
    duration: 0.4,
    type: 'sine' as OscillatorType,
    volume: 0.3
  },

  TOKEN_FINISH: {
    id: 'token_finish',
    name: 'Token Finish',
    frequency: 880,
    duration: 0.5,
    type: 'sine' as OscillatorType,
    volume: 0.35
  },

  // UI interaction sounds
  BUTTON_CLICK: {
    id: 'button_click',
    name: 'Button Click',
    frequency: 800,
    duration: 0.05,
    type: 'square' as OscillatorType,
    volume: 0.15
  },

  BUTTON_HOVER: {
    id: 'button_hover',
    name: 'Button Hover',
    frequency: 600,
    duration: 0.03,
    type: 'sine' as OscillatorType,
    volume: 0.1
  },

  // Notification sounds
  TURN_NOTIFICATION: {
    id: 'turn_notification',
    name: 'Turn Notification',
    frequency: 523,
    duration: 0.2,
    type: 'sine' as OscillatorType,
    volume: 0.25
  },

  ERROR_SOUND: {
    id: 'error_sound',
    name: 'Error Sound',
    frequency: 150,
    duration: 0.4,
    type: 'sawtooth' as OscillatorType,
    volume: 0.3
  }
};

// Complex audio sequences
export const AUDIO_SEQUENCES: Record<string, AudioSequence> = {
  // Realistic dice roll sequence
  DICE_ROLL_SEQUENCE: {
    id: 'dice_roll_sequence',
    name: 'Dice Roll Animation',
    steps: [
      { frequency: 800, duration: 0.1, type: 'square', volume: 0.3 }, // Initial roll
      { frequency: 700, duration: 0.08, delay: 0.1, type: 'square', volume: 0.28 }, // First bounce
      { frequency: 650, duration: 0.07, delay: 0.18, type: 'square', volume: 0.25 }, // Second bounce
      { frequency: 600, duration: 0.06, delay: 0.25, type: 'square', volume: 0.22 }, // Third bounce
      { frequency: 550, duration: 0.05, delay: 0.31, type: 'square', volume: 0.2 }, // Fourth bounce
      { frequency: 500, duration: 0.04, delay: 0.36, type: 'square', volume: 0.18 }, // Fifth bounce
      { frequency: 450, duration: 0.15, delay: 0.4, type: 'sine', volume: 0.15 } // Final settle
    ]
  },

  // Token movement sequence (for multiple steps)
  TOKEN_MOVEMENT_SEQUENCE: {
    id: 'token_movement_sequence',
    name: 'Token Movement Steps',
    steps: [
      { frequency: 440, duration: 0.1, type: 'sine', volume: 0.2 },
      { frequency: 440, duration: 0.1, delay: 0.15, type: 'sine', volume: 0.2 },
      { frequency: 440, duration: 0.1, delay: 0.3, type: 'sine', volume: 0.2 },
      { frequency: 440, duration: 0.1, delay: 0.45, type: 'sine', volume: 0.2 }
    ]
  },

  // Victory celebration
  VICTORY_CELEBRATION: {
    id: 'victory_celebration',
    name: 'Victory Celebration',
    steps: [
      // Triumphant chord progression
      { frequency: 261.63, duration: 0.3, type: 'sine', volume: 0.3 }, // C
      { frequency: 329.63, duration: 0.3, type: 'sine', volume: 0.25 }, // E
      { frequency: 392.00, duration: 0.3, type: 'sine', volume: 0.25 }, // G
      
      { frequency: 293.66, duration: 0.3, delay: 0.2, type: 'sine', volume: 0.3 }, // D
      { frequency: 369.99, duration: 0.3, delay: 0.2, type: 'sine', volume: 0.25 }, // F#
      { frequency: 440.00, duration: 0.3, delay: 0.2, type: 'sine', volume: 0.25 }, // A
      
      { frequency: 329.63, duration: 0.5, delay: 0.4, type: 'sine', volume: 0.35 }, // E
      { frequency: 415.30, duration: 0.5, delay: 0.4, type: 'sine', volume: 0.3 }, // G#
      { frequency: 493.88, duration: 0.5, delay: 0.4, type: 'sine', volume: 0.3 } // B
    ]
  },

  // Capture sequence - dramatic descending
  TOKEN_CAPTURE_SEQUENCE: {
    id: 'token_capture_sequence',
    name: 'Token Capture Dramatic',
    steps: [
      { frequency: 800, duration: 0.1, type: 'sawtooth', volume: 0.4 },
      { frequency: 600, duration: 0.15, delay: 0.1, type: 'sawtooth', volume: 0.35 },
      { frequency: 400, duration: 0.2, delay: 0.25, type: 'sawtooth', volume: 0.3 },
      { frequency: 200, duration: 0.3, delay: 0.45, type: 'sawtooth', volume: 0.25 }
    ]
  },

  // Home entry celebration
  HOME_ENTRY_CELEBRATION: {
    id: 'home_entry_celebration',
    name: 'Home Entry Celebration',
    steps: [
      { frequency: 523, duration: 0.2, type: 'sine', volume: 0.3 }, // C5
      { frequency: 659, duration: 0.2, delay: 0.1, type: 'sine', volume: 0.3 }, // E5
      { frequency: 784, duration: 0.3, delay: 0.2, type: 'sine', volume: 0.35 }, // G5
      { frequency: 1047, duration: 0.4, delay: 0.3, type: 'sine', volume: 0.4 } // C6
    ]
  }
};

// Audio settings
export const AUDIO_SETTINGS = {
  MASTER_VOLUME: 0.7,
  SOUND_EFFECTS_VOLUME: 0.8,
  MUSIC_VOLUME: 0.5,
  FADE_DURATION: 0.05,
  MAX_CONCURRENT_SOUNDS: 8
};

// Helper function to get audio config
export const getAudioConfig = (id: string): AudioConfig | null => {
  return AUDIO_CONFIGS[id as keyof typeof AUDIO_CONFIGS] || null;
};

// Helper function to get audio sequence
export const getAudioSequence = (id: string): AudioSequence | null => {
  return AUDIO_SEQUENCES[id] || null;
};

// Audio categories for volume control
export enum AudioCategory {
  SOUND_EFFECTS = 'SOUND_EFFECTS',
  MUSIC = 'MUSIC',
  UI = 'UI',
  NOTIFICATIONS = 'NOTIFICATIONS'
}

// Map sound effects to categories
export const AUDIO_CATEGORY_MAP: Record<string, AudioCategory> = {
  dice_roll_start: AudioCategory.SOUND_EFFECTS,
  dice_bounce: AudioCategory.SOUND_EFFECTS,
  dice_settle: AudioCategory.SOUND_EFFECTS,
  token_step: AudioCategory.SOUND_EFFECTS,
  token_step_safe: AudioCategory.SOUND_EFFECTS,
  token_capture: AudioCategory.SOUND_EFFECTS,
  token_home_entry: AudioCategory.SOUND_EFFECTS,
  token_finish: AudioCategory.SOUND_EFFECTS,
  button_click: AudioCategory.UI,
  button_hover: AudioCategory.UI,
  turn_notification: AudioCategory.NOTIFICATIONS,
  error_sound: AudioCategory.NOTIFICATIONS
};
