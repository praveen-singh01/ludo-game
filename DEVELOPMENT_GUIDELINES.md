# Development Guidelines

This document outlines the coding standards, best practices, and architectural patterns used in the Ludo Master project.

## 📁 Project Structure

```
ludo-master/
├── components/           # React components
│   ├── ui/              # Reusable UI components (buttons, cards, etc.)
│   ├── multiplayer/     # Multiplayer-specific components
│   ├── profile/         # User profile components
│   ├── shop/            # Cosmetic shop components
│   └── leaderboard/     # Ranking and leaderboard components
├── store/               # Zustand state management
├── hooks/               # Custom React hooks
├── constants/           # Configuration and constant values
├── types.ts             # TypeScript type definitions
├── lib/                 # Utility functions
└── server/              # Backend Node.js server
```

## 🎯 Code Organization Principles

### Component Organization
- **Single Responsibility**: Each component should have one clear purpose
- **Composition over Inheritance**: Use composition patterns for component reuse
- **Props Interface**: Always define TypeScript interfaces for component props
- **Default Exports**: Use default exports for main components, named exports for utilities

### File Naming Conventions
- **Components**: PascalCase (e.g., `GameBoard.tsx`, `PlayerInfo.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useLudoGame.ts`)
- **Stores**: camelCase with `Store` suffix (e.g., `gameStore.ts`)
- **Types**: camelCase for interfaces, PascalCase for enums
- **Constants**: UPPER_SNAKE_CASE for constants, camelCase for objects

## 🔧 TypeScript Patterns

### Interface Design
```typescript
// ✅ Good: Clear, specific interfaces
interface GameBoardProps {
  players: Player[];
  onTokenClick: (tokenId: string) => void;
  availableMoves: AvailableMove[];
}

// ❌ Avoid: Generic or unclear interfaces
interface Props {
  data: any;
  callback: Function;
}
```

### Type Safety
```typescript
// ✅ Good: Use enums for fixed values
export enum PlayerColor {
  RED = 'RED',
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  BLUE = 'BLUE'
}

// ✅ Good: Use union types for specific options
type GameStatus = 'SETUP' | 'PLAYING' | 'GAMEOVER';

// ✅ Good: Use generics for reusable types
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
```

### Null Safety
```typescript
// ✅ Good: Handle null/undefined cases
const currentPlayer = gameState.players[gameState.currentPlayerIndex];
if (!currentPlayer) {
  console.error('No current player found');
  return;
}

// ✅ Good: Use optional chaining
const playerName = profile?.username ?? 'Anonymous';
```

## ⚛️ React Component Patterns

### Functional Components with Hooks
```typescript
// ✅ Good: Use functional components with proper typing
const GameBoard: React.FC<GameBoardProps> = ({ players, onTokenClick, availableMoves }) => {
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  const handleTokenClick = useCallback((tokenId: string) => {
    setSelectedToken(tokenId);
    onTokenClick(tokenId);
  }, [onTokenClick]);

  return (
    // Component JSX
  );
};
```

### Custom Hooks
```typescript
// ✅ Good: Extract complex logic into custom hooks
export const useLudoGame = () => {
  const [gameState, setGameState] = useState<GameState>(initialState);

  const rollDice = useCallback(() => {
    // Dice rolling logic
  }, []);

  const moveToken = useCallback((tokenId: string) => {
    // Token movement logic
  }, []);

  return {
    gameState,
    rollDice,
    moveToken,
    // Other game methods
  };
};
```

### Component Composition
```typescript
// ✅ Good: Use composition for flexible components
const PlayerInfoCard: React.FC<PlayerInfoProps> = ({ player, isCurrentPlayer }) => {
  return (
    <Card className={isCurrentPlayer ? 'ring-2 ring-blue-500' : ''}>
      <CardHeader>
        <PlayerAvatar player={player} />
        <PlayerStats player={player} />
      </CardHeader>
      <CardContent>
        <TokenDisplay tokens={player.tokens} />
      </CardContent>
    </Card>
  );
};
```

## 🗄️ State Management with Zustand

