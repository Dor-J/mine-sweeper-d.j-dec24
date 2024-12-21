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
  secsPassed: 0,
  secInterval: 0,
  elSelectedCell: null,
  isFirstMove: false,
  livesCount: 0,
  hintsCount: 0,
  megaHintsCount: 0,
  isHintOn: false,
  isMegaHintOn: false,
  isOnce: false,
  safeClicks: 0,
  hasExterminatorUsed: false,
}

const gIcons = {
  mine: '💣', // 🕷👾👽
  explotion: '💥',
  flag: '🚩', //📎
  num1: '1️⃣',
  num2: '2️⃣',
  num3: '3️⃣',
  num4: '4️⃣',
  num5: '5️⃣',
  num6: '6️⃣',
  num7: '7️⃣',
  num8: '8️⃣',
  empty: ' ',
  happy: '😀',
  victory: '🥳',
  hintFace: '🧐',
  dead: '😵', //💀🤯
  mark: '😉',
  life: '🧡', //💻
  hint: '💡',
  exterminated: '✘',
  exterminate: '🤖',
}

function onInit() {
  if (gGame.isOn) stopTimer()

  setupGame()
  gBoard = buildBoard()

  renderBoard(gBoard)
  renderStats()
  updateHintsCounter()
}

function setupGame() {
  //  gGame reset
  gGame.isOn = false
  gGame.shownCount = 0
  gGame.markedCount = 0
  gGame.secsPassed = 0
  gGame.secInterval = 0
  gGame.elSelectedCell = null
  gGame.isFirstMove = false
  gGame.livesCount = 3
  gGame.hintsCount = 3
  gGame.megaHintsCount = 1
  gGame.isHintOn = false
  gGame.isMegaHintOn = false
  gGame.safeClicks = 3
  gGame.hasExterminatorUsed = false

  if (!gGame.isOnce) {
    getScoresFromStorage()
  }

  const elGameBoard = document.querySelector('.game-board')
  elGameBoard.classList.remove('game-over')
  closeModal()
}

function buildBoard() {
  const board = createEmptyBoard()
  setMines(board)
  setMinesNegsCount(board)
  return board
}

function renderBoard(board) {
  var classes = []
  var strHTML = '<table><tbody>'
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      const cell = board[i][j]

      var currIcon = gIcons.empty
      classes = []

      if (cell.isMine && !cell.isMarked) {
        classes.push('mine')
        currIcon = gIcons.mine
      } else if (cell.minesAroundCount > 0) {
        currIcon = gIcons[`num${cell.minesAroundCount}`]
      }
      if (!cell.isShown) {
        classes.push('not-shown')
      } else {
        classes.push('shown')
      }
      if (cell.isMarked) {
        classes.push('marked')
        currIcon = gIcons.flag
      }
      if (cell.isExterminated) {
        currIcon = gIcons.exterminated
      }
      const strClasses = classes.join(' ')

      strHTML += `<td class="cell ${strClasses}" 
                  data-i=${i} data-j=${j} 
                  onmousedown="onCellClicked(this, ${i},
                   ${j}, event)">
                    ${currIcon}
                  </td>`
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>'

  const elGameBoard = document.querySelector('.game-board')
  elGameBoard.innerHTML = strHTML
}

function onCellClicked(elCell, i, j, event) {
  if (
    !gGame.isOn &&
    gGame.shownCount + gGame.markedCount !== gLevel.SIZE ** 2
  ) {
    gGame.isOn = !gGame.isOn
    startTimer()
  }

  const cell = gBoard[i][j]

  if (cell.isShown) return // ignore shown cells

  if (gGame.isHintOn && gGame.isMegaHintOn) return
  if (gGame.isHintOn) {
    showHintClick(cell, elCell, i, j)
    return
  }
  if (gGame.isMegaHintOn) {
    handleMegaHintSelection(i, j)
    return
  }

  const isLeftClick = event.button === 0
  if (!isLeftClick) {
    onCellMarked(elCell)
    playSound('click-right')
    return
  } else {
    if (cell.isMarked) return //if marked only unmark is allowed
    playSound('click-left')
    elCell.classList.add('selected')
  }

  updateEmoji('happy')

  // Only a single cell should be selected
  if (gGame.elSelectedCell) {
    gGame.elSelectedCell.classList.remove('selected')
  }
  gGame.elSelectedCell = gGame.elSelectedCell !== elCell ? elCell : null

  if (gGame.elSelectedCell && !isLeftClick) {
    onCellMarked(elCell)
  } else if (isLeftClick) {
    if (cell.isMine) {
      cellIsMine(cell, elCell, i, j)
    } else if (cell.minesAroundCount > 0) {
      showCell(elCell, i, j)
    } else {
      //empty cell
      expandShown(gBoard, elCell, i, j)
    }
  }

  if (!gGame.isFirstMove) gGame.isFirstMove = true
  updateMinesCounter()
  checkGameOver()
}

