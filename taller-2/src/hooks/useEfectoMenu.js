import { useEffect } from 'react'

/**
 * Efecto del menú de navegación con manipulación directa del DOM.
 *
 * El enunciado del taller pide explícitamente acciones `onmouseover` y
 * `onmouseout` sobre el menú. React normalmente delega los eventos y abstrae el
 * DOM, así que aquí se toma el nodo real con una referencia y se registran los
 * escuchadores nativos, alternando la clase `enlace-activo`.
 *
 * Complementa al `:hover` de CSS, no lo sustituye.
 */
export function useEfectoMenu(refNav) {
  useEffect(() => {
    const nodo = refNav.current
    if (!nodo) return

    const enlaces = nodo.querySelectorAll('a')

    function resaltar(evento) {
      evento.currentTarget.classList.add('enlace-activo')
    }

    function quitarResalte(evento) {
      evento.currentTarget.classList.remove('enlace-activo')
    }

    enlaces.forEach((enlace) => {
      enlace.addEventListener('mouseover', resaltar)
      enlace.addEventListener('mouseout', quitarResalte)
    })

    return () => {
      enlaces.forEach((enlace) => {
        enlace.removeEventListener('mouseover', resaltar)
        enlace.removeEventListener('mouseout', quitarResalte)
      })
    }
  }, [refNav])
}
