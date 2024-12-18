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
  elCell.classList.remove('not-shown')
  elCell.classList.add('shown')

  const cell = gBoard[i][j]
  cell.isShown = true
  gGame.shownCount++
}

// function renderCell(currCell) {
//   const currI = currCell.location.i
//   const currJ = currCell.location.j
//   var strHTML = ''
//   var currIcon = gIcons.empty
//   var classes = ''
//   if (cell.isMine && !cell.isMarked) {
//     classes += ' mine'
//     currIcon = gIcons.mine
//   } else if (cell.minesAroundCount > 0) {
//     currIcon = gIcons[`num${cell.minesAroundCount}`]
//   }
//   if (!cell.isShown) {
//     classes += ' not-shown'
//   } else {
//     classes += ' shown'
//   }
//   if (cell.isMarked) {
//     classes += ' marked'
//     currIcon = gIcons.flag
//   }

//   strHTML += `<td class="cell${classes}" data-i=${currI} data-j=${currJ} onmousedown="onCellClicked(this, ${currI}, ${currJ},event)">${currIcon}</td>`

//   //update model
//   gBoard[currI][currJ] = currCell

//   //update dom
//   const elCell = document.querySelector(
//     `.cell [data-i=${currI}][data-j=${currJ}]`
//   )
//   if (!elCell) {
//     console.error(`Cell not found for i:${currI}, j:${currJ}`)
//     return
//   }

//   elCell.innerHTML = strHTML
// }
