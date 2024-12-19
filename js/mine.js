'use strict'

function setMines(board, isOnlyOne = false) {
  if (!board) return null
  // console.log(board)
  var currMinesLeft = gLevel.MINES
  if (isOnlyOne) currMinesLeft = 1

  while (currMinesLeft > 0) {
    const randIdxI = parseInt(getRandomIntInclusive(0, board.length - 1))
    const randIdxJ = parseInt(getRandomIntInclusive(0, board[0].length - 1))
    // console.log(randIdxI, randIdxJ)

    var currCell = board[randIdxI][randIdxJ]
    // console.log('currCell', currCell)

    if (currCell.isMine) continue
    // console.log('currCell not mine', currCell)

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
  // console.log('mineNegsCount start', 'i:', currI, 'j:', currJ, 'board', board)

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
