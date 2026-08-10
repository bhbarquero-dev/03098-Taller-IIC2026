/**
 * Validaciones de formulario del lado del cliente.
 *
 * Cada función devuelve `null` si el valor es válido, o un objeto
 * `{ clave, params }` con la clave del mensaje en el diccionario de i18n.
 * Se devuelven claves y no textos para que la validación sea independiente del
 * idioma activo: el componente traduce al renderizar.
 */

export const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PATRON_TELEFONO = /^[\d\s+-]{8,}$/
export const EXTENSIONES_IMAGEN = ['jpg', 'jpeg', 'png', 'webp']
export const EXTENSIONES_VIDEO = ['mp4', 'webm']
export const LARGO_MINIMO_CLAVE = 8
export const LARGO_MAXIMO_TEXTO = 500

const error = (clave, params) => ({ clave, params })

export function requerido(valor) {
  const vacio = valor === null || valor === undefined ||
    (typeof valor === 'string' && !valor.trim()) ||
    (Array.isArray(valor) && valor.length === 0)
  return vacio ? error('validacion.obligatorio') : null
}

export function correoValido(valor) {
  if (requerido(valor)) return error('validacion.obligatorio')
  return PATRON_CORREO.test(valor.trim()) ? null : error('validacion.correoInvalido')
}

export function telefonoValido(valor) {
  if (requerido(valor)) return error('validacion.obligatorio')
  const digitos = String(valor).replace(/\D/g, '')
  return PATRON_TELEFONO.test(valor) && digitos.length >= 8
    ? null
    : error('validacion.telefonoInvalido')
}

export function claveValida(valor) {
  if (requerido(valor)) return error('validacion.obligatorio')
  return valor.length >= LARGO_MINIMO_CLAVE
    ? null
    : error('validacion.claveCorta', { n: LARGO_MINIMO_CLAVE })
}

export function clavesCoinciden(clave, confirmacion) {
  return clave === confirmacion ? null : error('validacion.claveNoCoincide')
}

export function numeroEnRango(valor, { min, max } = {}) {
  if (requerido(valor)) return error('validacion.obligatorio')
  const numero = Number(valor)
  if (Number.isNaN(numero)) return error('validacion.numeroInvalido')
  if (min !== undefined && numero < min) return error('validacion.numeroMinimo', { n: min })
  if (max !== undefined && numero > max) return error('validacion.numeroMaximo', { n: max })
  return null
}

export function textoMaximo(valor, maximo = LARGO_MAXIMO_TEXTO) {
  if (!valor) return null
  return valor.length <= maximo ? null : error('validacion.textoLargo', { n: maximo })
}

/** Fecha en formato YYYY-MM-DD que no puede quedar en el pasado. */
export function fechaNoPasada(valor) {
  if (requerido(valor)) return error('validacion.obligatorio')
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  return new Date(`${valor}T00:00:00`) >= hoy ? null : error('validacion.fechaPasada')
}

export function fechaPosterior(inicio, fin, clave = 'validacion.fechaSalida') {
  if (requerido(fin)) return error('validacion.obligatorio')
  if (!inicio) return null
  return fin > inicio ? null : error(clave)
}

function extensionDe(nombre) {
  return String(nombre).split('.').pop().toLowerCase()
}

/** Valida la extensión de los archivos elegidos en un input de tipo file. */
export function archivosValidos(archivos, extensiones, claveError) {
  if (!archivos || archivos.length === 0) return null
  const lista = Array.from(archivos)
  const todosValidos = lista.every((archivo) => (
    extensiones.includes(extensionDe(archivo.name || archivo))
  ))
  return todosValidos ? null : error(claveError)
}

export function imagenesValidas(archivos) {
  return archivosValidos(archivos, EXTENSIONES_IMAGEN, 'validacion.extensionImagen')
}

export function videoValido(archivos) {
  return archivosValidos(archivos, EXTENSIONES_VIDEO, 'validacion.extensionVideo')
}

export function tarjetaNumeroValido(valor) {
  if (requerido(valor)) return error('validacion.obligatorio')
  return /^\d{16}$/.test(String(valor).replace(/[\s-]/g, ''))
    ? null
    : error('validacion.tarjetaNumero')
}

export function tarjetaCvvValido(valor) {
  if (requerido(valor)) return error('validacion.obligatorio')
  return /^\d{3,4}$/.test(valor) ? null : error('validacion.tarjetaCvv')
}

export function tarjetaVencimientoValido(valor) {
  if (requerido(valor)) return error('validacion.obligatorio')
  const coincidencia = /^(\d{2})\/(\d{2})$/.exec(String(valor).trim())
  if (!coincidencia) return error('validacion.tarjetaVencimiento')

  const mes = Number(coincidencia[1])
  const anio = 2000 + Number(coincidencia[2])
  if (mes < 1 || mes > 12) return error('validacion.tarjetaVencimiento')

  // Vence al final del mes indicado.
  const vencimiento = new Date(anio, mes, 0, 23, 59, 59)
  return vencimiento >= new Date() ? null : error('validacion.tarjetaVencimiento')
}

export function casillaMarcada(valor, clave = 'validacion.terminosObligatorios') {
  return valor ? null : error(clave)
}

/**
 * Ejecuta un mapa de validaciones `{ campo: () => error | null }` y devuelve
 * solo los campos con error, en el orden en que se declararon.
 */
export function validar(reglas) {
  const errores = {}
  Object.entries(reglas).forEach(([campo, regla]) => {
    const resultado = typeof regla === 'function' ? regla() : regla
    if (resultado) errores[campo] = resultado
  })
  return errores
}

/** Nombre del primer campo con error, para enfocarlo. */
export function primerCampoConError(errores) {
  const claves = Object.keys(errores)
  return claves.length > 0 ? claves[0] : null
}
