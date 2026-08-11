import { leer, guardar, siguienteId } from './storage'

/**
 * Nunca se guarda el número completo de tarjeta ni el CVV: solo los últimos
 * dígitos para mostrar en la lista. El CVV se vuelve a pedir en cada reserva.
 */
export function obtenerMetodosPago(filtros = {}) {
  let metodos = leer('metodosPago')

  if (filtros.usuarioId) {
    metodos = metodos.filter(m => m.usuarioId === Number(filtros.usuarioId))
  }

  return metodos
}

export function crearMetodoPago(datos) {
  const metodos = leer('metodosPago')

  const nuevo = {
    id: siguienteId(metodos),
    ...datos,
    fechaCreacion: new Date().toISOString()
  }

  metodos.push(nuevo)
  guardar('metodosPago', metodos)
  return nuevo
}

export function eliminarMetodoPago(id) {
  const metodos = leer('metodosPago')
  guardar('metodosPago', metodos.filter(m => m.id !== parseInt(id)))
}
