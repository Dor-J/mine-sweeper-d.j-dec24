'use strict'

function renderVictoryModal() {
  const elModalTitle = document.querySelector('.modal-title')
  elModalTitle.innerText = 'You Win! 🎉🎉🎉'
  openModal()
}

function openModal() {
  document.querySelector('.modal').classList.remove('hidden')
  document.querySelector('.modal-overlay').classList.remove('hidden')
}

function closeModal() {
  document.querySelector('.modal').classList.add('hidden')
  document.querySelector('.modal-overlay').classList.add('hidden')

  document.querySelector('.modal .scoreboard .ol-junior').innerHTML = ''
  document.querySelector('.modal .scoreboard .ol-mid').innerHTML = ''
  document.querySelector('.modal .scoreboard .ol-senior').innerHTML = ''
}

function renderLoseModal() {
  const elModalTitle = document.querySelector('.modal-title')
  elModalTitle.innerText = 'You Lose! 💀'
  openModal()
}
