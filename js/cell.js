// js/cell.js
'use strict'

function createCell(i, j) {
  const cell = {
    minesAroundCount: 0,
    isShown: false,
    isMine: false,
    isMarked: false,
    location: { i, j },
    prevCellIcon: null,
    isExterminated: false,
  }
  return cell
}

function showCell(elCell, i, j) {
  const cell = gBoard[i][j]
  if (cell.isShown) return

  elCell.classList.remove('not-shown')
  elCell.classList.add('shown')

  cell.isShown = true

  // increment shownCount only if it's not a mine
  if (!cell.isMine) {
    gGame.shownCount++
  }
}

function renderCell(currCell, currElCell, i, j) {
  var currIcon = gIcons.empty
  var classes = []

  if (!currCell) currCell = gBoard[i][j]
  if (currCell.isMine && !currCell.isMarked) {
    classes.push('mine')
    currIcon = gIcons.mine
  } else if (currCell.minesAroundCount > 0) {
    currIcon = gIcons[`num${currCell.minesAroundCount}`]
  }
  if (!currCell.isShown) {
    classes.push('not-shown')
  } else {
    classes.push('shown')
  }
  if (currCell.isMarked) {
    classes.push('marked')
    currIcon = gIcons.flag
  }
  if (currCell.isExterminated) {
    currIcon = gIcons.exterminated
  }

  if (!currElCell) {
    currElCell = document.querySelector(`.cell[data-i='${i}'][data-j='${j}']`)
  }

  currElCell.className = `cell ${classes.join(' ')}`
  currElCell.innerText = currIcon
}
