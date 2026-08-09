import { leer, guardar, siguienteId } from './storage'

export function obtenerResenas(filtros = {}) {
  // TODO: reemplazar con fetch GET /api/resenas
  let resenas = leer('resenas')

  if (filtros.propiedadId) {
    resenas = resenas.filter(r => r.propiedadId === Number(filtros.propiedadId))
  }
  if (filtros.reservaId) {
    resenas = resenas.filter(r => r.reservaId === Number(filtros.reservaId))
  }
  // Las reseñas bloqueadas por moderación no se muestran al público.
  if (!filtros.incluirBloqueadas) {
    resenas = resenas.filter(r => !r.bloqueada)
  }

  return resenas
}

export function obtenerResena(id) {
  // TODO: reemplazar con fetch GET /api/resenas/:id
  return leer('resenas').find(r => r.id === parseInt(id))
}

export function crearResena(datos) {
  // TODO: reemplazar con fetch POST /api/resenas
  const resenas = leer('resenas')

  const nueva = {
    id: siguienteId(resenas),
    bloqueada: false,
    fecha: new Date().toISOString().slice(0, 10),
    ...datos,
    fechaCreacion: new Date().toISOString()
  }

  resenas.push(nueva)
  guardar('resenas', resenas)
  return nueva
}

export function actualizarResena(id, datos) {
  // TODO: reemplazar con fetch PATCH /api/resenas/:id
  const resenas = leer('resenas')
  const indice = resenas.findIndex(r => r.id === parseInt(id))
  if (indice === -1) return null

  resenas[indice] = { ...resenas[indice], ...datos }
  guardar('resenas', resenas)
  return resenas[indice]
}
