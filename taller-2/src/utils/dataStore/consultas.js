import { leer, guardar, siguienteId } from './storage'

/**
 * Consultas que un huésped envía al anfitrión desde la ficha de una propiedad.
 * Estados: pendiente → respondida.
 */

export function obtenerConsultas(filtros = {}) {
  let consultas = leer('consultas')

  if (filtros.anfitrionId) {
    consultas = consultas.filter(c => c.anfitrionId === Number(filtros.anfitrionId))
  }
  if (filtros.propiedadId) {
    consultas = consultas.filter(c => c.propiedadId === Number(filtros.propiedadId))
  }
  if (filtros.estado) {
    consultas = consultas.filter(c => c.estado === filtros.estado)
  }

  return consultas
}

export function obtenerConsulta(id) {
  return leer('consultas').find(c => c.id === parseInt(id))
}

export function crearConsulta(datos) {
  const consultas = leer('consultas')

  const nueva = {
    id: siguienteId(consultas),
    estado: 'pendiente',
    fecha: new Date().toISOString().slice(0, 10),
    respuesta: '',
    ...datos
  }

  consultas.push(nueva)
  guardar('consultas', consultas)
  return nueva
}

export function responderConsulta(id, respuesta) {
  const consultas = leer('consultas')
  const indice = consultas.findIndex(c => c.id === parseInt(id))
  if (indice === -1) return null

  consultas[indice] = {
    ...consultas[indice],
    respuesta,
    estado: 'respondida',
    fechaRespuesta: new Date().toISOString().slice(0, 10)
  }
  guardar('consultas', consultas)
  return consultas[indice]
}
