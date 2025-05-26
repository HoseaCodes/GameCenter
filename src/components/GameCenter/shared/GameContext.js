import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const useGameResources = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameResources must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [scores, setScores] = useState({
    puzzle: 0,
    arcade: 0,
  });

  const [gameState, setGameState] = useState({
    puzzle: {
      isPlaying: false,
      level: 1,
    },
    arcade: {
      isPlaying: false,
      level: 1,
    },
  });

  const updateScore = (game, newScore) => {
    setScores(prev => ({
      ...prev,
      [game]: Math.max(prev[game], newScore),
    }));
  };

  const updateGameState = (game, state) => {
    setGameState(prev => ({
      ...prev,
      [game]: { ...prev[game], ...state },
    }));
  };

  const value = {
    scores,
    updateScore,
    gameState,
    updateGameState,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export default GameContext;
