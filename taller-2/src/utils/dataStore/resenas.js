import { leer, guardar } from './storage'

export function obtenerResenas(filtros = {}) {
  // TODO: reemplazar con fetch GET /api/resenas
  let resenas = leer('resenas')

  if (filtros.propiedadId) {
    resenas = resenas.filter(r => r.propiedadId === filtros.propiedadId)
  }

  return resenas
}

export function crearResena(datos) {
  // TODO: reemplazar con fetch POST /api/resenas
  const resenas = leer('resenas')

  const nueva = {
    id: Math.max(...resenas.map(r => r.id), 0) + 1,
    ...datos,
    fechaCreacion: new Date().toISOString()
  }

  resenas.push(nueva)
  guardar('resenas', resenas)
  return nueva
}
