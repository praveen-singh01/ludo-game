# 🎲 Ludo Master

A modern, feature-rich implementation of the classic Ludo board game with real-time multiplayer, comprehensive progression systems, and visual customization.

![Ludo Master](https://img.shields.io/badge/version-2.0.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)

## ✨ Features

### 🎮 Core Gameplay
- **Complete Ludo Implementation**: Traditional 4-player Ludo with authentic rules
- **Real-time Multiplayer**: WebSocket-based gameplay with room management
- **Single Player Mode**: Local multiplayer for offline gaming
- **3D Dice Effects**: Realistic dice rolling with physics-based animations

### 🏆 Progression System
- **7-Tier Ranking**: Bronze → Silver → Gold → Platinum → Diamond → Master → Grandmaster
- **Coin Economy**: Earn coins based on game performance and position
- **Achievement System**: Unlock badges and rewards for milestones
- **Global Leaderboards**: Compete with players worldwide

### 🎨 Customization
- **Token Skins**: Golden, Crystal, and Neon token designs with special effects
- **Board Themes**: Classic, Royal Palace, Space Station, and Forest Grove environments
- **Dice Designs**: Standard, Wooden, Diamond, and Fire dice variations
- **Avatar System**: 6 unique characters (3 male, 3 female) with distinct personalities

### 🌐 Multiplayer Features
- **Room System**: Create private or public game rooms
- **Real-time Chat**: Communicate with players during games
- **Reconnection**: Automatic reconnection handling for network interruptions
- **Cross-platform**: Play across different devices and browsers

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ludo-master.git
   cd ludo-master
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   # Frontend (.env)
   VITE_SERVER_URL=http://localhost:3001
   
   # Backend (server/.env)
   PORT=3001
   NODE_ENV=development
   ```

5. **Start the development servers**
   ```bash
   # Terminal 1: Start backend
   cd server
   npm run dev
   
   # Terminal 2: Start frontend
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173` to start playing!

## 🏗️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with comprehensive interfaces
- **Vite** - Fast build tool with hot module replacement
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Zustand** - Lightweight state management with persistence

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Web framework for REST API endpoints
- **Socket.IO** - Real-time bidirectional event-based communication
- **UUID** - Unique identifier generation for rooms and players

### Development Tools
- **ESLint** - Code linting and quality enforcement
- **TypeScript Compiler** - Type checking and compilation
- **Nodemon** - Automatic server restart during development

## 📚 Documentation

### For Developers
- **[Development Guidelines](DEVELOPMENT_GUIDELINES.md)** - Coding standards, patterns, and best practices
- **[Project Summary](PROJECT_SUMMARY.md)** - Comprehensive overview of architecture and features
- **[Changelog](CHANGELOG.md)** - Detailed history of changes and releases
- **[Maintenance Protocol](MAINTENANCE_PROTOCOL.md)** - Documentation maintenance and update procedures

### For Contributors
- **Code Style**: Follow TypeScript and React best practices outlined in guidelines
- **Testing**: Write tests for new features and bug fixes
- **Documentation**: Update relevant documentation for any changes
- **Commits**: Use conventional commit messages for changelog generation

## 🎯 Game Rules

### Basic Ludo Rules
1. **Objective**: Move all 4 tokens from home to the finish area
2. **Starting**: Roll a 6 to move tokens out of home
3. **Movement**: Move tokens clockwise around the board
4. **Capturing**: Land on opponent tokens to send them home
5. **Safe Zones**: Colored squares protect tokens from capture
6. **Winning**: First player to get all tokens to finish wins

### Multiplayer Features
- **Room Creation**: Host can create rooms with 2-4 players
- **Ready System**: All players must be ready before game starts
- **Turn Management**: Automatic turn progression with timeouts
- **Reconnection**: Players can rejoin if disconnected

## 🏆 Progression System

### Ranking Tiers
- **Bronze** (0-999 XP): Starting tier for new players
- **Silver** (1000-2499 XP): Intermediate skill level
- **Gold** (2500-4999 XP): Advanced players
- **Platinum** (5000-9999 XP): Expert level gameplay
- **Diamond** (10000-19999 XP): Elite players
- **Master** (20000-39999 XP): Top-tier competitors
- **Grandmaster** (40000+ XP): Legendary status

### Coin Rewards
- **4-Player Games**: 500/250/100/0 coins for 1st/2nd/3rd/4th place
- **3-Player Games**: 400/200/50 coins for 1st/2nd/3rd place
- **2-Player Games**: 300/0 coins for 1st/2nd place

## 🎨 Customization Options

### Token Skins
- **Classic**: Traditional token design
- **Golden**: Luxurious gold finish with glow effects
- **Crystal**: Sparkling crystal with light refraction
- **Neon**: Futuristic glowing design with color transitions

### Board Themes
- **Classic**: Traditional Ludo board design
- **Royal Palace**: Elegant purple and gold theme
- **Space Station**: Futuristic sci-fi environment
- **Forest Grove**: Natural green and earth tones

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Backend (Railway)
```bash
cd server
railway login
railway deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Classic Ludo game rules and mechanics
- React and TypeScript communities for excellent tooling
- Socket.IO for real-time communication capabilities
- Tailwind CSS for rapid UI development
- Framer Motion for smooth animations

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/ludo-master/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/ludo-master/discussions)
- **Email**: support@ludomaster.com

---

**Built with ❤️ by the Ludo Master team**
