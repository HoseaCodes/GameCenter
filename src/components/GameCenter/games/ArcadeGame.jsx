import React, { useEffect, useRef } from 'react';
import { useGameResources } from '../shared/GameContext';
import styles from './ArcadeGame.module.css';

const ArcadeGame = () => {
  const canvasRef = useRef(null);
  const { assetLoader, gameEngine, audioManager, setScores } = useGameResources();
  
  useEffect(() => {
    // Load game-specific assets
    const loadAssets = async () => {
      try {
        await assetLoader.loadImage('arcade-sprites', '/assets/arcade-sprites.png');
        await audioManager.loadSound('jump', '/assets/jump.mp3');
        console.log('Arcade game assets loaded successfully');
      } catch (error) {
        console.error('Failed to load arcade game assets:', error);
      }
    };
    
    loadAssets();
    
    // Initialize game with shared engine
    const canvas = canvasRef.current;
    const game = gameEngine.createGame(canvas, {
      type: 'arcade',
      onScore: (score) => {
        setScores(prev => ({...prev, arcade: Math.max(prev.arcade || 0, score)}));
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
    <div className={styles.arcadeGame}>
      <h2>Arcade Challenge</h2>
      <p>Test your reflexes in this fast-paced arcade action game!</p>
      <canvas ref={canvasRef} width={800} height={600} className={styles.gameCanvas} />
      
      <div className={styles.gameControls}>
        <h3>Controls:</h3>
        <ul>
          <li>Arrow keys to move</li>
          <li>Space bar to jump</li>
          <li>Z key to attack</li>
        </ul>
      </div>
    </div>
  );
};

export default ArcadeGame;