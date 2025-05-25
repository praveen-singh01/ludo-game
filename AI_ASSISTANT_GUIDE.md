# AI Assistant Quick Reference Guide

This guide provides essential information for AI assistants working on the Ludo Master project across different chat sessions.

## 🎯 Project Overview

**Ludo Master** is a production-ready web-based Ludo game with:
- Real-time multiplayer using Socket.IO
- Comprehensive ranking and reward system
- Visual customization (cosmetics)
- Modern React/TypeScript frontend
- Node.js/Express backend

**Current Version**: 2.0.0 (as of December 2024)

## 🏗️ Architecture Quick Reference

### Frontend Stack
```
React 18 + TypeScript + Vite
├── State Management: Zustand (3 stores)
├── Styling: Tailwind CSS + Framer Motion
├── UI Components: Custom library (shadcn/ui patterns)
└── Build: Vite with TypeScript compilation
```

### Backend Stack
```
Node.js + Express + Socket.IO
├── Game State: In-memory with custom managers
├── Rooms: GameRoomManager class
├── Real-time: Socket.IO WebSocket communication
└── Deployment: Railway platform
```

### Key Stores (Zustand)
1. **gameStore.ts**: Single-player game state and settings
2. **multiplayerStore.ts**: Real-time multiplayer state and Socket.IO
3. **userProfileStore.ts**: User profiles, rankings, coins, cosmetics

## 📁 Critical File Locations

### Core Game Logic
- `hooks/useLudoGame.ts` - Main game engine and logic
- `types.ts` - All TypeScript interfaces and enums
- `constants.ts` - Game constants and configuration

### Components Structure
```
components/
├── ui/                 # Reusable UI components
├── GameBoard.tsx       # Main game board with cosmetic themes
├── TokenIcon.tsx       # Token with cosmetic skins
├── DiceRoll.tsx        # Dice with cosmetic designs
├── PlayerInfo.tsx      # Player info with avatars
├── multiplayer/        # Multiplayer-specific components
├── profile/            # User profile and statistics
├── shop/               # Cosmetic shop
└── leaderboard/        # Rankings and leaderboards
```

### Backend Structure
```
server/
├── server.js           # Main server with Socket.IO handlers
├── gameStateManager.js # Game state and logic management
├── gameRoomManager.js  # Room creation and player management
└── package.json        # Backend dependencies
```

### Configuration Files
- `constants/cosmetics.ts` - Cosmetic system configuration
- `constants/rewards.ts` - Ranking, coins, and achievement system
- `vite.config.ts` - Frontend build configuration
- `tsconfig.json` - TypeScript configuration

## 🎮 Key Features Status

### ✅ Fully Implemented
- **Core Ludo Game**: Complete 4-player implementation
- **Real-time Multiplayer**: WebSocket-based with rooms and chat
- **Ranking System**: 7-tier progression (Bronze → Grandmaster)
- **Coin Economy**: Position-based rewards and virtual wallet
- **Cosmetic System**: Token skins, board themes, dice designs, avatars
- **User Profiles**: Statistics, achievements, transaction history
- **Shop System**: Purchase and equip cosmetics
- **Leaderboards**: Global rankings with filtering

### 🚧 Framework Ready (Not Active)
- **Daily Challenges**: Structure exists, needs activation
- **Friend System**: Foundation ready, needs implementation
- **Battle Pass**: Configuration present, needs seasonal content
- **Tournament Mode**: Framework exists, needs completion

### 📋 Planned Features
- **AI Opponents**: Computer-controlled players
- **Spectator Mode**: Watch live games
- **Anti-cheat System**: Fair play monitoring
- **Mobile Apps**: React Native implementation

## 🔧 Development Patterns

### Component Patterns
```typescript
// Standard component structure
const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  const { storeMethod } = useStoreHook();
  
  const handleAction = useCallback(() => {
    // Action logic
  }, [dependencies]);
  
  return (
    <motion.div className={cn("base-classes", conditionalClasses)}>
      {/* Component content */}
    </motion.div>
  );
};
```

