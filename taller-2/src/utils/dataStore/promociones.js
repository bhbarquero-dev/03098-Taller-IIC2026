import { leer } from './storage'

export function obtenerPromociones() {
  // TODO: reemplazar con fetch GET /api/promociones
  return leer('promociones')
}

export function obtenerPromocion(id) {
  // TODO: reemplazar con fetch GET /api/promociones/:id
  return obtenerPromociones().find(p => p.id === parseInt(id))
}
