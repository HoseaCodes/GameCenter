import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { GameProvider } from './shared/GameContext';
import Loading from './components/Loading';
import GameSelection from './components/GameSelection';
import { motion } from 'framer-motion';
import styles from './GameCenter.module.css';
import Home from './components/Home';

// Lazy load game components for code splitting
const PuzzleGame = lazy(() => import('./games/PuzzleGame'));
const ArcadeGame = lazy(() => import('./games/ArcadeGame'));

function GameCenter() {
  const [overlap, setOverlap] = useState(false);
  const [browsing, setBrowsing] = useState(false);

  const handleBrowse = () => {
    setOverlap(true);
    setTimeout(() => {
      setBrowsing(true);
      window.location.href = "/games";
    }, 1500);
  };

  const handlePlayDice = () => {
    const games = ["puzzle", "arcade"];
    let randomIndex = Math.floor(Math.random() * games.length);
    setOverlap(true);
    setTimeout(() => {
      setBrowsing(true);
      window.location.href = `/games/${games[randomIndex]}`;
    }, 1500);
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 900 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { y: { type: "tween", duration: 1.5, bounce: 0.3 } },
    },
  };

  return (
    <GameProvider>
      <BrowserRouter>
        <div className={styles.main}>
          {overlap && (
            <motion.div
              className={styles.overlap}
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
            ></motion.div>
          )}

          <Suspense fallback={<Loading />}>
            <Switch>
              <Route exact path="/" render={(props) => (
                <Home handleBrowse={handleBrowse} handlePlayDice={handlePlayDice} {...props} />
              )} />
              <Route path="/games/puzzle" component={PuzzleGame} />
              <Route path="/games/arcade" component={ArcadeGame} />
              <Route path="/games" component={GameSelection} />
            </Switch>
          </Suspense>
        </div>
      </BrowserRouter>
    </GameProvider>
  );
};

export default GameCenter;

if (module.hot) {
  module.hot.accept();
}