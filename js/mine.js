'use strict'

function setMines(board, isOnlyOne = false) {
  if (!board) return null
  var currMinesLeft = gLevel.MINES
  if (isOnlyOne) currMinesLeft = 1

  while (currMinesLeft > 0) {
    const randIdxI = parseInt(getRandomIntInclusive(0, board.length - 1))
    const randIdxJ = parseInt(getRandomIntInclusive(0, board[0].length - 1))

    var currCell = board[randIdxI][randIdxJ]

    if (currCell.isMine) continue

    currCell.isMine = true
    if (isOnlyOne) {
      renderCell(currCell, null, randIdxI, randIdxJ)
    }
    currMinesLeft--
  }
}

function setMinesNegsCount(board) {
  // Count mines around each cell and set the cell's minesAroundCount.
  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {
      var currCell = board[i][j]
      if (!currCell.isMine)
        currCell.minesAroundCount = mineNegsCount(board, currCell)
    }
  }
}

function mineNegsCount(board = gBoard, currCell) {
  const currI = currCell.location.i
  const currJ = currCell.location.j

  var mineNegsCount = 0

  for (var i = currI - 1; i <= currI + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = currJ - 1; j <= currJ + 1; j++) {
      if (i === currI && j === currJ) continue
      if (j < 0 || j >= board[0].length) continue
      var currInnerCell = board[i][j]
      if (currInnerCell.isMine) mineNegsCount++
    }
  }

  return mineNegsCount
}

function revealAllMines() {
  const board = gBoard
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      const currCell = board[i][j]
      if (currCell.isMarked) continue
      if (currCell.isMine) {
        const elMineCell = document.querySelector(
          `[data-i='${i}'][data-j='${j}']`
        )
        showCell(elMineCell, i, j)
      }
    }
  }
}

function countMarkedMines() {
  var correctlyMarkedMines = 0
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      const cell = gBoard[i][j]
      if (cell.isMarked && cell.isMine && !cell.isShown) {
        correctlyMarkedMines++
      }
    }
  }
  return correctlyMarkedMines
}

function countShownMines() {
  var shownMines = 0
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      const cell = gBoard[i][j]
      // If it's a mine and it is shown and not marked
      if (cell.isMine && cell.isShown && !cell.isMarked) shownMines++
    }
  }
  return shownMines
}

function getMinesLeft() {
  const flaggedMines = countMarkedMines()
  const revealedMines = countShownMines()
  const exterminatedMines = countExterminatedMines()

  // subtract accounted (flagged + revealed) from total
  const minesLeft =
    gLevel.MINES - (flaggedMines + revealedMines + exterminatedMines)

  // never display negative
  return minesLeft
}

function removeMines(count) {
  const minePoss = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      const cell = gBoard[i][j]
      if (cell.isMine && !cell.isExterminated && !cell.isMarked) {
        minePoss.push({ i, j })
      }
    }
  }

  const maxRemovable = Math.min(count, minePoss.length)

  for (var idx = 0; idx < maxRemovable; idx++) {
    const randIdx = getRandomIntInclusive(0, minePoss.length - 1)

    const { i, j } = minePoss.splice(randIdx, 1)[0] // remove from array

    const cell = gBoard[i][j]
    cell.isMine = false
    cell.isExterminated = true
    cell.isShown = true
  }
}

function countExterminatedMines() {
  let exterminatedMines = 0
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[0].length; j++) {
      const cell = gBoard[i][j]
      if (cell.isExterminated) exterminatedMines++
    }
  }
  return exterminatedMines
}
