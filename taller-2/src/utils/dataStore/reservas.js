import { leer, guardar, siguienteId } from './storage'

export const ESTADOS_RESERVA = ['pendiente', 'confirmada', 'finalizada', 'cancelada']
export const ESTADOS_PAGO = ['pendiente', 'pagado', 'reembolsado']

export function obtenerReservas(filtros = {}) {
  let reservas = leer('reservas')

  if (filtros.usuarioId) {
    reservas = reservas.filter(r => r.usuarioId === Number(filtros.usuarioId))
  }
  if (filtros.propiedadId) {
    reservas = reservas.filter(r => r.propiedadId === Number(filtros.propiedadId))
  }
  if (filtros.anfitrionId) {
    reservas = reservas.filter(r => r.anfitrionId === Number(filtros.anfitrionId))
  }
  if (filtros.estado) {
    reservas = reservas.filter(r => r.estado === filtros.estado)
  }
  if (filtros.estadoPago) {
    reservas = reservas.filter(r => r.estadoPago === filtros.estadoPago)
  }

  return reservas
}

export function obtenerReserva(id) {
  return leer('reservas').find(r => r.id === parseInt(id))
}

export function crearReserva(datos) {
  const reservas = leer('reservas')

  const nueva = {
    id: siguienteId(reservas),
    estado: 'pendiente',
    estadoPago: 'pendiente',
    ...datos,
    fechaCreacion: new Date().toISOString()
  }

  reservas.push(nueva)
  guardar('reservas', reservas)
  return nueva
}

export function actualizarReserva(id, datos) {
  const reservas = leer('reservas')
  const indice = reservas.findIndex(r => r.id === parseInt(id))
  if (indice === -1) return null

  reservas[indice] = { ...reservas[indice], ...datos }
  guardar('reservas', reservas)
  return reservas[indice]
}

export function cancelarReserva(id, motivo = '') {
  return actualizarReserva(id, { estado: 'cancelada', motivoCancelacion: motivo })
}

export function aceptarReserva(id) {
  return actualizarReserva(id, { estado: 'confirmada' })
}

export function rechazarReserva(id) {
  return actualizarReserva(id, { estado: 'cancelada', motivoCancelacion: 'Rechazada por el anfitrión' })
}

export function finalizarReserva(id) {
  return actualizarReserva(id, { estado: 'finalizada' })
}

/**
 * ¿El rango pedido choca con una reserva vigente de esa propiedad?
 * Se ignoran las canceladas. El día de salida no cuenta como ocupado: una
 * reserva puede empezar el mismo día en que termina la anterior.
 */
export function hayTraslape(propiedadId, entrada, salida, reservaIgnorada = null) {
  return obtenerReservas({ propiedadId }).some(reserva => {
    if (reserva.estado === 'cancelada') return false
    if (reservaIgnorada && reserva.id === Number(reservaIgnorada)) return false
    return entrada < reserva.fechaSalida && salida > reserva.fechaEntrada
  })
}
