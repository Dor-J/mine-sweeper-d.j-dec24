'use strict'

function renderVictoryModal() {
  const elModalTitle = document.querySelector('.modal-title')
  elModalTitle.innerText = 'You Win!'
  openModal()
}

function openModal() {
  document.querySelector('.modal').classList.remove('hidden')
  document.querySelector('.modal-overlay').classList.remove('hidden')
}

function closeModal() {
  document.querySelector('.modal').classList.add('hidden')
  document.querySelector('.modal-overlay').classList.add('hidden')
}

function renderLoseModal() {
  const elModalTitle = document.querySelector('.modal-title')
  elModalTitle.innerText = 'You Lose!'
  openModal()
}
