import { useCallback, useRef } from 'react';
import { useUserProfileStore } from '../store/userProfileStore';
import {
  AUDIO_SETTINGS,
  AudioConfig,
  AudioSequence,
  SequenceStep,
  getAudioConfig,
  getAudioSequence
} from '../constants/audio';

type SoundEffect =
  | 'dice-roll'
  | 'dice-roll-sequence'
  | 'token-move'
  | 'token-move-sequence'
  | 'token-capture'
  | 'token-capture-sequence'
  | 'token-finish'
  | 'token-home-entry'
  | 'home-entry-celebration'
  | 'game-win'
  | 'victory-celebration'
  | 'button-click'
  | 'button-hover'
  | 'turn-notification'
  | 'error';

export const useSoundEffects = () => {
  const { profile } = useUserProfileStore();
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeOscillatorsRef = useRef<Set<OscillatorNode>>(new Set());

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Enhanced tone creation with volume control and cleanup
  const createTone = useCallback((
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = 0.1,
    delay: number = 0,
    fadeIn: number = 0.01,
    fadeOut?: number
  ) => {
    if (!profile?.settings?.soundEnabled) return null;

    const audioContext = initAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + delay);
    oscillator.type = type;

    const masterVolume = AUDIO_SETTINGS.MASTER_VOLUME;
    const effectiveVolume = volume * masterVolume;

    // Enhanced envelope with configurable fade
    gainNode.gain.setValueAtTime(0, audioContext.currentTime + delay);
    gainNode.gain.linearRampToValueAtTime(effectiveVolume, audioContext.currentTime + delay + fadeIn);

    if (fadeOut) {
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + delay + duration - fadeOut);
    } else {
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + delay + duration);
    }

    oscillator.start(audioContext.currentTime + delay);
    oscillator.stop(audioContext.currentTime + delay + duration);

    // Track active oscillators for cleanup
    activeOscillatorsRef.current.add(oscillator);
    oscillator.onended = () => {
      activeOscillatorsRef.current.delete(oscillator);
    };

    return oscillator;
  }, [initAudioContext, profile?.settings?.soundEnabled]);

  // Play audio sequence with timing
  const playAudioSequence = useCallback((sequence: AudioSequence) => {
    if (!profile?.settings?.soundEnabled) return;

    sequence.steps.forEach((step: SequenceStep) => {
      createTone(
        step.frequency,
        step.duration,
        step.type || 'sine',
        step.volume || 0.2,
        step.delay || 0
      );
    });
  }, [createTone, profile?.settings?.soundEnabled]);

  // Play single audio config
  const playAudioConfig = useCallback((config: AudioConfig) => {
    if (!profile?.settings?.soundEnabled) return;

    createTone(
      config.frequency,
      config.duration,
      config.type,
      config.volume,
      0,
      config.fadeIn,
      config.fadeOut
    );
  }, [createTone, profile?.settings?.soundEnabled]);

  // Stop all active sounds
  const stopAllSounds = useCallback(() => {
    activeOscillatorsRef.current.forEach(oscillator => {
      try {
        oscillator.stop();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    activeOscillatorsRef.current.clear();
  }, []);

  // Enhanced dice roll with realistic bouncing sequence
  const playDiceRoll = useCallback(() => {
    const sequence = getAudioSequence('DICE_ROLL_SEQUENCE');
    if (sequence) {
      playAudioSequence(sequence);
    }
  }, [playAudioSequence]);

  // Single dice roll sound
  const playDiceRollSimple = useCallback(() => {
    const config = getAudioConfig('dice_roll_start');
    if (config) {
      playAudioConfig(config);
    }
  }, [playAudioConfig]);

  // Enhanced token movement sounds
  const playTokenMove = useCallback((isInSafeZone: boolean = false) => {
    const configId = isInSafeZone ? 'token_step_safe' : 'token_step';
    const config = getAudioConfig(configId);
    if (config) {
      playAudioConfig(config);
    }
  }, [playAudioConfig]);

  // Token movement sequence for multiple steps
  const playTokenMoveSequence = useCallback((steps: number) => {
    for (let i = 0; i < steps; i++) {
      setTimeout(() => {
        playTokenMove();
      }, i * 150); // 150ms between each step
    }
  }, [playTokenMove]);

  // Enhanced token capture with dramatic sequence
  const playTokenCapture = useCallback(() => {
    const sequence = getAudioSequence('TOKEN_CAPTURE_SEQUENCE');
    if (sequence) {
      playAudioSequence(sequence);
    }
  }, [playAudioSequence]);

  // Token home entry celebration
  const playTokenHomeEntry = useCallback(() => {
    const sequence = getAudioSequence('HOME_ENTRY_CELEBRATION');
    if (sequence) {
      playAudioSequence(sequence);
    }
  }, [playAudioSequence]);

  // Token finish sound
  const playTokenFinish = useCallback(() => {
    const config = getAudioConfig('token_finish');
    if (config) {
      playAudioConfig(config);
    }
  }, [playAudioConfig]);

  // Victory celebration with full sequence
  const playGameWin = useCallback(() => {
    const sequence = getAudioSequence('VICTORY_CELEBRATION');
    if (sequence) {
      playAudioSequence(sequence);
    }
  }, [playAudioSequence]);

  // UI interaction sounds
  const playButtonClick = useCallback(() => {
    const config = getAudioConfig('button_click');
    if (config) {
      playAudioConfig(config);
    }
  }, [playAudioConfig]);

  const playButtonHover = useCallback(() => {
    const config = getAudioConfig('button_hover');
    if (config) {
      playAudioConfig(config);
    }
  }, [playAudioConfig]);

  // Notification and error sounds
  const playTurnNotification = useCallback(() => {
    const config = getAudioConfig('turn_notification');
    if (config) {
      playAudioConfig(config);
    }
  }, [playAudioConfig]);

  const playError = useCallback(() => {
    const config = getAudioConfig('error_sound');
    if (config) {
      playAudioConfig(config);
    }
  }, [playAudioConfig]);

  // Legacy notification function
  const playNotification = useCallback(() => {
    playTurnNotification();
  }, [playTurnNotification]);

  const playSound = useCallback((effect: SoundEffect, options?: { steps?: number; isInSafeZone?: boolean }) => {
    switch (effect) {
      case 'dice-roll':
        playDiceRoll();
        break;
      case 'dice-roll-sequence':
        playDiceRoll();
        break;
      case 'token-move':
        playTokenMove(options?.isInSafeZone);
        break;
      case 'token-move-sequence':
        playTokenMoveSequence(options?.steps || 1);
        break;
      case 'token-capture':
        playTokenCapture();
        break;
      case 'token-capture-sequence':
        playTokenCapture();
        break;
      case 'token-finish':
        playTokenFinish();
        break;
      case 'token-home-entry':
        playTokenHomeEntry();
        break;
      case 'home-entry-celebration':
        playTokenHomeEntry();
        break;
      case 'game-win':
        playGameWin();
        break;
      case 'victory-celebration':
        playGameWin();
        break;
      case 'button-click':
        playButtonClick();
        break;
      case 'button-hover':
        playButtonHover();
        break;
      case 'turn-notification':
        playTurnNotification();
        break;
      case 'error':
        playError();
        break;
      default:
        console.warn(`Unknown sound effect: ${effect}`);
    }
  }, [
    playDiceRoll,
    playTokenMove,
    playTokenMoveSequence,
    playTokenCapture,
    playTokenFinish,
    playTokenHomeEntry,
    playGameWin,
    playButtonClick,
    playButtonHover,
    playTurnNotification,
    playError,
    playNotification
  ]);

  return {
    playSound,
    playDiceRoll,
    playDiceRollSimple,
    playTokenMove,
    playTokenMoveSequence,
    playTokenCapture,
    playTokenFinish,
    playTokenHomeEntry,
    playGameWin,
    playButtonClick,
    playButtonHover,
    playTurnNotification,
    playError,
    playNotification,
    stopAllSounds,
    playAudioSequence,
    playAudioConfig
  };
};
