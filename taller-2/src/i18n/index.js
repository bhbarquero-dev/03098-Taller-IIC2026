/**
 * Internacionalización — implementación propia, sin librería externa.
 *
 * Dos idiomas (ES/EN). Los diccionarios son módulos JavaScript planos que se
 * importan estáticamente: el volumen es pequeño y no justifica carga diferida.
 *
 * Ver `taller-2/plan-traduccion.md` para el alcance y las reglas de uso.
 */

import es from './es'
import en from './en'

export const DICCIONARIOS = { es, en }

export const IDIOMAS = [
  { codigo: 'es', etiqueta: 'ES', nombre: 'Español' },
  { codigo: 'en', etiqueta: 'EN', nombre: 'English' }
]

export const IDIOMA_POR_DEFECTO = 'es'

/** Locale de Intl por idioma, para fechas y monedas. */
export const LOCALES = { es: 'es-CR', en: 'en-US' }

/**
 * Recorre un diccionario siguiendo una ruta con puntos ('header.saludo').
 * Devuelve undefined si algún tramo no existe.
 */
export function obtenerTexto(diccionario, ruta) {
  return ruta.split('.').reduce((nodo, tramo) => (
    nodo && typeof nodo === 'object' ? nodo[tramo] : undefined
  ), diccionario)
}

/**
 * Reemplaza marcadores {nombre} por el valor correspondiente.
 * No interpreta HTML: si un texto necesita marcado interno se parte en varias
 * claves y se compone en JSX.
 */
export function interpolar(texto, parametros) {
  if (!parametros) return texto
  return texto.replace(/\{(\w+)\}/g, (coincidencia, clave) => (
    Object.prototype.hasOwnProperty.call(parametros, clave)
      ? String(parametros[clave])
      : coincidencia
  ))
}

/**
 * Traduce una ruta de clave al idioma pedido.
 * Si falta en el idioma activo cae al español y avisa por consola, para que la
 * interfaz nunca muestre la clave cruda al usuario.
 */
export function traducir(idioma, ruta, parametros) {
  let texto = obtenerTexto(DICCIONARIOS[idioma], ruta)

  if (texto === undefined) {
    console.warn(`[i18n] Falta la clave "${ruta}" en el diccionario "${idioma}".`)
    texto = obtenerTexto(DICCIONARIOS[IDIOMA_POR_DEFECTO], ruta)
  }

  if (texto === undefined) {
    console.warn(`[i18n] La clave "${ruta}" no existe en ningún diccionario.`)
    return ruta
  }

  return interpolar(texto, parametros)
}
