import { leer, guardar, siguienteId } from './storage'

export function obtenerUsuarios(filtros = {}) {
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
  return obtenerUsuarios().find(u => u.id === parseInt(id))
}

export function obtenerUsuarioPorCorreo(correo) {
  return obtenerUsuarios().find(u => u.correo.toLowerCase() === String(correo).toLowerCase())
}

export function crearUsuario(datos) {
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
  const usuarios = obtenerUsuarios()
  const indice = usuarios.findIndex(u => u.id === parseInt(id))
  if (indice === -1) return null

  usuarios[indice] = { ...usuarios[indice], ...datos }
  guardar('usuarios', usuarios)
  return usuarios[indice]
}

export function eliminarUsuario(id) {
  const usuarios = obtenerUsuarios()
  guardar('usuarios', usuarios.filter(u => u.id !== parseInt(id)))
}

export function verificarCredenciales(correo, clave) {
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
