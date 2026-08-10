import { leer, guardar, siguienteId } from './storage'

export const ESTADOS_PROMOCION = ['activa', 'inactiva', 'finalizada']

export function obtenerPromociones(filtros = {}) {
  let promociones = leer('promociones')

  if (filtros.estado) {
    promociones = promociones.filter(p => p.estado === filtros.estado)
  }

  return promociones
}

export function obtenerPromocion(id) {
  return leer('promociones').find(p => p.id === parseInt(id))
}

export function crearPromocion(datos) {
  const promociones = leer('promociones')

  const nueva = {
    id: siguienteId(promociones),
    estado: 'activa',
    ...datos,
    fechaCreacion: new Date().toISOString()
  }

  promociones.push(nueva)
  guardar('promociones', promociones)
  return nueva
}

export function actualizarPromocion(id, datos) {
  const promociones = leer('promociones')
  const indice = promociones.findIndex(p => p.id === parseInt(id))
  if (indice === -1) return null

  promociones[indice] = { ...promociones[indice], ...datos }
  guardar('promociones', promociones)
  return promociones[indice]
}

export function eliminarPromocion(id) {
  const promociones = leer('promociones')
  guardar('promociones', promociones.filter(p => p.id !== parseInt(id)))
}
