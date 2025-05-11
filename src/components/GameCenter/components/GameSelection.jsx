import React from 'react';
import { Link } from 'react-router-dom';
import { useGameResources } from '../shared/GameContext';
import styles from './GameSelection.module.css';

const GameSelection = () => {
  const { scores } = useGameResources();
  
  const games = [
    { 
      id: 'puzzle', 
      name: 'Puzzle Game', 
      path: '/games/puzzle', 
      thumbnail: '/assets/puzzle-thumb.jpg',
      description: 'Test your problem-solving skills with our challenging puzzle game.'
    },
    { 
      id: 'arcade', 
      name: 'Arcade Game', 
      path: '/games/arcade', 
      thumbnail: '/assets/arcade-thumb.jpg',
      description: 'Experience fast-paced action in our retro-inspired arcade game.'
    }
  ];
  
  return (
    <div className={styles.gameSelection}>
      <h2>Choose a Game</h2>
      
      <div className={styles.gameGrid}>
        {games.map(game => (
          <Link key={game.id} to={game.path} className={styles.gameCard}>
            <div className={styles.gameThumbnail}>
              <img 
                src={game.thumbnail} 
                alt={game.name} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/assets/default-game-thumb.jpg";
                }}
              />
            </div>
            <h3>{game.name}</h3>
            <p className={styles.gameDescription}>{game.description}</p>
            <div className={styles.gameScore}>
              High Score: {scores[game.id] || 0}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GameSelection;