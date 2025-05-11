import React, { useEffect, useRef } from 'react';
import { useGameResources } from '../shared/GameContext';
import styles from './PuzzleGame.module.css';

const PuzzleGame = () => {
  const canvasRef = useRef(null);
  const { assetLoader, gameEngine, audioManager, setScores } = useGameResources();
  
  useEffect(() => {
    // Load game-specific assets
    const loadAssets = async () => {
      try {
        await assetLoader.loadImage('puzzle-bg', '/assets/puzzle-bg.png');
        await audioManager.loadSound('success', '/assets/success.mp3');
        console.log('Puzzle game assets loaded successfully');
      } catch (error) {
        console.error('Failed to load puzzle game assets:', error);
      }
    };
    
    loadAssets();
    
    // Initialize game with shared engine
    const canvas = canvasRef.current;
    const game = gameEngine.createGame(canvas, {
      type: 'puzzle',
      onScore: (score) => {
        setScores(prev => ({...prev, puzzle: Math.max(prev.puzzle || 0, score)}));
      }
    });
    
    // Start game loop
    game.start();
    
    // Cleanup function
    return () => {
      game.destroy();
    };
  }, [assetLoader, gameEngine, audioManager, setScores]);
  
  return (
    <div className={styles.puzzleGame}>
      <h2>Puzzle Challenge</h2>
      <p>Use your problem-solving skills to complete the puzzle!</p>
      <canvas ref={canvasRef} width={800} height={600} className={styles.gameCanvas} />
      
      <div className={styles.gameControls}>
        <h3>Controls:</h3>
        <ul>
          <li>Click and drag pieces to move them</li>
          <li>Double-click to rotate pieces</li>
          <li>Press 'H' for a hint</li>
        </ul>
      </div>
    </div>
  );
};

export default PuzzleGame;