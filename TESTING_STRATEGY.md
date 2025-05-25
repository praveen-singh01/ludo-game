# Testing Strategy & Implementation Guide

## 🎯 Testing Philosophy

### Testing Pyramid
```
    E2E Tests (10%)
   ─────────────────
  Integration Tests (20%)
 ─────────────────────────
Unit Tests (70%)
```

### Key Principles
- **Test Behavior, Not Implementation**: Focus on what the user experiences
- **Fast Feedback Loop**: Unit tests should run in milliseconds
- **Realistic Testing**: Integration tests should use real components
- **User-Centric E2E**: Test complete user journeys

## 🧪 Unit Testing Strategy

### Core Game Logic Tests
**File**: `__tests__/hooks/useLudoGame.test.ts`

```typescript
import { renderHook, act } from '@testing-library/react';
import { useLudoGame } from '../../hooks/useLudoGame';

describe('useLudoGame', () => {
  it('should initialize game with correct number of players', () => {
    const { result } = renderHook(() => useLudoGame());
    
    act(() => {
      result.current.initializeGame(4);
    });
    
    expect(result.current.gameState.players).toHaveLength(4);
    expect(result.current.gameState.gameStatus).toBe('PLAYING');
  });

  it('should handle dice roll correctly', () => {
    const { result } = renderHook(() => useLudoGame());
    
    act(() => {
      result.current.initializeGame(2);
    });
    
    act(() => {
      result.current.rollDice();
    });
    
    expect(result.current.gameState.diceValue).toBeGreaterThan(0);
    expect(result.current.gameState.diceValue).toBeLessThan(7);
    expect(result.current.gameState.hasRolled).toBe(true);
  });

  it('should validate token moves correctly', () => {
    const { result } = renderHook(() => useLudoGame());
    
    act(() => {
      result.current.initializeGame(2);
    });
    
    // Test invalid move without rolling dice
    act(() => {
      result.current.moveToken('red-1');
    });
    
    expect(result.current.gameState.message).toContain('Roll the dice');
  });
});
```

### Store Testing
**File**: `__tests__/store/userProfileStore.test.ts`

```typescript
import { useUserProfileStore } from '../../store/userProfileStore';

describe('userProfileStore', () => {
  beforeEach(() => {
    useUserProfileStore.getState().initializeProfile('TestUser');
  });

  it('should initialize profile with default values', () => {
    const { profile } = useUserProfileStore.getState();
    
    expect(profile?.username).toBe('TestUser');
    expect(profile?.coins).toBe(1000);
    expect(profile?.tier).toBe('BRONZE');
  });

  it('should handle coin transactions correctly', () => {
    const { addCoins, spendCoins, profile } = useUserProfileStore.getState();
    
    addCoins(500, 'GAME_WIN', 'Won a game');
    expect(profile?.coins).toBe(1500);
    
    const success = spendCoins(200, 'SHOP_PURCHASE', 'Bought cosmetic');
    expect(success).toBe(true);
    expect(profile?.coins).toBe(1300);
  });
});
```

## 🔧 Component Testing Strategy

### Critical Component Tests
**File**: `__tests__/components/GameBoard.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { GameBoard } from '../../components/GameBoard';
import { createMockGameState } from '../utils/mockData';

describe('GameBoard', () => {
  const mockProps = {
    gameState: createMockGameState(),
    onTokenClick: jest.fn(),
    onBoardClick: jest.fn(),
    currentPlayer: 'RED',
    availableMoves: [{ tokenId: 'red-1', newPosition: 5 }]
  };

  it('should render all player tokens', () => {
    render(<GameBoard {...mockProps} />);
    
    const redTokens = screen.getAllByTestId(/token-red-/);
    expect(redTokens).toHaveLength(4);
  });

  it('should highlight available moves', () => {
    render(<GameBoard {...mockProps} />);
    
    const playableToken = screen.getByTestId('token-red-1');
    expect(playableToken).toHaveClass('ring-purple-500');
  });

  it('should handle token click events', () => {
    render(<GameBoard {...mockProps} />);
    
    const token = screen.getByTestId('token-red-1');
    fireEvent.click(token);
    
    expect(mockProps.onTokenClick).toHaveBeenCalledWith('red-1');
  });
});
```

### Mock Data Utilities
**File**: `__tests__/utils/mockData.ts`

