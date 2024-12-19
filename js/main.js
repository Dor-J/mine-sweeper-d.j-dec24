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
  isFirstMove: false,
  livesCount: 0,
  hintsCount: 0,
  isHintOn: false,
}

const gIcons = {
  mine: '💣', //🕷👾👽
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
  dead: '💀',
  mark: '😉',
  life: '🧡', //💻
  hint: '💡',
}

function onInit() {
  if (gGame.isOn) stopTimer()

  setupGame()
  gBoard = buildBoard()
  //   console.log('gBoard after build', gBoard)

  renderBoard(gBoard)
  renderStats()
  updateHintsCounter()
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
  gGame.isFirstMove = false
  gGame.livesCount = 3
  gGame.hintsCount = 3
  gGame.isHintOn = false

  closeModal()
}

function buildBoard() {
  const board = createEmptyBoard()
  setMines(board)
  setMinesNegsCount(board)
  return board
}

function renderBoard(board) {
  var strHTML = '<table><tbody>'
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
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

  if (gGame.isHintOn) {
    showHintClick(cell)
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
    showCell(elCell, i, j)
  } else {
    showCell(elCell, i, j)
    elCell.innerText = gIcons.explotion
    gGame.livesCount--
    updateLIfeCounter()

    if (gGame.livesCount <= 0) {
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
    currCell.isMarked = false
    gGame.markedCount--

    elCell.classList.remove('marked')
    elCell.innerText = currCell.prevCellIcon
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

      const negCell = board[rowIdx][colIdx]
      const elnegCell = document.querySelector(
        `.cell[data-i='${rowIdx}'][data-j='${colIdx}']`
      )

      expandShown(board, elnegCell, rowIdx, colIdx) // recursive
    }
  }
}

function checkGameOver() {
  // Game ends when all mines are marked, and all the other cells are shown
  if (
    gGame.markedCount === gLevel.MINES &&
    gGame.shownCount + gGame.markedCount === gLevel.SIZE ** 2
  ) {
    gGame.isOn = false
    stopTimer()
    updateEmoji('victory')
    playSound('victory')
    renderVictoryModal()
    setTimeout(closeModal, 6000)
  }
}

function gameOver() {
  stopTimer()
  //reveal all mines
  revealAllMines()
  renderLoseModal()
  setTimeout(closeModal, 6000)
}

function renderStats() {
  const elMinesCounter = document.querySelector('.mines-count h3 span')
  elMinesCounter.innerText = gLevel.MINES - gGame.markedCount
  const elTimer = document.querySelector('.timer h3 span')
  elTimer.innerText = '00 : 00'
  const elEmoji = document.querySelector('.stats .emoji')
  elEmoji.innerText = gIcons.happy
  const elLifeCounter = document.querySelector('.stats .lives h3 span')
  elLifeCounter.innerText = `${gIcons.life} ${gIcons.life} ${gIcons.life}`
}

function updateTimer() {
  const elTimer = document.querySelector('.timer h3 span')
  elTimer.innerText = getTime()
}

function updateLIfeCounter() {
  const elLifeCounter = document.querySelector('.stats .lives h3 span')
  var lifeCounter = ''
  for (var i = 0; i < gGame.livesCount; i++) {
    lifeCounter += gIcons.life + ' '
  }
  elLifeCounter.innerText = lifeCounter
}

function updateMinesCounter() {
  const elMinesCounter = document.querySelector('.mines-count h3 span')
  elMinesCounter.innerText = gLevel.MINES - gGame.markedCount
}

function updateEmoji(mood = 'happy') {
  const elEmojiSpan = document.querySelector('.stats .emoji ')

  var icon = ''
  if (!mood) retuen
  switch (mood) {
    case 'mark':
      icon = gIcons.mark
      break
    case 'victory':
      icon = gIcons.victory
      break
    case 'dead':
      icon = gIcons.dead
      break
    case 'happy':
      icon = gIcons.happy
      break
  }

  elEmojiSpan.innerText = icon
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

function onUndoClick() {
  // TODO:
}

/******************** Hint *********************/
function onHintClick() {
  gGame.isHintOn = !gGame.isHintOn
  const elHintCounter = document.querySelector('.hints h3 span')
  elHintCounter.classList.toggle('highlight')
}

function updateHintsCounter() {
  const elHintCounter = document.querySelector('.hints h3 span')
  var hintCounter = ''
  for (var i = 0; i < gGame.livesCount; i++) {
    hintCounter += gIcons.hint + ' '
  }

  elHintCounter.classList.remove('highlight')
  elHintCounter.innerText = hintCounter
}

function showHintClick(currCell) {
  if (!gGame.isHintOn) return //if on than exit

  const cuurI = parseInt(elCell.dataset.i)
  const cuurJ = parseInt(elCell.dataset.j)

  for (var i = currI - 1; i <= currI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue
    for (var j = currJ - 1; j <= currJ + 1; j++) {
      if (j < 0 || j >= gBoard[0].length) continue
      const elCell = document.querySelector(
        `.cell[data-i='${rowIdx}'][data-j='${colIdx}']`
      )
      hintReveal(elCell)
    }
  }

  updateHintsCounter()
  gGame.isHintOn = !gGame.isHintOn //turn off
}

function hintReveal(elCell) {
  elCell.classList.remove('not-shown')
  elCell.classList.add('shown')
  setTimeout(hintClose, 3000, elCell)
}

function hintClose(elCell) {
  elCell.classList.add('not-shown')
  elCell.classList.remove('shown')
}
