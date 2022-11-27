export function registerCloseButtonsOnModals(modals: HTMLCollectionOf<Element>): void {
  for (let i = 0; i < modals.length; i++) {
    const modal = modals[i]
    if (!(modal instanceof HTMLElement)) continue
    modal.querySelector('.modal-close')?.addEventListener('click', () => {
      fadeOutModal(modal).then(() => {
        modal.style.display = 'none'
      })
    })
  }
}

export function registerOpenModalButtons(buttons: HTMLCollectionOf<Element>): void {
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i]
    if (!(button instanceof HTMLElement)) continue
    const modalId = button.dataset.modal
    if (modalId == null) continue
    button.addEventListener('click', () => {
      const modal = document.getElementById(modalId)
      if (!(modal instanceof HTMLElement)) return
      closeAnyOpenModalExcept(document.getElementsByClassName('modal'), modal).then(() => {
        modal.style.display = ''
        setTimeout(() => {
          modal.style.opacity = '1'
        }, 5)
      })
    })
  }
}

function fadeOutModal(modal: HTMLElement): Promise<void> {
  if (modal.style.opacity === '0') return Promise.resolve()
  return new Promise((resolve) => {
    modal.style.opacity = '0'
    modal.addEventListener('transitionend', () => {
      resolve()
    }, {once: true})
  })
}

async function closeAnyOpenModalExcept (modals: HTMLCollectionOf<Element>, except: HTMLElement): Promise<void> {
  for (let i = 0; i < modals.length; i++) {
    const modal = modals[i]
    if (!(modal instanceof HTMLElement)) continue
    if (modal.style.display === 'none') continue
    if (modal === except) continue
    await fadeOutModal(modal)
    modal.style.display = 'none'
  }
  return Promise.resolve()
}