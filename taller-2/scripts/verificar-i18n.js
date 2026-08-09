/**
 * Verificador de paridad de los diccionarios de i18n.
 *
 * Compara `src/i18n/es.js` (idioma fuente) con `src/i18n/en.js` y reporta:
 *   - claves presentes en español que faltan en inglés
 *   - claves presentes en inglés que ya no existen en español
 *   - marcadores de interpolación ({nombre}) que no coinciden entre ambos
 *
 * Uso: npm run i18n:check
 */

import es from '../src/i18n/es.js'
import en from '../src/i18n/en.js'

function aplanar(objeto, prefijo = '', acumulado = {}) {
  Object.entries(objeto).forEach(([clave, valor]) => {
    const ruta = prefijo ? `${prefijo}.${clave}` : clave
    if (valor && typeof valor === 'object' && !Array.isArray(valor)) {
      aplanar(valor, ruta, acumulado)
    } else {
      acumulado[ruta] = valor
    }
  })
  return acumulado
}

function marcadores(texto) {
  return [...String(texto).matchAll(/\{(\w+)\}/g)].map((coincidencia) => coincidencia[1]).sort()
}

const planoEs = aplanar(es)
const planoEn = aplanar(en)

const faltantes = Object.keys(planoEs).filter((clave) => !(clave in planoEn))
const sobrantes = Object.keys(planoEn).filter((clave) => !(clave in planoEs))
const desajustes = Object.keys(planoEs)
  .filter((clave) => clave in planoEn)
  .filter((clave) => marcadores(planoEs[clave]).join(',') !== marcadores(planoEn[clave]).join(','))

console.log(`Claves en español: ${Object.keys(planoEs).length}`)
console.log(`Claves en inglés:  ${Object.keys(planoEn).length}`)

if (faltantes.length > 0) {
  console.log(`\nFaltan en en.js (${faltantes.length}):`)
  faltantes.forEach((clave) => console.log(`  - ${clave}`))
}

if (sobrantes.length > 0) {
  console.log(`\nSobran en en.js (${sobrantes.length}):`)
  sobrantes.forEach((clave) => console.log(`  - ${clave}`))
}

if (desajustes.length > 0) {
  console.log(`\nMarcadores de interpolación distintos (${desajustes.length}):`)
  desajustes.forEach((clave) => {
    console.log(`  - ${clave}: es[${marcadores(planoEs[clave])}] vs en[${marcadores(planoEn[clave])}]`)
  })
}

const problemas = faltantes.length + sobrantes.length + desajustes.length
if (problemas === 0) {
  console.log('\nLos dos diccionarios están sincronizados.')
} else {
  console.log(`\n${problemas} problema(s) encontrado(s).`)
  process.exitCode = 1
}
