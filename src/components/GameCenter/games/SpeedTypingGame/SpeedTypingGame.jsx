import React, { useState, useEffect, useRef } from 'react';
import styles from './SpeedTypingGame.module.css';

const levelQuotes = {
  1: [
    "The quick brown fox jumps over the lazy dog",
    "All that glitters is not gold",
    "Time is money"
  ],
  2: [
    "To be or not to be, that is the question",
    "Life is what happens when you're busy making other plans",
    "Success is not final, failure is not fatal"
  ],
  3: [
    "I have a dream that one day this nation will rise up and live out the true meaning of its creed",
    "Ask not what your country can do for you, ask what you can do for your country",
    "The only thing we have to fear is fear itself"
  ],
  4: [
    "In three words I can sum up everything I've learned about life: it goes on. The road not taken makes all the difference",
    "Two roads diverged in a wood, and I took the one less traveled by, and that has made all the difference",
    "It was the best of times, it was the worst of times, it was the age of wisdom"
  ],
  5: [
    "It is not in the stars to hold our destiny but in ourselves. All the world's a stage, and all the men and women merely players",
    "To thine own self be true, and it must follow, as the night the day, thou canst not then be false to any man",
    "Life is like riding a bicycle. To keep your balance, you must keep moving forward and never look back"
  ],
  6: [
    "The only limit to our realization of tomorrow will be our doubts of today. Let us move forward with strong and active faith in the future",
    "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful",
    "Education is not preparation for life; education is life itself. What we learn with pleasure we never forget"
  ],
  7: [
    "The future belongs to those who believe in the beauty of their dreams. Do not wait to strike till the iron is hot; but make it hot by striking",
    "Change will not come if we wait for some other person or some other time. We are the ones we've been waiting for",
    "The greatest glory in living lies not in never falling, but in rising every time we fall and moving forward"
  ],
  8: [
    "Life is not about finding yourself. Life is about creating yourself. Every great dream begins with a dreamer. Always remember, you have within you the strength, the patience, and the passion",
    "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it",
    "Success usually comes to those who are too busy to be looking for it. The harder you work for something, the greater you'll feel when you achieve it"
  ],
  9: [
    "Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do. So throw off the bowlines. Sail away from the safe harbor. Catch the trade winds in your sails. Explore. Dream. Discover.",
    "The difference between ordinary and extraordinary is that little extra. Everything you've ever wanted is on the other side of fear. Success is walking from failure to failure with no loss of enthusiasm",
    "Your time is limited, don't waste it living someone else's life. Don't let the noise of others' opinions drown out your own inner voice"
  ],
  10: [
    "The only person you are destined to become is the person you decide to be. Watch your thoughts; they become words. Watch your words; they become actions. Watch your actions; they become habits. Watch your habits; they become character. Watch your character; it becomes your destiny.",
    "What lies behind us and what lies before us are tiny matters compared to what lies within us. And when we bring what is within out into the world, miracles happen. The future depends on what you do today.",
    "Life is not measured by the number of breaths we take, but by the moments that take our breath away. Every strike brings me closer to the next home run. The way to get started is to quit talking and begin doing."
  ]
};

const calculateTimeForLevel = (level) => {
  // Start with 30 seconds at level 1, decrease by 2 seconds per level
  return Math.max(30 - ((level - 1) * 2), 10);
};

