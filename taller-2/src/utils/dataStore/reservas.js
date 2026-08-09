import { leer, guardar } from './storage'

export function obtenerReservas(filtros = {}) {
  // TODO: reemplazar con fetch GET /api/reservas
  let reservas = leer('reservas')

  if (filtros.usuarioId) {
    reservas = reservas.filter(r => r.usuarioId === filtros.usuarioId)
  }
  if (filtros.propiedadId) {
    reservas = reservas.filter(r => r.propiedadId === filtros.propiedadId)
  }

  return reservas
}

export function obtenerReserva(id) {
  // TODO: reemplazar con fetch GET /api/reservas/:id
  return leer('reservas').find(r => r.id === parseInt(id))
}

export function crearReserva(datos) {
  // TODO: reemplazar con fetch POST /api/reservas
  const reservas = leer('reservas')

  const nueva = {
    id: Math.max(...reservas.map(r => r.id), 0) + 1,
    estado: 'confirmada',
    ...datos,
    fechaCreacion: new Date().toISOString()
  }

  reservas.push(nueva)
  guardar('reservas', reservas)
  return nueva
}

export function actualizarReserva(id, datos) {
  // TODO: reemplazar con fetch PATCH /api/reservas/:id
  const reservas = leer('reservas')
  const indice = reservas.findIndex(r => r.id === parseInt(id))
  if (indice === -1) return null

  reservas[indice] = { ...reservas[indice], ...datos }
  guardar('reservas', reservas)
  return reservas[indice]
}

export function cancelarReserva(id) {
  // TODO: reemplazar con fetch PATCH /api/reservas/:id/cancelar
  return actualizarReserva(id, { estado: 'cancelada' })
}
