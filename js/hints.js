'use strict'

var megaHintCoords = []

function onMegaHintClick() {
  if (gGame.megaHintsCount <= 0) return

  gGame.isMegaHintOn = true
  megaHintCoords = []

  const elMegaHintButton = document.querySelector('.btn-mega-hint')
  elMegaHintButton.classList.add('highlight')
}

function handleMegaHintSelection(i, j) {
  megaHintCoords.push({ i, j })

  // Highlight selected cells
  const elCell = document.querySelector(`.cell[data-i="${i}"][data-j="${j}"]`)
  elCell.classList.add('selected')

  if (megaHintCoords.length === 2) {
    gGame.isMegaHintOn = false
    const elMegaHintButton = document.querySelector('.btn-mega-hint')
    elMegaHintButton.classList.remove('highlight')

    revealMegaHintArea(megaHintCoords[0], megaHintCoords[1])

    gGame.megaHintsCount--
  }
}

function revealMegaHintArea(topLeft, bottomRight) {
  const { i: startRow, j: startCol } = topLeft
  const { i: endRow, j: endCol } = bottomRight

  for (var i = startRow; i <= endRow; i++) {
    for (var j = startCol; j <= endCol; j++) {
      const elCell = document.querySelector(
        `.cell[data-i="${i}"][data-j="${j}"]`
      )
      const cell = gBoard[i][j]
      hintReveal(cell, i, j, 2000)
    }
  }
}

function onHintClick() {
  if (gGame.hintsCount <= 0 || !gGame.isOn) return

  gGame.isHintOn = !gGame.isHintOn
  const elHintCounter = document.querySelector('.hints h3 span')
  elHintCounter.classList.toggle('highlight')
}

function updateHintsCounter() {
  const elHintCounter = document.querySelector('.hints h3 span')
  var hintCounter = ''
  for (var i = 0; i < gGame.hintsCount; i++) {
    hintCounter += gIcons.hint + ' '
  }

  elHintCounter.classList.remove('highlight')
  elHintCounter.innerText = hintCounter.trim()
}

function showHintClick(cell, elCell, i, j) {
  if (!gGame.isHintOn) return //if off than exit

  const currI = i
  const currJ = j

  for (var i = currI - 1; i <= currI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue
    for (var j = currJ - 1; j <= currJ + 1; j++) {
      if (j < 0 || j >= gBoard[0].length) continue
      const currCell = gBoard[i][j]
      hintReveal(currCell, i, j)
    }
  }
  playSound('hint')
  updateEmoji('hint')

  gGame.hintsCount--
  updateHintsCounter()
  gGame.isHintOn = !gGame.isHintOn //turn off
}

function hintReveal(currCell, i, j, delay = 1000) {
  var wasShown = false
  if (currCell.isShown) wasShown = true

  currCell.isShown = true
  setTimeout(hintClose, delay, currCell, i, j, wasShown)
  renderCell(currCell, null, i, j)
}

function hintClose(currCell, i, j, wasShown) {
  currCell.isShown = wasShown
  renderCell(currCell, null, i, j)
}
