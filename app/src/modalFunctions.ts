import { fadeIn, fadeOut } from "./animations";
import { closeExtendedMenu } from "./extendedMenu";

export function registerCloseButtonsOnModals(modals: HTMLCollectionOf<Element>): void {
  for (let i = 0; i < modals.length; i++) {
    const modal = modals[i]
    if (!(modal instanceof HTMLElement)) continue
    modal.querySelector('.modal-close')?.addEventListener('click', () => {
      fadeOut(modal)
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
      if (modal == null) return
      const extendedMenu = document.getElementById('extended-menu')
      if (!(extendedMenu instanceof HTMLElement)) return
      closeExtendedMenu(extendedMenu)
      closeAnyOpenModalExcept(document.getElementsByClassName('modal'), modal).then(() => {
        fadeIn(modal)
      })
    })
  }
}

async function closeAnyOpenModalExcept (modals: HTMLCollectionOf<Element>, except: Element): Promise<void> {
  for (let i = 0; i < modals.length; i++) {
    const modal = modals[i]
    if (modal === null) continue
    if (modal.classList.contains('is-hidden')) continue
    if (modal === except) continue
    await fadeOut(modal)
  }
  return Promise.resolve()
}