### Store Structure
```typescript
// ✅ Good: Clear store interface with actions
interface GameStore {
  // State
  gameState: GameState | null;
  savedGames: SavedGame[];
  settings: GameSettings;

  // Actions
  updateGameState: (gameState: GameState) => void;
  saveGame: (name: string) => void;
  loadGame: (gameId: string) => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
}

// ✅ Good: Use create with proper typing
export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      gameState: null,
      savedGames: [],
      settings: defaultSettings,

      // Actions
      updateGameState: (gameState) => set({ gameState }),
      saveGame: (name) => {
        const { gameState, savedGames } = get();
        if (gameState) {
          const savedGame = { id: uuidv4(), name, gameState, savedAt: new Date() };
          set({ savedGames: [...savedGames, savedGame] });
        }
      },
      // Other actions...
    }),
    { name: 'game-store' }
  )
);
```

### Store Best Practices
- **Immutable Updates**: Always create new objects/arrays for state updates
- **Action Grouping**: Group related actions in the same store
- **Persistence**: Use persistence middleware for user data that should survive page reloads
- **Computed Values**: Use selectors for derived state instead of storing computed values

## 🎨 Styling Guidelines

### Tailwind CSS Patterns
```typescript
// ✅ Good: Use utility classes with conditional logic
const buttonClasses = cn(
  'px-4 py-2 rounded-lg font-medium transition-all duration-200',
  variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
  variant === 'secondary' && 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  disabled && 'opacity-50 cursor-not-allowed',
  className
);

// ✅ Good: Use the cn utility for conditional classes
import { cn } from '../lib/utils';

const TokenIcon: React.FC<TokenIconProps> = ({ token, isPlayable, className }) => {
  return (
    <div className={cn(
      'w-8 h-8 rounded-full border-2 transition-all',
      isPlayable && 'ring-2 ring-purple-500 cursor-pointer',
      className
    )}>
      {/* Token content */}
    </div>
  );
};
```

### Animation Guidelines
```typescript
// ✅ Good: Use Framer Motion for complex animations
const TokenIcon: React.FC<TokenIconProps> = ({ token, isPlayable }) => {
  return (
    <motion.div
      whileHover={{ scale: isPlayable ? 1.1 : 1 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: isPlayable ? 1.05 : 1,
        boxShadow: isPlayable ? '0 0 20px rgba(147, 51, 234, 0.6)' : 'none'
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Token content */}
    </motion.div>
  );
};
```

## 🧪 Testing Approaches

### Component Testing
```typescript
// ✅ Good: Test component behavior, not implementation
import { render, screen, fireEvent } from '@testing-library/react';
import { GameBoard } from './GameBoard';

describe('GameBoard', () => {
  it('should highlight playable tokens when moves are available', () => {
    const mockPlayers = createMockPlayers();
    const mockMoves = [{ tokenId: 'red-1', newPosition: 5 }];

    render(
      <GameBoard
        players={mockPlayers}
        availableMoves={mockMoves}
        onTokenClick={jest.fn()}
      />
    );

    const playableToken = screen.getByTestId('token-red-1');
    expect(playableToken).toHaveClass('ring-purple-500');
  });
});
```

### Hook Testing
```typescript
// ✅ Good: Test custom hooks with renderHook
import { renderHook, act } from '@testing-library/react';
import { useLudoGame } from './useLudoGame';

describe('useLudoGame', () => {
  it('should initialize game with correct number of players', () => {
    const { result } = renderHook(() => useLudoGame());

    act(() => {
      result.current.initializeGame(4);
    });

    expect(result.current.gameState.players).toHaveLength(4);
    expect(result.current.gameState.gameStatus).toBe('PLAYING');
  });
});
```

## 🚀 Performance Considerations

