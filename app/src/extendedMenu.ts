export function registerExtendedMenu(): void {
  const extendedMenu = document.getElementById('extended-menu')
  if (!(extendedMenu instanceof HTMLElement)) return
  const extendedMenuOpener = document.getElementById('extended-menu-opener')
  if (!(extendedMenuOpener instanceof HTMLElement)) return
  extendedMenuOpener.addEventListener('click', () => {
    toggleExtendedMenu(extendedMenu)
  })
}

export function closeExtendedMenu(extendedMenu: HTMLElement): void {
    if (!extendedMenu.classList.contains('is-open')) return
    extendedMenu.classList.remove('is-open')
    extendedMenu.addEventListener('transitionend', () => {
      extendedMenu.classList.add('is-hidden')
    }, {once: true})
}

function openExtendedMenu(extendedMenu: HTMLElement): void {
  extendedMenu.classList.remove('is-hidden')
  setTimeout(() => {extendedMenu.classList.add('is-open')}, 0)
}

function toggleExtendedMenu(extendedMenu: HTMLElement): void {
  if (extendedMenu.classList.contains('is-hidden')) {
    openExtendedMenu(extendedMenu)
  } else {
    closeExtendedMenu(extendedMenu)
  }
}
