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

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)
  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])
  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(3)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = () => {
    //Pega uma categoria aleatória
    const categories = Object.keys(words)
    const category =
     categories[Math.floor(Math.random() * Object.keys(categories).length)]
    //Pega uma palavra aleatória
    const word =
     words[category][Math.floor(Math.random() * words[category].length)]

    return { word, category }
  }

  //Inicia o jogo
  const startGame = () => {
    const { word, category } = pickWordAndCategory();
    //Separa as letras da palavra
    let wordLetters = word.split("")
    //Coloca todas as letras em caixa baixa
    wordLetters = wordLetters.map((l) => l.toLowerCase());
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)
    setGameStage(stages[1].name);
  }

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
    }
  }

  //Reinicia o jogo
  const retry = () => {
    setGameStage(stages[0].name);
  }

  console.log(words)

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
      {gameStage === 'end' && <GameOver retry={retry} />}
    </div>
  );
}

export default App;
