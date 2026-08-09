import { leer, guardar, siguienteId } from './storage'

/**
 * Incidencias que el administrador registra sobre una cuenta, un alojamiento o
 * una reserva. Se consolidan como uno de los tipos de reporte disponibles.
 */

export const TIPOS_INCIDENCIA = ['contenido', 'pago', 'convivencia', 'tecnica', 'otra']

export function obtenerIncidencias(filtros = {}) {
  // TODO: reemplazar con fetch GET /api/incidencias
  let incidencias = leer('incidencias')

  if (filtros.entidad) {
    incidencias = incidencias.filter(i => i.entidad === filtros.entidad)
  }
  if (filtros.entidadId) {
    incidencias = incidencias.filter(i => i.entidadId === Number(filtros.entidadId))
  }

  return incidencias
}

export function crearIncidencia(datos) {
  // TODO: reemplazar con fetch POST /api/incidencias
  const incidencias = leer('incidencias')

  const nueva = {
    id: siguienteId(incidencias),
    fecha: new Date().toISOString().slice(0, 10),
    ...datos
  }

  incidencias.push(nueva)
  guardar('incidencias', incidencias)
  return nueva
}
