import { leer, guardar, siguienteId } from './storage'

/**
 * Ciclo de estados de una propiedad (ver taller-1/analisis-parte2-taller1.md §7):
 * pendiente → publicada | rechazada, e inactiva si el anfitrión la desactiva.
 * Solo las publicadas se listan en el catálogo público.
 */
export const ESTADOS_PROPIEDAD = ['pendiente', 'publicada', 'rechazada', 'inactiva']

export function obtenerPropiedades(filtros = {}) {
  let propiedades = leer('propiedades')

  // El catálogo público solo ve propiedades aprobadas; los paneles piden todas.
  if (!filtros.incluirTodas) {
    propiedades = propiedades.filter(p => p.estado === 'publicada')
  }

  if (filtros.estado) {
    propiedades = propiedades.filter(p => p.estado === filtros.estado)
  }

  if (filtros.anfitrionId) {
    propiedades = propiedades.filter(p => p.anfitrionId === Number(filtros.anfitrionId))
  }

  if (filtros.destino) {
    propiedades = propiedades.filter(p =>
      p.ubicacion.toLowerCase().includes(filtros.destino.toLowerCase())
    )
  }

  if (filtros.tipo) {
    propiedades = propiedades.filter(p => p.tipo === filtros.tipo)
  }

  if (filtros.precioMin) {
    propiedades = propiedades.filter(p => p.precioNoche >= Number(filtros.precioMin))
  }

  if (filtros.precioMax) {
    propiedades = propiedades.filter(p => p.precioNoche <= Number(filtros.precioMax))
  }

  if (filtros.capacidad) {
    propiedades = propiedades.filter(p => p.capacidad >= Number(filtros.capacidad))
  }

  if (filtros.valoracionMin) {
    propiedades = propiedades.filter(p => p.valoracion >= Number(filtros.valoracionMin))
  }

  if (filtros.promocionId) {
    propiedades = propiedades.filter(p => p.promocionId === Number(filtros.promocionId))
  }

  if (filtros.servicios && filtros.servicios.length > 0) {
    propiedades = propiedades.filter(p =>
      filtros.servicios.every(servicio => p.servicios.includes(servicio))
    )
  }

  return propiedades
}

export function obtenerPropiedad(id) {
  return leer('propiedades').find(p => p.id === parseInt(id))
}

export function crearPropiedad(datos) {
  const propiedades = leer('propiedades')

  const nueva = {
    id: siguienteId(propiedades),
    estado: 'pendiente',
    valoracion: 0,
    servicios: [],
    imagenes: [],
    fechasBloqueadas: [],
    consultasContador: 0,
    ...datos,
    fechaCreacion: new Date().toISOString()
  }

  propiedades.push(nueva)
  guardar('propiedades', propiedades)
  return nueva
}

export function actualizarPropiedad(id, datos) {
  const propiedades = leer('propiedades')
  const indice = propiedades.findIndex(p => p.id === parseInt(id))
  if (indice === -1) return null

  propiedades[indice] = { ...propiedades[indice], ...datos }
  guardar('propiedades', propiedades)
  return propiedades[indice]
}

export function eliminarPropiedad(id) {
  const propiedades = leer('propiedades')
  guardar('propiedades', propiedades.filter(p => p.id !== parseInt(id)))
}

/** Suma una visita de consulta, insumo del reporte de alojamientos más consultados. */
export function registrarConsultaPropiedad(id) {
  const propiedad = obtenerPropiedad(id)
  if (!propiedad) return null
  return actualizarPropiedad(id, { consultasContador: (propiedad.consultasContador || 0) + 1 })
}

/** Bloquea o habilita un rango de fechas en el calendario de la propiedad. */
export function cambiarDisponibilidad(id, fechaInicio, fechaFin, accion) {
  const propiedad = obtenerPropiedad(id)
  if (!propiedad) return null

  const rango = []
  const cursor = new Date(`${fechaInicio}T00:00:00`)
  const fin = new Date(`${fechaFin}T00:00:00`)
  while (cursor <= fin) {
    rango.push(cursor.toISOString().slice(0, 10))
    cursor.setDate(cursor.getDate() + 1)
  }

  const actuales = propiedad.fechasBloqueadas || []
  const fechasBloqueadas = accion === 'bloquear'
    ? [...new Set([...actuales, ...rango])].sort()
    : actuales.filter(fecha => !rango.includes(fecha))

  return actualizarPropiedad(id, { fechasBloqueadas })
}
