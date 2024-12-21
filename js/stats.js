'use strict'

function renderStats() {
  const elMinesCounter = document.querySelector('.display.mines-count h3 span')
  elMinesCounter.innerText = getMinesLeft()

  const elTimer = document.querySelector('.timer h3 span')
  elTimer.innerText = '00 : 00'

  const elEmoji = document.querySelector('.stats .emoji')
  elEmoji.innerText = gIcons.happy

  const elLifeCounter = document.querySelector('.stats .lives h3 span')
  elLifeCounter.innerText = `${gIcons.life} ${gIcons.life} ${gIcons.life}`

  const elSafeClickCounter = document.querySelector('.safe-click-counter')
  elSafeClickCounter.innerText = gGame.safeClicks
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
  const elMinesCounter = document.querySelector('.display.mines-count h3 span')
  elMinesCounter.innerText = getMinesLeft()
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
    case 'hint':
      icon = gIcons.hintFace
      break
    case 'exterminate':
      icon = gIcons.exterminate
      break
  }

  elEmojiSpan.innerText = icon
}

function updateSafeClickCounter() {
  const elSafeClickCounter = document.querySelector('.safe-click-counter')
  elSafeClickCounter.innerText = gGame.safeClicks
}
