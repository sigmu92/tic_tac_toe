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


function GameController() {

  const board = Gameboard();
  const players = []
  

  const addPlayer = (name, marker) => {
    players.push(Player(name, marker))
  }
  
  let computerPlayer = false;
  let gameOver = false;
  let activePlayer = 0;


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
    if (activePlayer == 0) {
      activePlayer = 1;
    } else {
      activePlayer = 0;
    }

  }
  const getGameOver = () => gameOver;
  const getActivePlayer = () => players[activePlayer]

  const playRound = () => {
    if (checkWinner()) {
      return (`${getActivePlayer().getName()} Won!`)
    } else if (checkTie()) {
      return ("It's a Tie!")
    } else{
      changeTurns()
      return (`It's ${getActivePlayer().getName()}'s Turn`)
    }
  }

  return {
    addPlayer,
    getActivePlayer,
    getGameOver,
    playRound,
    computerPlayer,
    board
  }
};


const displayController  = (() => {
  const boardDiv = document.querySelector(".board")
  const winLabelDiv = document.querySelector(".win-label")
  const playerButton = document.querySelector('.player');
  const computerButton = document.querySelector('.computer');


  const updateLabel = (label,message) => {
    label.textContent = message
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
        createCell(i,j)
      }
    }
  }

  const createCell = (row,column) => {
    const cell = document.createElement('button')
      cell.dataset.column = `${column}`
      cell.dataset.row = `${row}`
      cell.classList.add('cell')
      cell.textContent = currentBoard[row][column].getValue()
      cell.addEventListener('click', takeInput)
      boardDiv.appendChild(cell)
  }

  const takeInput = (e) => {
    if (e.target.textContent != "" || game.getGameOver())  {
      return
    } else {
      currentBoard = game.board.getBoard()
      activePlayer = game.getActivePlayer()
      let i = parseInt(e.target.dataset.row)
      let j = parseInt(e.target.dataset.column)
      currentBoard[i][j].setValue(activePlayer.getMarker())
      refreshBoard()
      let message = game.playRound()
      updateLabel(winLabelDiv, message)
  
    }
  }

  playerButton.addEventListener('click', () => {
    game = GameController()
    //Get First Name
    let name = prompt("Enter first player's name: ")
    while (name == '' || name == null) {
      name = prompt("Enter first player's name: ") 
    }
    game.addPlayer(name, "X")
    //Get Second Name
    name = prompt("Enter second player's name: ")
    while (name == '' || name == null) {
      name = prompt("Enter second player's name: ")
    }
    game.addPlayer(name, "O")
    updateLabel(winLabelDiv, `It's ${game.getActivePlayer().getName()}'s Turn`)
    refreshBoard()
    return game
  })

  computerButton.addEventListener('click', () => {
    game = GameController()
    //Get Player Name
    let name = prompt("Enter the player's name: ")
    while (name == '' || name == null) {
      name = prompt("Enter first player's name: ") 
    }
    game.addPlayer(name, "X")
    game.addPlayer('Computer', "O")
    game.computerPlayer = true;
    updateLabel(winLabelDiv, `It's ${game.getActivePlayer().getName()}'s Turn`)
    refreshBoard()
    return game
  })

  const refreshBoard = () => {
    clearBoard()
    createBoard()
  }

  
})()



