// js/cell.js
'use strict'

function createCell(i, j) {
  const cell = {
    minesAroundCount: 0,
    isShown: false,
    isMine: false,
    isMarked: false,
    location: { i, j },
  }
  //   console.log(cell)
  return cell
}

function showCell(elCell, i, j) {
  const cell = gBoard[i][j]
  if (cell.isShown) return

  elCell.classList.remove('not-shown')
  elCell.classList.add('shown')

  cell.isShown = true
  gGame.shownCount++
}

function renderCell(currCell, currElCell, i, j) {
  var strHTML = ''
  var currIcon = gIcons.empty
  var classes = ''

  if (!currCell) currCell = gBoard[i][j]
  if (currCell.isMine && !currCell.isMarked) {
    classes += ' mine'
    currIcon = gIcons.mine
  } else if (currCell.minesAroundCount > 0) {
    currIcon = gIcons[`num${currCell.minesAroundCount}`]
  }
  if (!currCell.isShown) {
    classes += ' not-shown'
  } else {
    classes += ' shown'
  }
  if (currCell.isMarked) {
    classes += ' marked'
    currIcon = gIcons.flag
  }

  strHTML += `<td class="cell${classes}" data-i=${i} data-j=${j} onmousedown="onCellClicked(this, ${i}, ${j},event)">${currIcon}</td>`

  if (!currElCell) {
    currElCell = document.querySelector(`.cell[data-i='${i}'][data-j='${j}']`)
  }
  currElCell.innerHTML = strHTML
}
