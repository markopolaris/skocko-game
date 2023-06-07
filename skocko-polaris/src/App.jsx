import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const symbols = ['♣️', '♠️', '♥️', '♦️', '★', '🃏'];
  const [guesses, setGuesses] = useState(Array.from({ length: 6 }, () => Array.from({ length: 4 }, () => '')));
  const [secret, setSecret] = useState([]);
  const [hints, setHints] = useState(Array.from({ length: 6 }, () => Array.from({ length: 4 }, () => 'white')));
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0);
  const [showSecret, setShowSecret] = useState(true);
  
  useEffect(() => {
    generateSecret();
  }, []);

  //generisemo tajni niz
  const generateSecret = () => {
    const randomSymbols = symbols.sort(() => 0.5 - Math.random());
    const secretSymbols = randomSymbols.slice(0, 4);
    setSecret(secretSymbols);
  };

  //funkcija koja se odradi kadae kliknemo na simbol
  const handleSymbolClick = (symbol) => {
    const currentGuess = [...guesses[currentGuessIndex]];
    const emptyIndex = currentGuess.findIndex((field) => field === '');

    //ako postoji prazno polje u guessu/pokusaju dodajemo mu simbol
    if (emptyIndex !== -1) {
      currentGuess[emptyIndex] = symbol;
      const updatedGuesses = [...guesses];
      updatedGuesses[currentGuessIndex] = currentGuess;
      setGuesses(updatedGuesses);

      //ako su sva polja popunjena ne mozemo da unosimo vise, tj ne moze da predje
      if (currentGuess.every((field) => field !== '')) {
        const symbolElements = document.querySelectorAll('.symbol');
        symbolElements.forEach((element) => {
          element.style.pointerEvents = 'none';
        });
      }
    }
  };

  //funkcija za brisanje na simbola na klik
  const handleDeleteClick = () => {
    const updatedGuesses = [...guesses];
    const currentGuess = updatedGuesses[currentGuessIndex];
    const lastFilledIndex = currentGuess.slice().reverse().findIndex((field) => field !== '');
    const lastFilledIndexFromEnd = lastFilledIndex >= 0 ? currentGuess.length - 1 - lastFilledIndex : -1;
    
    //ako smo uneli neki simbol brisemo poslednji simbol iz guessa/pokusaja
    if (lastFilledIndexFromEnd !== -1) {
      currentGuess[lastFilledIndexFromEnd] = '';
      setGuesses(updatedGuesses);
    }
  };


  //funkcija koja se poziva kada hocu da proverim svoj pokusaj
  const checkGuess = () => {
    const currentGuess = guesses[currentGuessIndex];
    if (currentGuess.some((field) => field === '')) {
      alert('unesi sva polja');
    } else {
      const newHints = generateHints(currentGuess);
      const updatedHints = [...hints];
      updatedHints[currentGuessIndex] = newHints;
      setHints(updatedHints);

      if (currentGuess.join('') === secret.join('')) {
        alert('tacna kombinacija');
        setShowSecret(true);
      } else {
        const allGuessesFilled = guesses.every((guess) => guess.every((field) => field !== ''));
        if (allGuessesFilled) {
          alert('netacna kombinacija');
          setShowSecret(true);
        } else {
          setCurrentGuessIndex((prevIndex) => prevIndex + 1);
          const symbolElements = document.querySelectorAll('.symbol');
          symbolElements.forEach((element) => {
            element.style.pointerEvents = 'auto';
          });
        }
      }
    }
  };

  //funkcija koja proverava simbole
  const generateHints = (guess) => {
    const newHints = [];
    const secretCopy = [...secret];

    guess.forEach((symbol, index) => {
      if (symbol === secretCopy[index]) {
        newHints.push('red');
        secretCopy[index] = null;
      }
    });

    guess.forEach((symbol, index) => {
      if (symbol !== secretCopy[index] && secretCopy.includes(symbol)) {
        newHints.push('yellow');
        const secretIndex = secretCopy.indexOf(symbol);
        secretCopy[secretIndex] = null;
      }
    });

    return newHints.concat(Array.from({ length: 4 - newHints.length }, () => 'white'));
  };

  return (
    <>
      <h1>SKOCKO</h1>
      <div className="game-frame">
        <div className="guesses">
          {guesses.map((guess, guessIndex) => (
            <div className="guess" key={guessIndex}>
              {guess.map((symbol, fieldIndex) => (
                <div className="field" key={fieldIndex} onClick={() => handleSymbolClick(symbol)}>
                  {symbol}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="hints">
          {hints.map((hint, hintIndex) => (
            <div className="hint-row" key={hintIndex}>
              {hint.map((color, colorIndex) => (
                <div className={`hint-symbol ${color}`} key={colorIndex}></div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {showSecret && (
          <div className="secret">
            {secret.map((symbol, index) => (
              <div className="field" key={index}>
                {symbol}
              </div>
            ))}
          </div>
        )}

      <div className="buttons">
        <button id="delete" onClick={handleDeleteClick}>
          Delete
        </button>
        <button id="confirm" onClick={checkGuess}>
          Confirm
        </button>
      </div>

      <div className="symbols">
        {symbols.map((symbol, index) => (
          <div className="symbol" key={index} onClick={() => handleSymbolClick(symbol)}>
            {symbol}
          </div>
        ))}
      </div>
    </>
  );
};

export default App;