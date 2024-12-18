// js/utils.js

'use strict'

function createEmptyBoard() {
  const board = []
  for (let i = 0; i < gLevel.SIZE; i++) {
    board.push([])
    for (let j = 0; j < gLevel.SIZE; j++) {
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
  // console.log('countTime', gGame.secsPassed)
  //TODO: update element with the get time function
}
function stopTimer() {
  clearInterval(secInterval)
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

  return `${minutes} : ${seconds}` //TODO: format to minutes:seconds
}

// GENERAL
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)]
  }
  return color
}

function playSound(soundName) {
  const audio = new Audio(`assets/sounds/${soundName}.mp3`)
  audio.loop = false
  audio.play()
}
