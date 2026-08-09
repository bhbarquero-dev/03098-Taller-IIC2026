/**
 * Utilidades de calendario compartidas entre la ficha de propiedad (vista del
 * huésped) y la gestión de disponibilidad (vista del anfitrión).
 *
 * Los nombres de meses y días se obtienen de `Intl`, no de listas escritas a
 * mano: así siguen automáticamente el idioma activo.
 */

export function nombresMeses(locale) {
  const formateador = new Intl.DateTimeFormat(locale, { month: 'long' })
  return Array.from({ length: 12 }, (_, indice) => {
    const nombre = formateador.format(new Date(2026, indice, 1))
    return nombre.charAt(0).toUpperCase() + nombre.slice(1)
  })
}

/** Días de la semana abreviados, empezando en lunes. */
export function diasSemana(locale) {
  const formateador = new Intl.DateTimeFormat(locale, { weekday: 'short' })
  // 2026-01-05 fue lunes.
  return Array.from({ length: 7 }, (_, indice) => {
    const nombre = formateador.format(new Date(2026, 0, 5 + indice))
    return nombre.charAt(0).toUpperCase() + nombre.slice(1).replace('.', '')
  })
}

export function fechaISO(anio, mes, dia) {
  return `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
}

/**
 * Construye la matriz de semanas de un mes, marcando cada día como reservado
 * (hay una reserva vigente que lo cubre) o bloqueado (el anfitrión lo cerró).
 */
export function generarCalendario(mes, anio, reservas = [], fechasBloqueadas = []) {
  const primerDiaSemana = (new Date(anio, mes - 1, 1).getDay() + 6) % 7
  const diasEnMes = new Date(anio, mes, 0).getDate()

  const dias = []
  for (let numero = 1; numero <= diasEnMes; numero++) {
    const iso = fechaISO(anio, mes, numero)
    const reservado = reservas.some((reserva) => (
      reserva.estado !== 'cancelada' &&
      iso >= reserva.fechaEntrada &&
      iso < reserva.fechaSalida
    ))
    dias.push({ numero, fechaISO: iso, reservado, bloqueado: fechasBloqueadas.includes(iso) })
  }

  const semanas = []
  let semana = new Array(primerDiaSemana).fill(null)
  for (const dia of dias) {
    semana.push(dia)
    if (semana.length === 7) {
      semanas.push(semana)
      semana = []
    }
  }
  if (semana.length > 0) {
    while (semana.length < 7) semana.push(null)
    semanas.push(semana)
  }
  return semanas
}

/** Número de noches entre dos fechas ISO. */
export function contarNoches(entrada, salida) {
  if (!entrada || !salida) return 0
  const milisegundos = new Date(`${salida}T00:00:00`) - new Date(`${entrada}T00:00:00`)
  return Math.max(0, Math.round(milisegundos / 86400000))
}