const SpeedTypingGame = () => {
  const [gameState, setGameState] = useState('waiting');
  const [currentQuote, setCurrentQuote] = useState('');
  const [userInput, setUserInput] = useState('');
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(calculateTimeForLevel(1));
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [startTime, setStartTime] = useState(null);
  const [gameResult, setGameResult] = useState(null); // 'win' or 'lose'
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const getRandomQuote = (currentLevel) => {
    const quotes = levelQuotes[currentLevel];
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentQuote(getRandomQuote(level));
    setUserInput('');
    setTimeLeft(calculateTimeForLevel(level));
    setStartTime(Date.now());
    setWpm(0);
    setAccuracy(100);
    setGameResult(null);
    inputRef.current?.focus();

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          endGame('lose');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const endGame = (result = 'win') => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setGameState('results');
    setGameResult(result);
    calculateResults();
  };

  const nextLevel = () => {
    if (level < 10) {
      setLevel(prev => prev + 1);
      setGameState('waiting');
    }
  };

  const restartLevel = () => {
    setGameState('waiting');
  };

  const calculateAccuracy = (input) => {
    let correctChars = 0;
    const totalAttempted = Math.min(input.length, currentQuote.length);
    
    for (let i = 0; i < totalAttempted; i++) {
      if (input[i] === currentQuote[i]) {
        correctChars++;
      }
    }
    
    return totalAttempted > 0 
      ? Math.round((correctChars / totalAttempted) * 100) 
      : 100;
  };

  const calculateResults = () => {
    const timeElapsed = Math.max((Date.now() - startTime) / 1000 / 60, 0.1); // in minutes, minimum 0.1 to avoid division by zero
    const charCount = userInput.length;
    // Standard WPM calculation: (characters typed / 5) / time in minutes
    // where 5 is the average word length, ensure minimum of 1 WPM
    const calculatedWpm = Math.max(Math.round((charCount / 5) / timeElapsed), 1);
    setWpm(calculatedWpm);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Only allow adding new characters, no deletions
    if (value.length >= userInput.length) {
      setUserInput(value);
      setAccuracy(calculateAccuracy(value));

      // Compare trimmed versions to handle any extra spaces
      const trimmedValue = value.trim();
      const trimmedQuote = currentQuote.trim();
      
      if (trimmedValue === trimmedQuote) {
        console.log('Quote matched! Ending game...');
        endGame('win');
      }
    }
  };

  const handleKeyDown = (e) => {
    // Prevent backspace and delete keys
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    // Prevent paste
    e.preventDefault();
  };

  const getCharacterClass = (quoteChar, inputChar, index) => {
    if (index >= userInput.length) return '';
    return inputChar === quoteChar ? styles.correct : styles.incorrect;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.gameCard}>
        <div className={styles.levelIndicator}>
          Level {level} - {calculateTimeForLevel(level)}s
        </div>

        {gameState === 'waiting' && (
          <div className={styles.startScreen}>
            <h2>Speed Typing Game - Level {level}</h2>
            <p>Test your typing speed and accuracy</p>
            <p className={styles.instructions}>Complete the quote before time runs out!</p>
            <button className={styles.button} onClick={startGame}>
              Start Level {level}
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className={styles.gameScreen}>
            <div className={styles.stats}>
              <div className={styles.timer}>Time: {timeLeft}s</div>
              <div className={styles.accuracy}>
                Accuracy: {accuracy}%
              </div>
            </div>

            <div className={styles.quoteDisplay}>
              {currentQuote.split('').map((char, index) => (
                <span
                  key={index}
                  className={getCharacterClass(char, userInput[index], index)}
                >
                  {char}
                </span>
              ))}
            </div>

            <input
              ref={inputRef}
              className={styles.input}
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="Start typing..."
              autoFocus
            />

            <button 
              className={`${styles.button} ${styles.finishButton}`}
              onClick={() => endGame('lose')}
            >
              Give Up
            </button>
          </div>
        )}

        {gameState === 'results' && (
          <div className={styles.resultsScreen}>
            <h2>{gameResult === 'win' ? `Level ${level} Complete!` : 'Time\'s Up!'}</h2>
            <div className={styles.results}>
              <p>WPM: {wpm}</p>
              <p>Accuracy: {accuracy}%</p>
            </div>
            {gameResult === 'win' && accuracy >= 80 && wpm >= 30 ? (
              <button className={styles.button} onClick={nextLevel}>
                {level < 10 ? 'Next Level' : 'You Beat All Levels!'}
              </button>
            ) : (
              <button className={styles.button} onClick={restartLevel}>
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeedTypingGame;
