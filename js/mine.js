'use strict'

function setMines(board) {
  if (!board.length) return null

  var currMinesLeft = gLevel.MINES

  while (currMinesLeft > 0) {
    const randIdxI = getRandomIntInclusive(0, gLevel.SIZE)
    const randIdxJ = getRandomIntInclusive(0, gLevel.SIZE)

    var currCell = board[randIdxI][randIdxJ]
    if (currCell.isMine) continue

    currCell.isMine = true
    currMinesLeft--
  }
}

function setMinesNegsCount(board) {
  // Count mines around each cell and set the cell's minesAroundCount.
  for (let i = 0; i < gLevel.SIZE; i++) {
    for (let j = 0; j < gLevel.SIZE; j++) {
      var currCell = board[i][j]
      if (!currCell.isMine)
        currCell.minesAroundCount = mineNegsCount(board, currCell)
    }
  }
}

function mineNegsCount(board = gBoard, currCell) {
  const currI = currCell.location.i
  const currJ = currCell.location.j
  //   console.log('mineNegsCount start', 'i:', currI, 'j:', currJ, 'board', board)

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
  //   console.log('mineNegsCount', 'i:', currI, 'j:', currJ, mineNegsCount)

  return mineNegsCount
}
