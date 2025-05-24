import { useCallback, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

type SoundEffect = 
  | 'dice-roll'
  | 'token-move'
  | 'token-capture'
  | 'token-finish'
  | 'game-win'
  | 'button-click'
  | 'error'
  | 'notification';

export const useSoundEffects = () => {
  const { settings } = useGameStore();
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const createTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    const audioContext = initAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);

    return oscillator;
  }, [initAudioContext]);

  const createChord = useCallback((frequencies: number[], duration: number) => {
    return frequencies.map(freq => createTone(freq, duration));
  }, [createTone]);

  const playDiceRoll = useCallback(() => {
    if (!settings.soundEnabled) return;

    // Simulate dice rolling with rapid frequency changes
    const audioContext = initAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'square';
    
    // Create a rolling sound effect
    const startTime = audioContext.currentTime;
    const duration = 0.6;
    
    for (let i = 0; i < 20; i++) {
      const time = startTime + (i * duration / 20);
      const frequency = 200 + Math.random() * 400;
      oscillator.frequency.setValueAtTime(frequency, time);
    }

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.05, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }, [settings.soundEnabled, initAudioContext]);

  const playTokenMove = useCallback(() => {
    if (!settings.soundEnabled) return;
    
    // Pleasant ascending tone for token movement
    createTone(440, 0.2, 'sine');
    setTimeout(() => createTone(550, 0.15, 'sine'), 100);
  }, [settings.soundEnabled, createTone]);

  const playTokenCapture = useCallback(() => {
    if (!settings.soundEnabled) return;
    
    // Dramatic descending tone for captures
    createTone(800, 0.1, 'sawtooth');
    setTimeout(() => createTone(400, 0.2, 'sawtooth'), 100);
    setTimeout(() => createTone(200, 0.3, 'sawtooth'), 200);
  }, [settings.soundEnabled, createTone]);

  const playTokenFinish = useCallback(() => {
    if (!settings.soundEnabled) return;
    
    // Triumphant chord progression
    const chord1 = [261.63, 329.63, 392.00]; // C major
    const chord2 = [293.66, 369.99, 440.00]; // D major
    const chord3 = [329.63, 415.30, 493.88]; // E major
    
    createChord(chord1, 0.3);
    setTimeout(() => createChord(chord2, 0.3), 200);
    setTimeout(() => createChord(chord3, 0.5), 400);
  }, [settings.soundEnabled, createChord]);

  const playGameWin = useCallback(() => {
    if (!settings.soundEnabled) return;
    
    // Victory fanfare
    const melody = [
      { freq: 523.25, duration: 0.2 }, // C5
      { freq: 659.25, duration: 0.2 }, // E5
      { freq: 783.99, duration: 0.2 }, // G5
      { freq: 1046.50, duration: 0.4 }, // C6
      { freq: 783.99, duration: 0.2 }, // G5
      { freq: 1046.50, duration: 0.6 }, // C6
    ];

    melody.forEach((note, index) => {
      setTimeout(() => {
        createTone(note.freq, note.duration, 'triangle');
      }, index * 150);
    });
  }, [settings.soundEnabled, createTone]);

  const playButtonClick = useCallback(() => {
    if (!settings.soundEnabled) return;
    
    // Subtle click sound
    createTone(800, 0.05, 'square');
  }, [settings.soundEnabled, createTone]);

  const playError = useCallback(() => {
    if (!settings.soundEnabled) return;
    
    // Error buzz
    createTone(150, 0.3, 'sawtooth');
  }, [settings.soundEnabled, createTone]);

  const playNotification = useCallback(() => {
    if (!settings.soundEnabled) return;
    
    // Gentle notification chime
    createTone(880, 0.2, 'sine');
    setTimeout(() => createTone(1108, 0.3, 'sine'), 100);
  }, [settings.soundEnabled, createTone]);

  const playSound = useCallback((effect: SoundEffect) => {
    switch (effect) {
      case 'dice-roll':
        playDiceRoll();
        break;
      case 'token-move':
        playTokenMove();
        break;
      case 'token-capture':
        playTokenCapture();
        break;
      case 'token-finish':
        playTokenFinish();
        break;
      case 'game-win':
        playGameWin();
        break;
      case 'button-click':
        playButtonClick();
        break;
      case 'error':
        playError();
        break;
      case 'notification':
        playNotification();
        break;
    }
  }, [
    playDiceRoll,
    playTokenMove,
    playTokenCapture,
    playTokenFinish,
    playGameWin,
    playButtonClick,
    playError,
    playNotification
  ]);

  return {
    playSound,
    playDiceRoll,
    playTokenMove,
    playTokenCapture,
    playTokenFinish,
    playGameWin,
    playButtonClick,
    playError,
    playNotification
  };
};
