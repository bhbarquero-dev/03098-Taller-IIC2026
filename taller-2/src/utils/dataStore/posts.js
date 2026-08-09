import { leer, guardar, siguienteId } from './storage'

/** Entradas del blog institucional, administradas desde el panel de admin. */

export const ESTADOS_POST = ['publicado', 'borrador']

export function obtenerPosts(filtros = {}) {
  // TODO: reemplazar con fetch GET /api/posts
  let posts = leer('posts')

  if (filtros.estado) {
    posts = posts.filter(p => p.estado === filtros.estado)
  }

  return posts
}

export function obtenerPost(id) {
  // TODO: reemplazar con fetch GET /api/posts/:id
  return leer('posts').find(p => p.id === parseInt(id))
}

export function crearPost(datos) {
  // TODO: reemplazar con fetch POST /api/posts
  const posts = leer('posts')

  const nuevo = {
    id: siguienteId(posts),
    estado: 'borrador',
    fechaPublicacion: new Date().toISOString().slice(0, 10),
    ...datos
  }

  posts.push(nuevo)
  guardar('posts', posts)
  return nuevo
}

export function actualizarPost(id, datos) {
  // TODO: reemplazar con fetch PATCH /api/posts/:id
  const posts = leer('posts')
  const indice = posts.findIndex(p => p.id === parseInt(id))
  if (indice === -1) return null

  posts[indice] = { ...posts[indice], ...datos }
  guardar('posts', posts)
  return posts[indice]
}

export function eliminarPost(id) {
  // TODO: reemplazar con fetch DELETE /api/posts/:id
  const posts = leer('posts')
  guardar('posts', posts.filter(p => p.id !== parseInt(id)))
}
