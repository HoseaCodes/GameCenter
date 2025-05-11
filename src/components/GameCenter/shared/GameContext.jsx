import React, { createContext, useContext, useState } from 'react';

// Asset Loader - Handles loading and caching of game assets
class AssetLoader {
  constructor() {
    this.cache = new Map();
  }
  
  async loadImage(key, url) {
    if (this.cache.has(key)) return this.cache.get(key);
    
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.cache.set(key, img);
        resolve(img);
      };
      img.src = url;
    });
  }
  
  getImage(key) {
    return this.cache.get(key);
  }
}

// Audio Manager - Handles loading and playing sounds
class AudioManager {
  constructor() {
    this.sounds = new Map();
  }
  
  async loadSound(key, url) {
    const audio = new Audio(url);
    this.sounds.set(key, audio);
    return audio;
  }
  
  playSound(key) {
    const sound = this.sounds.get(key);
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  }
}

// Game Engine - Provides shared game functionality
class GameEngine {
  createGame(canvas, options) {
    const ctx = canvas?.getContext('2d');
    
    return {
      start: () => {
        // Game loop implementation
        console.log(`Starting ${options.type} game`);
      },
      destroy: () => {
        // Cleanup resources
        console.log(`Destroying ${options.type} game`);
      }
    };
  }
}

// Create context
const GameContext = createContext();

// Provider component
export function GameProvider({ children }) {
  const [assetLoader] = useState(new AssetLoader());
  const [audioManager] = useState(new AudioManager());
  const [gameEngine] = useState(new GameEngine());
  
  // Shared state for player data
  const [playerProgress, setPlayerProgress] = useState({});
  const [scores, setScores] = useState({});
  
  const value = {
    assetLoader,
    audioManager,
    gameEngine,
    playerProgress,
    setPlayerProgress,
    scores,
    setScores,
  };
  
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// Custom hook for using the game context
export const useGameResources = () => useContext(GameContext);