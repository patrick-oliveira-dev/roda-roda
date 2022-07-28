//CSS
import './App.css';

//React
import { useCallback, useEffect, useState } from 'react';

//Data
import {wordsList} from "./data/words"

//Components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  { id: 1, name: "start"},
  { id: 2, name: "game"},
  { id: 3, name: "end"}
]

const guessesQty = 8

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)
  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])
  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    //Pega uma categoria aleatória
    const categories = Object.keys(words)
    const category =
     categories[Math.floor(Math.random() * Object.keys(categories).length)]
    //Pega uma palavra aleatória
    const word =
     words[category][Math.floor(Math.random() * words[category].length)]

    return { word, category }
  },[words])

  //Inicia o jogo
  const startGame = useCallback(() => {
    clearLetterStates()
    const { word, category } = pickWordAndCategory();
    //Separa as letras da palavra
    let wordLetters = word.split("")
    //Coloca todas as letras em caixa baixa
    wordLetters = wordLetters.map((l) => l.toLowerCase());
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)
    setGameStage(stages[1].name);
  }, [pickWordAndCategory])

  //Processa letras do input
  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase()
    //verifica se a letra já foi utilizada
    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return
    }
    if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters, normalizedLetter,
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters, normalizedLetter,
      ])
      setGuesses((actualGuesses) => actualGuesses -1)
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])

  }

  //Verifica condição de derrota
  useEffect(() => {
    if (guesses <= 0) {
      //resetar o jogo
      clearLetterStates()

      setGameStage(stages[2].name)
    }
  }, [guesses])

  //Verifica condição de vitória
  useEffect(() => {
    const uniqueLetters = [... new Set(letters)]
    if(guessedLetters.length === uniqueLetters.length) {
      setScore((actualScore) => actualScore + 100)
      setGuesses(guessesQty)
      startGame()
    }
  }, [guessedLetters, letters, startGame])

  //Reinicia o jogo
  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)
    setGameStage(stages[0].name);
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && (
      <Game
        verifyLetter={verifyLetter}
        pickedWord={pickedWord}
        pickedCategory={pickedCategory}
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}
        />
         )}
      {gameStage === 'end' && <GameOver retry={retry} score={score} pickedWord={pickedWord} />}
    </div>
  );
}

export default App;
