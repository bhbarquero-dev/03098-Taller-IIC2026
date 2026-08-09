import { leer, guardar } from './storage'

export function obtenerPropiedades(filtros = {}) {
  // TODO: reemplazar con fetch GET /api/propiedades?...
  const propiedades = leer('propiedades')

  if (filtros.destino) {
    return propiedades.filter(p =>
      p.ubicacion.toLowerCase().includes(filtros.destino.toLowerCase())
    )
  }
  return propiedades
}

export function obtenerPropiedad(id) {
  // TODO: reemplazar con fetch GET /api/propiedades/:id
  return leer('propiedades').find(p => p.id === parseInt(id))
}

export function crearPropiedad(datos) {
  // TODO: reemplazar con fetch POST /api/propiedades
  const propiedades = leer('propiedades')

  const nueva = {
    id: Math.max(...propiedades.map(p => p.id), 0) + 1,
    ...datos,
    fechaCreacion: new Date().toISOString()
  }

  propiedades.push(nueva)
  guardar('propiedades', propiedades)
  return nueva
}

export function actualizarPropiedad(id, datos) {
  // TODO: reemplazar con fetch PATCH /api/propiedades/:id
  const propiedades = leer('propiedades')
  const indice = propiedades.findIndex(p => p.id === parseInt(id))
  if (indice === -1) return null

  propiedades[indice] = { ...propiedades[indice], ...datos }
  guardar('propiedades', propiedades)
  return propiedades[indice]
}

export function eliminarPropiedad(id) {
  // TODO: reemplazar con fetch DELETE /api/propiedades/:id
  const propiedades = leer('propiedades')
  guardar('propiedades', propiedades.filter(p => p.id !== parseInt(id)))
}
