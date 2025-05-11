import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Switch, Route, Link, useHistory } from 'react-router-dom';
import { GameProvider } from './shared/GameContext';
import Loading from './components/Loading';
import GameSelection from './components/GameSelection';
import { motion } from 'framer-motion';
import styles from './GameCenter.module.css';

// Import icons
import { FaGithub, FaLinkedin, FaDice, FaGamepad } from 'react-icons/fa';
import { IoEnterOutline } from 'react-icons/io5';
import { BiGitBranch } from 'react-icons/bi';
import { MdOutlineError, MdOutlineErrorOutline, MdSpeed } from 'react-icons/md';
import { AiOutlineCode } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';

// Lazy load game components for code splitting
const PuzzleGame = lazy(() => import('./games/PuzzleGame'));
const ArcadeGame = lazy(() => import('./games/ArcadeGame'));

const GameCenter = () => {
  const [overlap, setOverlap] = useState(false);
  const [browsing, setBrowsing] = useState(false);
  const [landingPage, setLandingPage] = useState(true);

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

          <div className={styles.home}>
            <video autoPlay muted loop className={styles.video}>
              <source src="https://i.imgur.com/MiKpHQ4.mp4" type="video/mp4" />
            </video>

            <div className={styles.container}>
              <div className={styles.left}>
                <div className={styles.splash}>
                  <h1>Game Corner</h1>
                  <p className={styles.intro}>
                    Welcome to the game corner, the best destination to play react
                    online games. I have classic games, responsive support, and a
                    flawless UX. Wish for more? Tell me{" "}
                    <span className={styles.careers}>below</span>
                  </p>
                </div>

                <div className={styles.buttons}>
                  <button
                    className={`${styles.cta} ${styles.browseBtn}`}
                    onClick={handleBrowse}
                  >
                    <IoEnterOutline className={styles.ctaSVG} />
                    Browse
                  </button>
                  <button
                    className={styles.cta}
                    onClick={handlePlayDice}
                    aria-label="Open random game page"
                  >
                    <FaDice className={styles.ctaSVG} />
                    Random Game
                  </button>
                  <a href="https://github.com/HoseaCodes" target="_blank" rel="noopener noreferrer">
                    <button className={styles.cta} aria-label="View Repository">
                      <FaGithub className={styles.ctaSVG} />
                      GitHub
                    </button>
                  </a>
                  <a href="https://www.linkedin.com/in/dominique-hosea" target="_blank" rel="noopener noreferrer">
                    <button
                      className={`${styles.cta} ${styles.lastChild}`}
                      aria-label="Open LinkedIn"
                    >
                      <FaLinkedin className={`${styles.ctaSVG} ${styles.linkedin}`} />
                      <span>LinkedIn</span>
                    </button>
                  </a>
                </div>
              </div>

              <div className={styles.right}>
                <div className={styles.buttonsRight}>
                  <h2>Quick Navigation</h2>
                  <Link to="/games/puzzle" className={`${styles.cta} ${styles.browseBtn}`}>
                    <FaGamepad className={styles.ctaSVG} />
                    Puzzle Game
                  </Link>

                  <Link to="/games/arcade" className={`${styles.cta} ${styles.browseBtn}`}>
                    <FaGamepad className={styles.ctaSVG} />
                    Arcade Game
                  </Link>

                  <a href="https://github.com/HoseaCodes/Blog/commits/main" target="_blank" rel="noopener noreferrer"
                    className={`${styles.cta} ${styles.browseBtn}`}>
                    <BiGitBranch className={styles.ctaSVG} />
                    Commit Log
                  </a>

                  <a href="https://github.com/HoseaCodes/Blog/blob/main/README.md#performance" target="_blank" rel="noopener noreferrer"
                    className={`${styles.cta} ${styles.browseBtn}`}>
                    <MdSpeed className={styles.ctaSVG} />
                    Performance
                  </a>

                  <a href="https://github.com/HoseaCodes/Blog/blob/main/README.md#technologies-used" target="_blank" rel="noopener noreferrer"
                    className={`${styles.cta} ${styles.browseBtn}`}>
                    <AiOutlineCode className={styles.ctaSVG} />
                    Technologies
                  </a>

                  <a href="https://github.com/HoseaCodes/Blog/blob/main/README.md#sources" target="_blank" rel="noopener noreferrer"
                    className={`${styles.cta} ${styles.browseBtn}`}>
                    <BsInfoCircle className={styles.ctaSVG} />
                    Our Sources
                  </a>
                </div>
              </div>
            </div>
          </div>

          <Suspense fallback={<Loading />}>
            {/* Key change: Replace Routes with Switch for React Router v5 */}
            <Switch>
              <Route exact path="/" component={GameSelection} />
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