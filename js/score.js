'use strict'

const gScores = []

function onOpenScoreBoard() {
  //yeah it's a wrapper...
  renderScoreboard()
}

function renderScoreboard() {
  //render in modal
  const scoreBoard = buildScoreboard()

  const strHTMLJunior = renderCategory(scoreBoard.categoryJunior)
  const strHTMLMid = renderCategory(scoreBoard.categoryMid)
  const strHTMLSenior = renderCategory(scoreBoard.categorySenior)

  const elModalTitle = document.querySelector('.modal-title')
  elModalTitle.innerText = 'ScoreBoard'

  const elScoreBoard = document.querySelector('.modal .scoreboard')
  const elJuniorBoard = document.querySelector('.scoreboard .ol-junior')
  const elMidBoard = document.querySelector('.scoreboard .ol-mid')
  const elSeniorBoard = document.querySelector('.scoreboard .ol-senior')

  elJuniorBoard.innerHTML = strHTMLJunior
  elMidBoard.innerHTML = strHTMLMid
  elSeniorBoard.innerHTML = strHTMLSenior

  elScoreBoard.classList.remove('hidden')
  openModal()
  setTimeout(closeModal, 10000)
  setTimeout(hideScoreboard, 10000)
}
function hideScoreboard() {
  const elScoreBoard = document.querySelector('.modal .scoreboard')
  elScoreBoard.classList.add('hidden')
}

function renderCategory(scores) {
  var strHTML = `<ol>`
  for (const score of scores) {
    strHTML += `<li>Score: ${score.score}, Date: ${score.date}</li>`
  }
  strHTML += '</ol>'
  return strHTML
}

function buildScoreboard() {
  const seenKeys = new Set()

  const categoryJunior = []
  const categoryMid = []
  const categorySenior = []
  for (const gScore of gScores) {
    // skip duplicates
    if (seenKeys.has(gScore.storageKey)) continue
    seenKeys.add(gScore.storageKey)

    if (gScore.category === 'Junior') {
      categoryJunior.push(gScore)
    } else if (gScore.category === 'Mid') {
      categoryMid.push(gScore)
    } else categorySenior.push(gScore)
  }

  categoryJunior.sort((a, b) => a.scoreInSecs - b.scoreInSecs)
  categoryMid.sort((a, b) => a.scoreInSecs - b.scoreInSecs)
  categorySenior.sort((a, b) => a.scoreInSecs - b.scoreInSecs)

  const scoreBoard = { categoryJunior, categoryMid, categorySenior }

  return scoreBoard
}

function createScore() {
  const score = {
    storageKey: null,
    category: null,
    score: '',
    scoreInSecs: 0,
    date: '',
  }

  return score
}

function setScore() {
  const score = createScore()

  score.scoreInSecs = parseInt(gGame.secsPassed)

  const elDifBtn = document.querySelector('.btn-difficulty.highlight')
  score.category = elDifBtn.innerText

  const elTimer = document.querySelector('.timer h3 span')
  score.score = elTimer.innerText

  const currDate = new Date()
  const day = currDate.getDay()
  const month = currDate.getMonth() + 1
  const year = currDate.getFullYear()
  const hour = currDate.getHours()
  const minutes = currDate.getMinutes()

  score.date = `${day}-${month}-${year} ${hour}:${minutes}`

  score.storageKey = currDate.getTime() + score.scoreInSecs

  return score
}

function addScore() {
  const score = setScore()
  const scoreString = `${score.storageKey}|${score.category}|${score.score}|${score.scoreInSecs}|${score.date}`
  localStorage.setItem(score.storageKey, scoreString)
  gScores.push(score)
}

function getScoresFromStorage() {
  const seenKeys = new Set() //set to skip over duplicates
  for (var key in localStorage) {
    const currScoreStr = localStorage.getItem(key)

    if (!currScoreStr || !currScoreStr.includes('|')) continue

    const [storageKey, category, score, scoreInSecs, date] =
      currScoreStr.split('|') //split

    if (seenKeys.has(storageKey)) continue
    seenKeys.add(storageKey)

    const currScore = {
      storageKey,
      category,
      score,
      scoreInSecs: +scoreInSecs,
      date,
    }

    var isInGScores = false
    for (var gScore of gScores) {
      if (currScore.storageKey === gScore.storageKey) isInGScores = true
    }
    if (!isInGScores) gScores.push(currScore)
  }
}
