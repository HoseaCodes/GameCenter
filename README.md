# Game Center - Micro Frontend App

A modular, independently deployable game center application built with React that can be integrated into your portfolio website using micro frontend architecture.

## Overview

This Game Center is built as a standalone micro frontend that can be:
- Developed and tested independently
- Deployed to its own hosting environment
- Integrated seamlessly into your main portfolio application
- Extended with new games without modifying the host application

## Features

- 🎮 Modular game architecture
- 🔄 Shared game resources (asset loading, audio, game engine)
- 🏆 Persistent high scores across games
- 🚀 Lazy-loaded game components for optimal performance
- 🔌 Exposes components via Webpack Module Federation
- 🖥️ Works as both standalone app and integrated component

## Technology Stack

- React + Create React App (with CRACO for configuration)
- Webpack 5 Module Federation
- React Router for game navigation
- Canvas-based game rendering
- Docker + Nginx for deployment

## Project Structure

```
game-center/
├── craco.config.js          # CRACO webpack customization
├── package.json
├── public/
│   ├── assets/              # Game assets (sprites, sounds)
│   └── index.html           
├── src/
│   ├── components/
│   │   └── GameCenter/      # Main Game Center component
│   │       ├── index.jsx    # Entry point exposed to host apps
│   │       ├── components/  # Shared UI components
│   │       │   ├── Loading.jsx
│   │       │   └── GameSelection.jsx
│   │       ├── shared/      # Shared resources
│   │       │   ├── GameContext.jsx  # Context for shared state
│   │       │   ├── AssetLoader.js   # Asset loading utility
│   │       │   ├── GameEngine.js    # Shared game engine
│   │       │   └── AudioManager.js  # Audio management
│   │       └── games/       # Individual game components
│   │           ├── PuzzleGame.jsx
│   │           └── ArcadeGame.jsx
│   └── index.js             # Main app entry point
├── Dockerfile               # Production Docker build
└── nginx.conf               # Nginx configuration for production
```

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- Basic knowledge of React and JavaScript

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/game-center.git
   cd game-center
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Visit http://localhost:3001 to view the Game Center in standalone mode.

## Creating New Games

To add a new game to the Game Center:

1. Create a new game component in the `src/components/GameCenter/games/` directory
2. Utilize the shared context via `useGameResources()` hook for assets, audio, and game engine
3. Register the game in the main GameCenter component by adding it to the lazy-loaded imports and routes
4. Add the game to the selection screen in `GameSelection.jsx`

Example new game:

```jsx
// src/components/GameCenter/games/SpaceGame.jsx
import React, { useEffect, useRef } from 'react';
import { useGameResources } from '../shared/GameContext';

export default function SpaceGame() {
  const canvasRef = useRef(null);
  const { assetLoader, gameEngine, audioManager, setScores } = useGameResources();
  
  useEffect(() => {
    // Load game-specific assets
    const loadAssets = async () => {
      await assetLoader.loadImage('space-bg', '/assets/space-bg.png');
      await audioManager.loadSound('laser', '/assets/laser.mp3');
    };
    
    loadAssets();
    
    // Initialize game with shared engine
    const canvas = canvasRef.current;
    const game = gameEngine.createGame(canvas, {
      type: 'space',
      onScore: (score) => {
        setScores(prev => ({...prev, space: Math.max(prev.space || 0, score)}));
      }
    });
    
    // Start game loop
    game.start();
    
    return () => game.destroy();
  }, [assetLoader, gameEngine, audioManager, setScores]);
  
  return (
    <div className="space-game">
      <h2>Space Adventure</h2>
      <canvas ref={canvasRef} width={800} height={600} />
    </div>
  );
}
```

## Integration with Portfolio

To integrate the Game Center into your portfolio:

1. Install required dependencies in your portfolio project:
   ```bash
   npm install @craco/craco @module-federation/nextjs-mf
   ```

2. Create a CRACO configuration file (`craco.config.js`) in your portfolio project:
   ```javascript
   const { ModuleFederationPlugin } = require('webpack').container;

   module.exports = {
     webpack: {
       configure: (webpackConfig) => {
         webpackConfig.output.publicPath = 'auto';
         
         webpackConfig.plugins.push(
           new ModuleFederationPlugin({
             name: 'portfolio',
             remotes: {
               gameCenter: process.env.NODE_ENV === 'production'
                 ? 'gameCenter@https://your-game-center-url.com/remoteEntry.js'
                 : 'gameCenter@http://localhost:3001/remoteEntry.js',
             },
             shared: {
               react: { 
                 singleton: true, 
                 requiredVersion: require('./package.json').dependencies.react 
               },
               'react-dom': { 
                 singleton: true, 
                 requiredVersion: require('./package.json').dependencies['react-dom'] 
               },
             },
           })
         );
         
         return webpackConfig;
       },
     },
   };
   ```

3. Update your portfolio's `package.json` scripts to use CRACO:
   ```json
   "scripts": {
     "start": "craco start",
     "build": "craco build",
     "test": "craco test"
   }
   ```

4. Create a wrapper component in your portfolio:
   ```jsx
   // src/components/GameCenterWrapper.jsx
   import React, { Suspense, useState, useEffect } from 'react';

   const GameCenterWrapper = () => {
     const [GameCenter, setGameCenter] = useState(null);
     const [error, setError] = useState(null);

     useEffect(() => {
       import('gameCenter/GameCenter')
         .then((module) => {
           setGameCenter(() => module.default);
         })
         .catch((err) => {
           console.error('Failed to load Game Center:', err);
           setError('Failed to load Game Center. Please try again later.');
         });
     }, []);

     if (error) {
       return <div className="error-message">{error}</div>;
     }

     return (
       <div className="game-center-wrapper">
         <Suspense fallback={<div>Loading Game Center...</div>}>
           {GameCenter ? <GameCenter /> : <div>Initializing...</div>}
         </Suspense>
       </div>
     );
   };

   export default GameCenterWrapper;
   ```

5. Add the Game Center to your portfolio routes:
   ```jsx
   <Route path="/games/*" element={<GameCenterWrapper />} />
   ```

## Deployment

### Docker Deployment

Build and deploy the Game Center using Docker:

```bash
# Build the Docker image
docker build -t your-name-game-center .

# Run the container
docker run --name your-game-center-c -p 3002:3002 -d your-name-game-center
```

### Manual Deployment

For manual deployment:

1. Build the production bundle:
   ```bash
   npm run build
   ```

2. Deploy the contents of the `build` directory to your hosting provider.

3. Ensure your web server is configured to handle client-side routing (similar to the provided `nginx.conf`).

## Configuration Options

The Game Center can be configured through environment variables:

```
# .env file
REACT_APP_PUBLIC_PATH=https://your-game-center-url.com/
REACT_APP_PORT=3001
```

## Troubleshooting

### Common Issues

1. **Module Federation connection error**:
   - Check that both applications are running
   - Verify URLs in the CRACO configuration
   - Ensure version compatibility between shared dependencies

2. **Game resources not loading**:
   - Check that assets are in the correct location
   - Verify paths in the asset loader

3. **Route not found in production**:
   - Ensure your web server is configured for client-side routing (see nginx.conf)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Dominique Hosea's article on micro frontend architecture
- Built with React and WebPack Module Federation