function cellIsMine(cell, elCell, i, j) {
  if (!gGame.isFirstMove) {
    //set a different mine
    setMines(gBoard, true)

    //make cell non mine
    cell.isMine = false
    cell.isShown = true

    //update NegsCount for all cells because mine was moved
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)

    gGame.isFirstMove = true
    // showCell(elCell, i, j)
  } else {
    showCell(elCell, i, j)

    gGame.livesCount--
    updateLIfeCounter()

    if (gGame.livesCount <= 0) {
      elCell.innerText = gIcons.explotion
      updateEmoji('dead')
      playSound('losing')
      gameOver()
    }
  }
}

function onCellMarked(elCell) {
  // called when a cell is rightclicked
  updateEmoji('mark')
  const cuurI = parseInt(elCell.dataset.i)
  const cuurJ = parseInt(elCell.dataset.j)
  var currCell = gBoard[cuurI][cuurJ]

  if (currCell.isMarked) {
    // if currently flagged -> unflag
    currCell.isMarked = false
    gGame.markedCount--

    elCell.classList.remove('marked')

    elCell.innerText = currCell.prevCellIcon
      ? currCell.prevCellIcon
      : gIcons.empty

    currCell.prevCellIcon = null
  } else {
    currCell.isMarked = true
    gGame.markedCount++

    currCell.prevCellIcon = elCell.innerText

    elCell.classList.add('marked')
    elCell.innerText = gIcons.flag
  }

  updateMinesCounter()
  checkGameOver()
}

function expandShown(board, elCell, i, j) {
  const cell = board[i][j]
  if (cell.isShown || cell.isMarked) return

  // reveal the current cell
  showCell(elCell, i, j)

  // Stop recursion if the cell has mines around it
  if (cell.minesAroundCount > 0) return

  // iterate over negs to reveal recursively
  for (var rowIdx = i - 1; rowIdx <= i + 1; rowIdx++) {
    if (rowIdx < 0 || rowIdx >= board.length) continue

    for (var colIdx = j - 1; colIdx <= j + 1; colIdx++) {
      if (colIdx < 0 || colIdx >= board[0].length) continue
      if (rowIdx === i && colIdx === j) continue

      const elnegCell = document.querySelector(
        `.cell[data-i='${rowIdx}'][data-j='${colIdx}']`
      )

      expandShown(board, elnegCell, rowIdx, colIdx) // recursive
    }
  }
}

function checkGameOver() {
  // Game ends when all mines are marked, and all the other cells are shown
  const totalCells = gLevel.SIZE ** 2
  const totalMines = gLevel.MINES
  const exterminatedMines = countExterminatedMines()
  const revealedMines = countShownMines()
  const markedMines = countMarkedMines()

  const nonMineCellsShown = gGame.shownCount === totalCells - totalMines
  const allMinesAccounted =
    totalMines === revealedMines + markedMines + exterminatedMines

  if (allMinesAccounted && nonMineCellsShown) {
    gGame.isOn = false
    stopTimer()
    updateEmoji('victory')
    playSound('victory')
    addScore()
    renderVictoryModal()
    setTimeout(closeModal, 5000)
    return
  }
}

function gameOver() {
  stopTimer()
  gGame.isOn = false
  //reveal all mines
  revealAllMines()
  renderLoseModal()
  setTimeout(closeModal, 5000)

  const elGameBoard = document.querySelector('.game-board')
  elGameBoard.classList.add('game-over')
}

function onDifficultyClick(elDifBtn) {
  const size = parseInt(elDifBtn.dataset.size)
  const minesCount = parseInt(elDifBtn.dataset.mines)

  gameOver()
  highlightDifficultyBtn(elDifBtn)

  gLevel.SIZE = size
  gLevel.MINES = minesCount

  onInit()
}

function highlightDifficultyBtn(newDifBtn) {
  const currDifBtn = document.querySelector('.difficulty .highlight')
  currDifBtn.classList.remove('highlight')

  newDifBtn.classList.add('highlight')
}

function onSafeClick() {
  if (!gGame.isOn) return // game off
  if (gGame.safeClicks <= 0) return //no safe clicks abort

  const safeCells = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      const cell = gBoard[i][j]

      if (!cell.isMine && !cell.isShown && !cell.isMarked) {
        safeCells.push({ i, j })
      }
    }
  }

  if (!safeCells.length) return // no safe cells

  const randIdx = getRandomIntInclusive(0, safeCells.length - 1)

  const chosenPos = safeCells[randIdx]
  const elChosenCell = document.querySelector(
    `.cell[data-i="${chosenPos.i}"][data-j="${chosenPos.j}"]`
  )

  elChosenCell.classList.add('safe')
  setTimeout(() => {
    elChosenCell.classList.remove('safe')
  }, 3000)

  gGame.safeClicks--
  updateSafeClickCounter()
}

function onExterminatorClick() {
  if (gGame.hasExterminatorUsed) return
  gGame.hasExterminatorUsed = true

  removeMines(3)

  setMinesNegsCount(gBoard)
  renderBoard(gBoard)
  updateMinesCounter()

  playSound('exterminate')
  updateEmoji('exterminate')
}
