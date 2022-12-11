/**
 * Fades an element out to display:none
 *
 * @param el - The element to fade.
 *
 * @returns A promise that resolves when the fade has completed.
 */
export function fadeOut(el: Element): Promise<void> {
  if (isFadedOut(el)) return Promise.resolve()
  return new Promise((resolve) => {
    el.classList.add('is-fading-out')
    el.addEventListener('transitionend', onTransitionEnd, {once: true})
    function onTransitionEnd() {
      el.classList.remove('is-fading-out')
      el.classList.add('is-hidden')
      resolve()
    }
  })
}

/**
 * Checks if an element is faded out.
 * @param el - The element to check.
 */
function isFadedOut(el: Element): boolean {
  return el.classList.contains('is-hidden') || el.classList.contains('is-fading-out')
}

/**
 * Fades an element in from display:none
 *
 * @param el - The element to fade.
 *
 * @returns A promise that resolves when the fade has completed.
 */
export function fadeIn(el: Element): Promise<void> {
  if (isFadedIn(el)) return Promise.resolve()
  return new Promise((resolve) => {
    el.classList.remove('is-hidden')
    el.classList.add('is-fading-in-ready')
    setTimeout(() => {
      el.classList.add('is-fading-in')
      el.addEventListener('transitionend', () => {
        el.classList.remove('is-fading-in-ready', 'is-fading-in')
        resolve()
      }, {once: true})
    }, 5)
  })
}

/**
 * Checks if an element is faded in.
 * @param el - The element to check.
 */
function isFadedIn(el: Element): boolean {
    return !(el.classList.contains('is-hidden') || el.classList.contains('is-fading-in-ready'))
}


