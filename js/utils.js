// js/utils.js

'use strict'

function onToggleTheme(elThemeBtn) {
  document.body.classList.toggle('dark-mode')
  elThemeBtn.innerText =
    'Dark Mode' === elThemeBtn.innerText ? 'Light Mode' : 'Dark Mode'
}

const counterPrint = (counter) => {
  counter++
  console.log('counter', counter)
  console.log('gGame.isOn', gGame.isOn)
  console.log('gGame.shownCount', gGame.shownCount)
  console.log('gGame.markedCount', gGame.markedCount)
  console.log('gGame.secsPassed', gGame.secsPassed)
  console.log('gGame.isFirstMove', gGame.isFirstMove)
  console.log('gGame.livesCount', gGame.livesCount)
  console.log('gGame.hintsCount', gGame.hintsCount)
  console.log('gGame.isHintOn', gGame.isHintOn)
  console.log('gGame.megaHintsCount', gGame.megaHintsCount)
  console.log('gGame.isMegaHintOn', gGame.isMegaHintOn)
  console.log('gGame.isOnce', gGame.isOnce)
}

function createEmptyBoard() {
  const board = []
  for (var i = 0; i < gLevel.SIZE; i++) {
    board.push([])
    for (var j = 0; j < gLevel.SIZE; j++) {
      board[i][j] = createCell(i, j)
    }
  }
  return board
}

// TIMER
function startTimer() {
  gGame.secInterval = setInterval(countTime, 1000)
}
function countTime() {
  gGame.secsPassed++
  updateTimer()
}
function stopTimer() {
  clearInterval(gGame.secInterval)
}
function getTime() {
  const currSeconds = gGame.secsPassed
  var minutes = parseInt(gGame.secsPassed / 60)
  var seconds = parseInt(gGame.secsPassed % 60)
  const isLessThanMinute = minutes ? false : true
  if (isLessThanMinute) {
    minutes = '00'
  } else if (minutes < 10) {
    minutes = '0' + minutes.toString()
  }
  if (seconds < 10) {
    seconds = '0' + seconds.toString()
  }

  return `${minutes} : ${seconds}`
}

// GENERAL
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomColor() {
  const letters = '0123456789ABCDEF'
  var color = '#'

  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)]
  }
  return color
}

function playSound(soundName) {
  const audio = new Audio(`assets/sounds/${soundName}.mp3`)
  audio.loop = false
  audio.play()
}