### React Optimization
```typescript
// ✅ Good: Use React.memo for expensive components
const GameBoard = React.memo<GameBoardProps>(({ players, onTokenClick, availableMoves }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison for complex props
  return (
    prevProps.players.length === nextProps.players.length &&
    prevProps.availableMoves.length === nextProps.availableMoves.length
  );
});

// ✅ Good: Use useCallback for event handlers
const PlayerInfo: React.FC<PlayerInfoProps> = ({ player, onTokenClick }) => {
  const handleTokenClick = useCallback((tokenId: string) => {
    onTokenClick(tokenId);
  }, [onTokenClick]);

  return (
    // Component JSX
  );
};

// ✅ Good: Use useMemo for expensive calculations
const GameStats: React.FC<GameStatsProps> = ({ gameState }) => {
  const playerStats = useMemo(() => {
    return gameState.players.map(player => ({
      ...player,
      finishedTokens: player.tokens.filter(t => t.state === 'FINISHED').length,
      progress: calculateProgress(player.tokens)
    }));
  }, [gameState.players]);

  return (
    // Component JSX
  );
};
```

### Bundle Optimization
- **Code Splitting**: Use dynamic imports for large components
- **Tree Shaking**: Import only needed functions from libraries
- **Asset Optimization**: Optimize images and use appropriate formats

## ♿ Accessibility Standards

### ARIA Labels and Roles
```typescript
// ✅ Good: Provide meaningful ARIA labels
const TokenIcon: React.FC<TokenIconProps> = ({ token, isPlayable, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={!isPlayable}
      aria-label={`${token.color} token ${token.id}${isPlayable ? ' - playable' : ''}`}
      role="button"
      tabIndex={isPlayable ? 0 : -1}
    >
      {/* Token content */}
    </button>
  );
};
```

### Keyboard Navigation
```typescript
// ✅ Good: Handle keyboard events
const GameBoard: React.FC<GameBoardProps> = ({ onTokenClick }) => {
  const handleKeyDown = useCallback((event: KeyboardEvent, tokenId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onTokenClick(tokenId);
    }
  }, [onTokenClick]);

  return (
    // Component JSX with onKeyDown handlers
  );
};
```

## 🔄 Maintenance Protocols

### Code Review Checklist
- [ ] TypeScript types are properly defined
- [ ] Components follow single responsibility principle
- [ ] Performance optimizations are applied where needed
- [ ] Accessibility standards are met
- [ ] Tests cover critical functionality
- [ ] Documentation is updated for new features

### Changelog Updates
- Update CHANGELOG.md for all significant changes
- Follow semantic versioning for releases
- Include migration notes for breaking changes
- Document impact on users and developers

### Dependency Management
- Keep dependencies up to date with security patches
- Use exact versions for critical dependencies
- Document any breaking changes in dependency updates
- Test thoroughly after dependency updates

## 🎮 Game-Specific Patterns

### Cosmetic System Architecture
```typescript
// ✅ Good: Type-safe cosmetic configuration
interface TokenSkinConfig {
  id: string;
  name: string;
  baseStyle: string;
  glowEffect: string;
  animation: string;
  gradient?: string;
}

// ✅ Good: Helper functions for cosmetic retrieval
export const getTokenSkinConfig = (id: string): TokenSkinConfig => {
  return COSMETIC_CONFIGS.TOKEN_SKINS[id] || COSMETIC_CONFIGS.TOKEN_SKINS.default;
};

// ✅ Good: Apply cosmetics in components
const TokenIcon: React.FC<TokenIconProps> = ({ token }) => {
  const { profile } = useUserProfileStore();
  const equippedSkin = profile?.equippedCosmetics?.tokenSkin || 'default';
  const skinConfig = getTokenSkinConfig(equippedSkin);

  return (
    <div className={cn(
      skinConfig.baseStyle,
      skinConfig.glowEffect,
      skinConfig.animation,
      skinConfig.gradient || config.baseColor
    )}>
      {/* Token content */}
    </div>
  );
};
```