### Store Patterns
```typescript
// Zustand store structure
export const useStoreHook = create<StoreInterface>()(
  persist(
    (set, get) => ({
      // State
      data: initialData,
      
      // Actions
      updateData: (newData) => set({ data: newData }),
      complexAction: () => {
        const currentState = get();
        // Complex logic
        set({ /* updated state */ });
      }
    }),
    { name: 'store-name' }
  )
);
```

### Cosmetic System Pattern
```typescript
// Apply cosmetics in components
const { profile } = useUserProfileStore();
const equippedItem = profile?.equippedCosmetics?.itemType || 'default';
const itemConfig = getItemConfig(equippedItem);

// Use config in className
className={cn(
  itemConfig.baseStyle,
  itemConfig.effects,
  otherClasses
)}
```

## 🚨 Common Issues & Solutions

### TypeScript Errors
- **Missing types**: Check `types.ts` for interfaces
- **Store typing**: Ensure proper Zustand store typing
- **Component props**: Define interfaces for all component props

### Cosmetic System
- **Not applying**: Check if user profile store is properly connected
- **Missing config**: Verify cosmetic exists in `constants/cosmetics.ts`
- **Visual issues**: Ensure Tailwind classes are properly applied

### Multiplayer Issues
- **Connection problems**: Check server URL in environment variables
- **State sync**: Verify Socket.IO event handlers in multiplayerStore
- **Room management**: Check gameRoomManager.js for room logic

### Build Issues
- **TypeScript errors**: Run `tsc` to check type issues
- **Missing dependencies**: Check both root and server package.json
- **Environment variables**: Ensure .env files are properly configured

## 📋 Before Making Changes

### Information Gathering Checklist
1. **Read Documentation**
   - [ ] PROJECT_SUMMARY.md for current state
   - [ ] CHANGELOG.md for recent changes
   - [ ] DEVELOPMENT_GUIDELINES.md for patterns

2. **Check Current State**
   - [ ] Run `npm run build` to verify build status
   - [ ] Check git status for uncommitted changes
   - [ ] Review recent commits for context

3. **Understand Requirements**
   - [ ] Identify affected components/systems
   - [ ] Check for existing patterns to follow
   - [ ] Consider impact on multiplayer sync

### Making Changes
1. **Follow Patterns**: Use existing patterns from DEVELOPMENT_GUIDELINES.md
2. **Type Safety**: Ensure all TypeScript interfaces are properly defined
3. **Testing**: Test both single-player and multiplayer functionality
4. **Documentation**: Update CHANGELOG.md for significant changes

## 🎯 Quick Commands

### Development
```bash
# Start development
npm run dev                 # Frontend
cd server && npm run dev    # Backend

# Build and test
npm run build              # Build frontend
npm run lint               # Check code quality
```

### Common Tasks
```bash
# Add new dependency
npm install package-name

# Update dependencies
npm update

# Check for issues
npm run lint
tsc --noEmit
```

## 📞 Emergency Contacts

### Critical Files to Never Delete
- `types.ts` - Core type definitions
- `constants.ts` - Game configuration
- `hooks/useLudoGame.ts` - Main game logic
- `store/` directory - All state management
- `server/server.js` - Backend entry point

### Backup Patterns
- Always test changes in development before committing
- Use git branches for experimental features
- Keep documentation updated with changes
- Verify multiplayer functionality after backend changes

## 🎮 Game-Specific Knowledge

### Ludo Rules Implementation
- **Token Movement**: Handled in `useLudoGame.ts`
- **Capture Logic**: Implemented in game state manager
- **Win Conditions**: All 4 tokens must reach finish area
- **Special Rules**: Roll 6 for extra turn, safe zones prevent capture

### Multiplayer Synchronization
- **Game State**: Synchronized via Socket.IO events
- **Turn Management**: Server-side validation and progression
- **Reconnection**: Automatic with room/player ID matching
- **Chat**: Real-time messaging within game rooms

### Cosmetic System
- **Application**: Real-time during gameplay
- **Storage**: User profile store with persistence
- **Configuration**: Type-safe configs in constants/cosmetics.ts
- **Shop**: Purchase with coins, equip immediately

---

**Remember**: Always prioritize user experience and maintain the high-quality, production-ready nature of the codebase.
