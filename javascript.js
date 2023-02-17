function Gameboard() {

  let board = [];

  for (let i = 0; i<3; i++){
    board[i] = [];
    for (let j = 0; j<3; j++) {
      board[i].push(Cell())
    }
  }

  const getBoard = () => board;
  

  return {
    getBoard
  }
}


function Cell() {
  let value = "";
  
  const setValue = (marker) => {
    value = marker;
  }

  const getValue = () => value;

  return {
    setValue,
    getValue
  }
}

function Player(name,marker) {
  const getName = () => name;
  const getMarker = () => marker;
  return {
    getName,
    getMarker
  }
}

const player1 = Player("Max", "X");
const player2 = Player("Meg", 'O');



function GameController() {

  const board = Gameboard();
  const player1 = Player("Max", "X");
  const player2 = Player("Meg", 'O');

  let gameOver = false;
  let activePlayer = player1;


  const checkWinner = () => {
    let currentBoard = board.getBoard()
    //Check rows for a winning condition
    for (let i = 0; i<3; i++) {
      if (currentBoard[i][0].getValue() == currentBoard[i][1].getValue() && currentBoard[i][1].getValue() == currentBoard[i][2].getValue() && currentBoard[i][0].getValue() != "") {
        gameOver = true;
        return true;
        
      }
    }
    //Check columns for a winning condition
    for (let i = 0; i<3; i++){
      if (currentBoard[0][i].getValue() == currentBoard[1][i].getValue() && currentBoard[1][i].getValue() == currentBoard[2][i].getValue() && currentBoard[0][i].getValue() != "") {
        gameOver = true;
        return true;
      }
    }
    //Check diagonals for a winning condition
    if (currentBoard[0][0].getValue() == currentBoard[1][1].getValue() && currentBoard[1][1].getValue() == currentBoard[2][2].getValue() && currentBoard[0][0].getValue() != "") {
      gameOver = true;
      return true;
    } else if (currentBoard[2][0].getValue() == currentBoard[1][1].getValue() && currentBoard[1][1].getValue() == currentBoard[0][2].getValue() && currentBoard[1][1].getValue() != "") {
      gameOver = true;
      return true;
    } 
    //Return false if no winning condition is met
    return false;
  }

  const checkTie = () => {
    let currentBoard = board.getBoard()
    for (let i = 0; i<3; i++){
      for (let j = 0; j < 3; j++) {
        if (currentBoard[i][j].getValue() == ""){
          return false
        }
        
      }
    }
    gameOver = true;
    return true
  }

  const changeTurns = () => {
    if (activePlayer == player1) {
      activePlayer = player2;
    } else {
      activePlayer = player1;
    }

  }
  const getGameOver = () => gameOver;
  const getActivePlayer = () => activePlayer

  return {
    checkWinner,
    checkTie,
    changeTurns,
    getActivePlayer,
    getGameOver,
    board
  }
};


const displayController  = (() => {
  const boardDiv = document.querySelector(".board")
  const gameLabelDiv = document.querySelector(".game-label")


  const updateLabel = (message) => {
    gameLabelDiv.textContent = message
  }

  const clearBoard = () => {
    while (boardDiv.firstChild) {
      boardDiv.lastChild.remove()
    }
  }

  const createBoard = () => {
    currentBoard =game.board.getBoard()
    for (let i = 0; i<3; i++){
      for (let j = 0; j < 3; j++) {
        let cell = document.createElement('button')
        cell.dataset.column = `${j}`
        cell.dataset.row = `${i}`
        cell.classList.add('cell')
        cell.textContent = currentBoard[i][j].getValue()
        cell.addEventListener('click', takeInput)
        boardDiv.appendChild(cell)
      }
    }
  }

  const takeInput = (e) => {
    console.log(e.target)
    if (e.target.textContent != "" || game.getGameOver())  {
      return
    } else {
      currentBoard = game.board.getBoard()
      activePlayer = game.getActivePlayer()
      let i = parseInt(e.target.dataset.row)
      let j = parseInt(e.target.dataset.column)
      currentBoard[i][j].setValue(activePlayer.getMarker())
      refreshBoard()
      if (game.checkWinner()) {
        updateLabel(`${activePlayer.getName()} Won!`)
      } else if (game.checkTie()) {
        updateLabel("It's a Tie!")
      } else{
        game.changeTurns()
        updateLabel(`It's ${game.getActivePlayer().getName()}'s Turn`);
      }
      
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.keyCode == 78) {
      game = GameController()
      updateLabel(`It's ${game.getActivePlayer().getName()}'s Turn`)
      refreshBoard()
      return game
    } else {
      return
    }
  })

  const refreshBoard = () => {
    clearBoard()
    createBoard()
  }

  
})()