```typescript
import { GameState, Player, PlayerColor, TokenState } from '../../types';

export const createMockPlayer = (color: PlayerColor): Player => ({
  id: color,
  name: color.toLowerCase(),
  tokens: Array.from({ length: 4 }, (_, i) => ({
    id: `${color.toLowerCase()}-${i + 1}`,
    color,
    position: 0,
    state: TokenState.HOME
  })),
  isAI: false
});

export const createMockGameState = (): GameState => ({
  players: [
    createMockPlayer(PlayerColor.RED),
    createMockPlayer(PlayerColor.BLUE)
  ],
  currentPlayerIndex: 0,
  diceValue: null,
  hasRolled: false,
  winner: null,
  gameStatus: 'PLAYING',
  message: 'Test game state',
  availableMoves: []
});
```

## 🌐 Integration Testing Strategy

### Multiplayer Flow Tests
**File**: `__tests__/integration/multiplayer.test.ts`

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MultiplayerSetup } from '../../components/multiplayer/MultiplayerSetup';
import { mockSocketIO } from '../utils/mockSocket';

describe('Multiplayer Integration', () => {
  beforeEach(() => {
    mockSocketIO.reset();
  });

  it('should create room and join lobby', async () => {
    const user = userEvent.setup();
    render(<MultiplayerSetup onBackToSinglePlayer={jest.fn()} />);
    
    const nameInput = screen.getByPlaceholderText('Enter your name');
    await user.type(nameInput, 'TestPlayer');
    
    const createButton = screen.getByText('Create Room');
    await user.click(createButton);
    
    await waitFor(() => {
      expect(mockSocketIO.emit).toHaveBeenCalledWith('create-room', 
        expect.objectContaining({
          playerName: 'TestPlayer',
          maxPlayers: 4
        })
      );
    });
  });
});
```

## 🎭 E2E Testing Strategy

### Complete Game Flow Tests
**File**: `e2e/complete-game.spec.ts` (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Complete Game Flow', () => {
  test('should complete a full 2-player game', async ({ page, context }) => {
    // Start game
    await page.goto('/');
    await page.click('[data-testid="single-player-button"]');
    await page.click('[data-testid="2-players-button"]');
    
    // Verify game initialization
    await expect(page.locator('[data-testid="game-board"]')).toBeVisible();
    await expect(page.locator('[data-testid="dice-container"]')).toBeVisible();
    
    // Play until game ends (simplified)
    let gameEnded = false;
    let attempts = 0;
    
    while (!gameEnded && attempts < 100) {
      try {
        await page.click('[data-testid="dice-button"]', { timeout: 1000 });
        await page.waitForTimeout(500);
        
        // Try to move a token if available
        const playableToken = page.locator('.ring-purple-500').first();
        if (await playableToken.isVisible()) {
          await playableToken.click();
        }
        
        // Check for game end
        const winMessage = page.locator('[data-testid="win-message"]');
        if (await winMessage.isVisible()) {
          gameEnded = true;
        }
        
        attempts++;
      } catch (error) {
        // Continue if no moves available
      }
    }
    
    expect(gameEnded).toBe(true);
  });
});
```

## 📊 Performance Testing

### Load Testing Strategy
**File**: `performance/load-test.js` (Artillery.io)

```yaml
config:
  target: 'http://localhost:3001'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 50
    - duration: 60
      arrivalRate: 100

scenarios:
  - name: "Create and join rooms"
    weight: 70
    engine: socketio
    flow:
      - emit:
          channel: "create-room"
          data:
            playerName: "LoadTestPlayer"
            maxPlayers: 4
      - think: 2
      - emit:
          channel: "start-game"

  - name: "Health check"
    weight: 30
    flow:
      - get:
          url: "/health"
```

## 🔧 Test Configuration

### Vitest Configuration
**File**: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*'
      ]
    }
  }
});
```

### Test Setup
**File**: `src/test/setup.ts`

```typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Socket.IO
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    disconnect: vi.fn()
  }))
}));

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  }
});
```

## 📈 Testing Metrics & Goals

### Coverage Targets
- **Unit Tests**: 80% code coverage
- **Integration Tests**: 60% feature coverage
- **E2E Tests**: 90% critical path coverage

### Performance Targets
- **Test Suite Runtime**: < 30 seconds
- **Individual Test**: < 100ms
- **E2E Test Suite**: < 10 minutes

### Quality Gates
- All tests must pass before deployment
- No decrease in coverage percentage
- Performance tests must meet SLA requirements
