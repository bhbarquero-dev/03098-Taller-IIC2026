/**
 * Helpers internos de persistencia (localStorage hoy, API REST después).
 * No se exportan desde el índice del data store: cada módulo de entidad
 * los usa para no repetir el patrón getItem/parse/setItem/stringify.
 */

export const STORAGE_PREFIX = 'staybooker_'

export function leer(clave, porDefecto = []) {
  const datos = localStorage.getItem(`${STORAGE_PREFIX}${clave}`)
  if (!datos) return porDefecto
  try {
    return JSON.parse(datos)
  } catch {
    console.warn(`[dataStore] Dato corrupto en "${clave}", se descarta.`)
    return porDefecto
  }
}

export function guardar(clave, valor) {
  localStorage.setItem(`${STORAGE_PREFIX}${clave}`, JSON.stringify(valor))
}

export function sembrarSiVacio(clave, valor) {
  if (!localStorage.getItem(`${STORAGE_PREFIX}${clave}`)) {
    guardar(clave, valor)
  }
}

/** Siguiente id disponible de una colección. */
export function siguienteId(coleccion) {
  return Math.max(0, ...coleccion.map((elemento) => elemento.id || 0)) + 1
}
