// js/main.js
'use strict'

// Globals

//The model
var gBoard

const gLevel = {
  SIZE: 4,
  MINES: 2,
}

const gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  minesLeft: 0,
  secsPassed: 0,
  secInterval: 0,
  elSelectedCell: null,
}

const gIcons = {
  mine: '💣',
  explotion: '💥',
  flag: '📎',
  num1: '1️⃣',
  num2: '2️⃣',
  num3: '3️⃣',
  num4: '4️⃣',
  num5: '5️⃣',
  num6: '6️⃣',
  num7: '7️⃣',
  num8: '8️⃣',
  empty: ' ',
}

function onInit() {
  setupGame()
  gBoard = buildBoard()
  //   console.log('gBoard after build', gBoard)

  renderBoard(gBoard)
}

function setupGame() {
  //   console.log('setupGame start')

  //  gGame reset
  gGame.isOn = false
  gGame.shownCount = 0
  gGame.minesLeft = gLevel.MINES
  gGame.markedCount = 0
  gGame.secsPassed = 0
  gGame.secInterval = 0
  gGame.elSelectedCell = null
}

function buildBoard() {
  //   console.log('buildBoard start')

  // Builds the board
  const board = createEmptyBoard()
  //   console.log('board', board)

  // Set the mines
  // TODO: setMines(board)
  board[1][3].isMine = true
  board[3][2].isMine = true
  board[0][2].isMine = true

  // Call setMinesNegsCount()
  setMinesNegsCount(board)
  //   console.log('board after mines neg count', board)

  // Return the created board
  return board
}

function renderBoard(board) {
  //   console.log('renderBoard start', 'board:', board)

  // Render the board as a <table> to the page

  let strHTML = '<table><tbody>'
  for (let i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (let j = 0; j < board[0].length; j++) {
      const cell = board[i][j]
      const dataLocation = { i, j }
      var currIcon = gIcons.empty
      var classes = ''

      if (cell.isMine && !cell.isMarked) {
        classes += ' mine'
        currIcon = gIcons.mine
      } else if (cell.minesAroundCount > 0) {
        currIcon = gIcons[`num${cell.minesAroundCount}`]
      }
      if (!cell.isShown) {
        classes += ' not-shown'
      } else {
        classes += ' shown'
      }
      if (cell.isMarked) {
        classes += ' marked'
        currIcon = gIcons.flag
      }

      strHTML += `<td class="cell${classes}" data-i=${dataLocation.i} data-j=${dataLocation.j} onmousedown="onCellClicked(this, ${dataLocation.i}, ${dataLocation.j},event)">${currIcon}</td>`
      //   console.log('strHTML', 'i:', i, 'j:', j, strHTML)
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>'

  const elGameBoard = document.querySelector('.game-board')
  elGameBoard.innerHTML = strHTML
}

function onCellClicked(elCell, i, j, event) {
  // first click starts the game
  if (!gGame.isOn && gGame.minesLeft > 0) {
    gGame.isOn = !gGame.isOn
    startTimer()
  }

  const cell = gBoard[i][j]

  // ignore shown cells
  if (!cell.isShown) return

  // Called when a cell is clicked
  console.log('onCellClicked', elCell)
  const isLeftClick = event.button === 0
  console.log('isLeftClick', isLeftClick)
  if (!isLeftClick) {
    onCellMarked(elCell)
    return
  } else {
    // Selecting a seat
    elCell.classList.add('selected')
  }

  // Only a single cell should be selected
  if (gGame.elSelectedCell) {
    gGame.elSelectedCell.classList.remove('selected')
  }
  gGame.elSelectedCell = gGame.elSelectedCell !== elCell ? elCell : null

  // When seat is selected a popup is shown
  if (gGame.elSelectedCell && !isLeftClick) {
    onCellMarked(elCell)
  } else if (isLeftClick) {
    if (cell.isMine) {
      showCell(elCell, i, j)
      gameOver()
    } else if (cell.minesAroundCount > 0) {
      showCell(elCell, i, j)
    } else {
      //empty cell
      expandShown(gBoard, elCell, i, j)
    }
  }
}
function onCellMarked(elCell) {
  // Called when a cell is rightclicked See how you can hide the context menu on right click
  const cuurI = elCell.dataset.i
  const cuurJ = elCell.dataset.j
  currCell = gBoard[cuurI][cuurJ]

  if (currCell.isMarked) {
    currCell.isMarked = false
    gGame.markedCount--

    elCell.classList.remove('marked')
  } else {
    currCell.isMarked = true
    gGame.markedCount++

    elCell.classList.add('marked')
  }
}
function expandShown(board, elCell, i, j) {
  // When user clicks a cell with no
  // mines around, we need to open
  // not only that cell, but also its
  // neighbors.
  // NOTE: start with a basic
  // implementation that only opens
  // the non-mine 1st degree
  // neighbors
  // BONUS: if you have the time
  // later, try to work more like the
  // real algorithm (see description
  // at the Bonuses section below)
}

function checkGameOver() {
  // Game ends when all mines are marked, and all the other cells are shown
  if (gGame.minesLeft === 0) {
    gGame.isOn = false
    stopTimer()
    //TODO:finish
  }
}

function gameOver() {
  stopTimer()
  //reveal all board
  revealAllBoard()
}

function revealAllBoard() {
  const board = gBoard
}