### Multiplayer State Synchronization
```typescript
// ✅ Good: Handle multiplayer events with proper error handling
const useMultiplayerStore = create<MultiplayerState>((set, get) => ({
  // ... other state

  connect: (serverUrl = SERVER_URL) => {
    try {
      const socket = io(serverUrl);

      socket.on('connect', () => {
        set({ connected: true, connectionError: null });
      });

      socket.on('game-ended', async (data) => {
        const { gameState, gameResult } = data;
        set({ multiplayerGameState: gameState });

        // Process rewards
        if (gameResult) {
          const { useUserProfileStore } = await import('./userProfileStore');
          const { processGameResult } = useUserProfileStore.getState();

          const currentPlayerResult = gameResult.players.find(
            (p: any) => p.userId === get().playerId
          );

          if (currentPlayerResult) {
            processGameResult(
              currentPlayerResult.position,
              gameResult.players.length,
              { gameId: gameResult.gameId, roomId: gameResult.roomId }
            );
          }
        }
      });

      set({ socket, connecting: false });
    } catch (error) {
      set({ connectionError: error.message, connecting: false });
    }
  }
}));
```

## 🔧 Backend Development Patterns

### Game State Management
```javascript
// ✅ Good: Immutable game state updates
class GameStateManager {
  moveToken(roomId, playerId, tokenId) {
    const gameState = this.getGameState(roomId);
    if (!gameState) throw new Error('Game not found');

    // Create new state instead of mutating
    const newGameState = {
      ...gameState,
      players: gameState.players.map(player =>
        player.playerId === playerId
          ? { ...player, tokens: this.updateTokens(player.tokens, tokenId) }
          : player
      )
    };

    this.games.set(roomId, newGameState);
    return { gameState: newGameState };
  }
}
```

### Error Handling
```javascript
// ✅ Good: Consistent error handling
socket.on('move-token', (data) => {
  const { roomId, playerId } = socket;
  const { tokenId } = data;

  try {
    if (!roomId || !playerId) {
      throw new Error('Player not in a room');
    }

    const result = gameStateManager.moveToken(roomId, playerId, tokenId);
    io.to(roomId).emit('token-moved', result);

    // Check for game end
    if (result.gameState.gameStatus === 'GAMEOVER') {
      roomManager.updateRoomStatus(roomId, 'finished');
      io.to(roomId).emit('game-ended', {
        gameState: result.gameState,
        gameResult: result.gameState.gameResult
      });
    }
  } catch (error) {
    socket.emit('error', { message: error.message });
    console.error(`Move token error: ${error.message}`);
  }
});
```

## 📱 Responsive Design Guidelines

### Breakpoint Strategy
```typescript
// ✅ Good: Consistent responsive classes
const GameBoard: React.FC = () => {
  return (
    <div className={cn(
      // Mobile first approach
      "w-full h-full",
      // Tablet
      "sm:w-[540px] sm:h-[540px]",
      // Desktop
      "md:w-[600px] md:h-[600px]",
      // Large desktop
      "lg:w-[675px] lg:h-[675px]"
    )}>
      {/* Game board content */}
    </div>
  );
};
```

### Touch Interaction
```typescript
// ✅ Good: Handle both mouse and touch events
const TokenIcon: React.FC<TokenIconProps> = ({ onClick, isPlayable }) => {
  const handleInteraction = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    if (isPlayable && onClick) {
      onClick();
    }
  }, [onClick, isPlayable]);

  return (
    <motion.button
      onMouseDown={handleInteraction}
      onTouchStart={handleInteraction}
      className={cn(
        "touch-manipulation", // Optimize for touch
        "select-none", // Prevent text selection
        isPlayable && "cursor-pointer"
      )}
    >
      {/* Token content */}
    </motion.button>
  );
};
```

## 🔍 Debugging and Monitoring

### Development Tools
```typescript
// ✅ Good: Add debug information in development
const GameBoard: React.FC<GameBoardProps> = ({ players, availableMoves }) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('GameBoard render:', {
        playerCount: players.length,
        availableMoves: availableMoves.length,
        timestamp: new Date().toISOString()
      });
    }
  }, [players, availableMoves]);

  return (
    // Component JSX
  );
};
```

### Error Boundaries
```typescript
// ✅ Good: Implement error boundaries for critical components
class GameErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Game error:', error, errorInfo);
    // Send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```
