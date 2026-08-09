import { leer, guardar } from './storage'

export function obtenerUsuarios() {
  // TODO: reemplazar con fetch GET /api/usuarios
  return leer('usuarios')
}

export function obtenerUsuario(id) {
  // TODO: reemplazar con fetch GET /api/usuarios/:id
  return obtenerUsuarios().find(u => u.id === parseInt(id))
}

export function crearUsuario(datos) {
  // TODO: reemplazar con fetch POST /api/usuarios (registro)
  const usuarios = obtenerUsuarios()

  const nuevo = {
    id: Math.max(...usuarios.map(u => u.id), 0) + 1,
    rol: 'huesped',
    ...datos,
    fechaCreacion: new Date().toISOString()
  }

  usuarios.push(nuevo)
  guardar('usuarios', usuarios)
  return nuevo
}

export function actualizarUsuario(id, datos) {
  // TODO: reemplazar con fetch PATCH /api/usuarios/:id
  const usuarios = obtenerUsuarios()
  const indice = usuarios.findIndex(u => u.id === parseInt(id))
  if (indice === -1) return null

  usuarios[indice] = { ...usuarios[indice], ...datos }
  guardar('usuarios', usuarios)
  return usuarios[indice]
}

export function verificarCredenciales(correo, clave) {
  // TODO: reemplazar con fetch POST /api/auth/login
  return obtenerUsuarios().find(u => u.correo === correo && u.clave === clave)
}
