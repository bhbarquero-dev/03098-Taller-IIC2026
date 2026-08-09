import { leer, guardar, siguienteId } from './storage'

export function obtenerUsuarios(filtros = {}) {
  // TODO: reemplazar con fetch GET /api/usuarios
  let usuarios = leer('usuarios')

  if (filtros.rol) {
    usuarios = usuarios.filter(u => u.rol === filtros.rol)
  }
  if (filtros.estado) {
    usuarios = usuarios.filter(u => u.estado === filtros.estado)
  }

  return usuarios
}

export function obtenerUsuario(id) {
  // TODO: reemplazar con fetch GET /api/usuarios/:id
  return obtenerUsuarios().find(u => u.id === parseInt(id))
}

export function obtenerUsuarioPorCorreo(correo) {
  return obtenerUsuarios().find(u => u.correo.toLowerCase() === String(correo).toLowerCase())
}

export function crearUsuario(datos) {
  // TODO: reemplazar con fetch POST /api/usuarios (registro)
  const usuarios = obtenerUsuarios()

  const nuevo = {
    id: siguienteId(usuarios),
    rol: 'huesped',
    estado: 'activa',
    favoritos: [],
    preferencias: { idioma: 'es', moneda: 'crc', tipoPreferido: '', notificaciones: true },
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

export function eliminarUsuario(id) {
  // TODO: reemplazar con fetch DELETE /api/usuarios/:id
  const usuarios = obtenerUsuarios()
  guardar('usuarios', usuarios.filter(u => u.id !== parseInt(id)))
}

export function verificarCredenciales(correo, clave) {
  // TODO: reemplazar con fetch POST /api/auth/login
  return obtenerUsuarios().find(u => (
    u.correo.toLowerCase() === String(correo).toLowerCase() && u.clave === clave
  ))
}

/**
 * Modelo de cuenta única: toda cuenta nace huésped y se convierte en anfitrión
 * al publicar su primera propiedad (taller-1/analisis-parte2-taller1.md §7).
 */
export function promoverAAnfitrion(id) {
  const usuario = obtenerUsuario(id)
  if (!usuario || usuario.rol !== 'huesped') return usuario
  return actualizarUsuario(id, { rol: 'anfitrion' })
}
