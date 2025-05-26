import React, { lazy, Suspense } from 'react';
// import { Switch, Route, Link } from 'react-router-dom';
import { GameProvider } from './shared/GameContext';
import styles from './GameCenter.module.css';
import { FaGithub, FaLinkedin, FaDice, FaGamepad, FaBook } from 'react-icons/fa';
import { IoEnterOutline } from 'react-icons/io5';
import { BiGitBranch } from 'react-icons/bi';
import { MdSpeed } from 'react-icons/md';
import { AiOutlineCode } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';

// Lazy load game components
const PuzzleGame = lazy(() => import('./games/PuzzleGame'));
const ArcadeGame = lazy(() => import('./games/ArcadeGame'));
const GameSelection = lazy(() => import('./components/GameSelection'));
const BlogHome = lazy(() => import('./blog/BlogHome'));

const GameCenter = () => {
  const handleBrowse = (e) => {
    e.preventDefault();
    window.location.href = "/games";
  };

  const handlePlayDice = (e) => {
    e.preventDefault();
    const games = ["puzzle", "arcade"];
    const randomIndex = Math.floor(Math.random() * games.length);
    window.location.href = `/games/${games[randomIndex]}`;
  };

  return (
    <GameProvider>
      <div className={styles.main}>
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
                >
                  <FaDice className={styles.ctaSVG} />
                  Random Game
                </button>
                <a href="https://github.com/HoseaCodes" target="_blank" rel="noopener noreferrer" className={styles.cta}>
                  <FaGithub className={styles.ctaSVG} />
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/dominique-hosea" target="_blank" rel="noopener noreferrer" className={`${styles.cta} ${styles.lastChild}`}>
                  <FaLinkedin className={`${styles.ctaSVG} ${styles.linkedin}`} />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            <div className={styles.right}>
              <div className={styles.buttonsRight}>
                <h2>Quick Navigation</h2>
                {/* <Link to="/games/puzzle" className={`${styles.cta} ${styles.browseBtn}`}>
                  <FaGamepad className={styles.ctaSVG} />
                  Puzzle Game
                </Link>

                <Link to="/games/arcade" className={`${styles.cta} ${styles.browseBtn}`}>
                  <FaGamepad className={styles.ctaSVG} />
                  Arcade Game
                </Link>

                <Link to="/blog" className={`${styles.cta} ${styles.browseBtn}`}>
                  <FaBook className={styles.ctaSVG} />
                  Blog
                </Link> */}

                <a href="https://github.com/HoseaCodes/Blog/commits/main" target="_blank" rel="noopener noreferrer" className={`${styles.cta} ${styles.browseBtn}`}>
                  <BiGitBranch className={styles.ctaSVG} />
                  Commit Log
                </a>

                <a href="https://github.com/HoseaCodes/Blog/blob/main/README.md#performance" target="_blank" rel="noopener noreferrer" className={`${styles.cta} ${styles.browseBtn}`}>
                  <MdSpeed className={styles.ctaSVG} />
                  Performance
                </a>

                <a href="https://github.com/HoseaCodes/Blog/blob/main/README.md#technologies-used" target="_blank" rel="noopener noreferrer" className={`${styles.cta} ${styles.browseBtn}`}>
                  <AiOutlineCode className={styles.ctaSVG} />
                  Technologies
                </a>

                <a href="https://github.com/HoseaCodes/Blog/blob/main/README.md#sources" target="_blank" rel="noopener noreferrer" className={`${styles.cta} ${styles.browseBtn}`}>
                  <BsInfoCircle className={styles.ctaSVG} />
                  Our Sources
                </a>
              </div>
            </div>
          </div>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          {/* <Switch>
            <Route exact path="/" component={GameSelection} />
            <Route path="/games/puzzle" component={PuzzleGame} />
            <Route path="/games/arcade" component={ArcadeGame} />
            <Route path="/games" component={GameSelection} />
            <Route path="/blog" component={BlogHome} />
          </Switch> */}
        </Suspense>
      </div>
    </GameProvider>
  );
};

export default GameCenter;