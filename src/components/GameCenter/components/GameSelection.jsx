import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGameResources } from '../shared/GameContext';
import { FaGamepad, FaPuzzlePiece } from 'react-icons/fa';
import { motion } from 'framer-motion';
import styles from './GameSelection.module.css';

function GameSelection() {
  const { scores } = useGameResources();
  
  const games = [
    { 
      id: 'puzzle', 
      name: 'Puzzle Game', 
      path: '/games/puzzle', 
      thumbnail: '/assets/puzzle-thumb.png',
      description: 'Test your problem-solving skills with our challenging puzzle game.',
      icon: <FaPuzzlePiece size={24} />
    },
    { 
      id: 'arcade', 
      name: 'Arcade Game', 
      path: '/games/arcade', 
      thumbnail: '/assets/arcade-thumb.png',
      description: 'Experience fast-paced action in our retro-inspired arcade game.',
      icon: <FaGamepad size={24} />
    }
  ];

  useEffect(() => {
    // Preload game thumbnails
    games.forEach(game => {
      const img = new Image();
      img.src = game.thumbnail;
    });
  }, []);
  
  return (
    <motion.div 
      className={styles.gameSelection}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Choose Your Adventure</h2>
      
      <div className={styles.gameGrid}>
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Link to={game.path} className={styles.gameCard}>
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
              <h3>
                {game.icon}
                <span>{game.name}</span>
              </h3>
              <p className={styles.gameDescription}>{game.description}</p>
              <div className={styles.gameScore}>
                High Score: {scores[game.id] || 0}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default GameSelection;