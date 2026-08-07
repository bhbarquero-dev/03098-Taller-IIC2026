/**
 * Data Store — Abstracción de persistencia
 *
 * Hoy: localStorage
 * Futuro: API REST backend
 *
 * La interfaz (firmas de funciones) permanece igual en ambos casos.
 * Solo la implementación interna cambia.
 */

const STORAGE_PREFIX = 'staybooker_'

// ============ Propiedades ============

export function obtenerPropiedades(filtros = {}) {
  // TODO: reemplazar con fetch GET /api/propiedades?...
  const datos = localStorage.getItem(`${STORAGE_PREFIX}propiedades`)
  const propiedades = datos ? JSON.parse(datos) : []

  // Aplicar filtros simulados
  if (filtros.destino) {
    return propiedades.filter(p =>
      p.ubicacion.toLowerCase().includes(filtros.destino.toLowerCase())
    )
  }
  return propiedades
}

export function obtenerPropiedad(id) {
  // TODO: reemplazar con fetch GET /api/propiedades/:id
  const datos = localStorage.getItem(`${STORAGE_PREFIX}propiedades`)
  const propiedades = datos ? JSON.parse(datos) : []
  return propiedades.find(p => p.id === parseInt(id))
}

export function crearPropiedad(datos) {
  // TODO: reemplazar con fetch POST /api/propiedades
  const almacenadas = localStorage.getItem(`${STORAGE_PREFIX}propiedades`)
  const propiedades = almacenadas ? JSON.parse(almacenadas) : []

  const nueva = {
    id: Math.max(...propiedades.map(p => p.id), 0) + 1,
    ...datos,
    fechaCreacion: new Date().toISOString()
  }

  propiedades.push(nueva)
  localStorage.setItem(`${STORAGE_PREFIX}propiedades`, JSON.stringify(propiedades))
  return nueva
}

export function actualizarPropiedad(id, datos) {
  // TODO: reemplazar con fetch PATCH /api/propiedades/:id
  const almacenadas = localStorage.getItem(`${STORAGE_PREFIX}propiedades`)
  const propiedades = almacenadas ? JSON.parse(almacenadas) : []

  const indice = propiedades.findIndex(p => p.id === parseInt(id))
  if (indice === -1) return null

  propiedades[indice] = { ...propiedades[indice], ...datos }
  localStorage.setItem(`${STORAGE_PREFIX}propiedades`, JSON.stringify(propiedades))
  return propiedades[indice]
}

export function eliminarPropiedad(id) {
  // TODO: reemplazar con fetch DELETE /api/propiedades/:id
  const almacenadas = localStorage.getItem(`${STORAGE_PREFIX}propiedades`)
  const propiedades = almacenadas ? JSON.parse(almacenadas) : []

  const filtradas = propiedades.filter(p => p.id !== parseInt(id))
  localStorage.setItem(`${STORAGE_PREFIX}propiedades`, JSON.stringify(filtradas))
}

// ============ Reservas ============

export function obtenerReservas(filtros = {}) {
  // TODO: reemplazar con fetch GET /api/reservas
  const datos = localStorage.getItem(`${STORAGE_PREFIX}reservas`)
  let reservas = datos ? JSON.parse(datos) : []

  if (filtros.usuarioId) {
    reservas = reservas.filter(r => r.usuarioId === filtros.usuarioId)
  }
  if (filtros.propiedadId) {
    reservas = reservas.filter(r => r.propiedadId === filtros.propiedadId)
  }

  return reservas
}

export function obtenerReserva(id) {
  // TODO: reemplazar con fetch GET /api/reservas/:id
  const datos = localStorage.getItem(`${STORAGE_PREFIX}reservas`)
  const reservas = datos ? JSON.parse(datos) : []
  return reservas.find(r => r.id === parseInt(id))
}

export function crearReserva(datos) {
  // TODO: reemplazar con fetch POST /api/reservas
  const almacenadas = localStorage.getItem(`${STORAGE_PREFIX}reservas`)
  const reservas = almacenadas ? JSON.parse(almacenadas) : []

  const nueva = {
    id: Math.max(...reservas.map(r => r.id), 0) + 1,
    estado: 'confirmada',
    ...datos,
    fechaCreacion: new Date().toISOString()
  }

  reservas.push(nueva)
  localStorage.setItem(`${STORAGE_PREFIX}reservas`, JSON.stringify(reservas))
  return nueva
}

export function actualizarReserva(id, datos) {
  // TODO: reemplazar con fetch PATCH /api/reservas/:id
  const almacenadas = localStorage.getItem(`${STORAGE_PREFIX}reservas`)
  const reservas = almacenadas ? JSON.parse(almacenadas) : []

  const indice = reservas.findIndex(r => r.id === parseInt(id))
  if (indice === -1) return null

  reservas[indice] = { ...reservas[indice], ...datos }
  localStorage.setItem(`${STORAGE_PREFIX}reservas`, JSON.stringify(reservas))
  return reservas[indice]
}

export function cancelarReserva(id) {
  // TODO: reemplazar con fetch PATCH /api/reservas/:id/cancelar
  return actualizarReserva(id, { estado: 'cancelada' })
}

// ============ Usuarios ============

export function obtenerUsuarios() {
  // TODO: reemplazar con fetch GET /api/usuarios
  const datos = localStorage.getItem(`${STORAGE_PREFIX}usuarios`)
  return datos ? JSON.parse(datos) : []
}

export function obtenerUsuario(id) {
  // TODO: reemplazar con fetch GET /api/usuarios/:id
  const usuarios = obtenerUsuarios()
  return usuarios.find(u => u.id === parseInt(id))
}

export function crearUsuario(datos) {
  // TODO: reemplazar con fetch POST /api/usuarios (registro)
  const almacenados = obtenerUsuarios()

  const nuevo = {
    id: Math.max(...almacenados.map(u => u.id), 0) + 1,
    rol: 'huesped',
    ...datos,
    fechaCreacion: new Date().toISOString()
  }

  almacenados.push(nuevo)
  localStorage.setItem(`${STORAGE_PREFIX}usuarios`, JSON.stringify(almacenados))
  return nuevo
}

export function actualizarUsuario(id, datos) {
  // TODO: reemplazar con fetch PATCH /api/usuarios/:id
  const usuarios = obtenerUsuarios()
  const indice = usuarios.findIndex(u => u.id === parseInt(id))

  if (indice === -1) return null

  usuarios[indice] = { ...usuarios[indice], ...datos }
  localStorage.setItem(`${STORAGE_PREFIX}usuarios`, JSON.stringify(usuarios))
  return usuarios[indice]
}

export function verificarCredenciales(correo, clave) {
  // TODO: reemplazar con fetch POST /api/auth/login
  const usuarios = obtenerUsuarios()
  return usuarios.find(u => u.correo === correo && u.clave === clave)
}

// ============ Reseñas ============

export function obtenerResenas(filtros = {}) {
  // TODO: reemplazar con fetch GET /api/resenas
  const datos = localStorage.getItem(`${STORAGE_PREFIX}resenas`)
  let resenas = datos ? JSON.parse(datos) : []

  if (filtros.propiedadId) {
    resenas = resenas.filter(r => r.propiedadId === filtros.propiedadId)
  }

  return resenas
}

export function crearResena(datos) {
  // TODO: reemplazar con fetch POST /api/resenas
  const almacenadas = localStorage.getItem(`${STORAGE_PREFIX}resenas`)
  const resenas = almacenadas ? JSON.parse(almacenadas) : []

  const nueva = {
    id: Math.max(...resenas.map(r => r.id), 0) + 1,
    ...datos,
    fechaCreacion: new Date().toISOString()
  }

  resenas.push(nueva)
  localStorage.setItem(`${STORAGE_PREFIX}resenas`, JSON.stringify(resenas))
  return nueva
}

// ============ Promociones ============

export function obtenerPromociones() {
  // TODO: reemplazar con fetch GET /api/promociones
  const datos = localStorage.getItem(`${STORAGE_PREFIX}promociones`)
  return datos ? JSON.parse(datos) : []
}

export function obtenerPromocion(id) {
  // TODO: reemplazar con fetch GET /api/promociones/:id
  const promociones = obtenerPromociones()
  return promociones.find(p => p.id === parseInt(id))
}

// ============ Inicialización de datos de ejemplo ============

export function inicializarDatosEjemplo() {
  /**
   * Llena localStorage con datos de ejemplo si está vacío.
   * Llamar una sola vez en App init.
   */

  if (localStorage.getItem(`${STORAGE_PREFIX}propiedades`)) {
    return // Ya inicializado
  }

  const propiedades = [
    {
      id: 1,
      nombre: 'Villa Los Sueños',
      tipo: 'villa',
      ubicacion: 'Guanacaste, Costa Rica',
      capacidad: 6,
      precioNoche: 85,
      valoracion: 4.8,
      servicios: ['wifi', 'piscina', 'parqueo'],
      descripcion: 'Villa lujosa con vistas al océano'
    },
    {
      id: 2,
      nombre: 'Apartamento Central',
      tipo: 'apartamento',
      ubicacion: 'San José, Costa Rica',
      capacidad: 2,
      precioNoche: 40,
      valoracion: 4.6,
      servicios: ['wifi', 'cocina'],
      descripcion: 'Apartamento moderno en el corazón de la ciudad'
    },
    {
      id: 3,
      nombre: 'Cabaña del Bosque',
      tipo: 'cabaña',
      ubicacion: 'Monteverde, Costa Rica',
      capacidad: 4,
      precioNoche: 60,
      valoracion: 4.9,
      servicios: ['wifi', 'chimenea', 'parking'],
      descripcion: 'Cabaña rústica rodeada de naturaleza'
    }
  ]

  const usuarios = []
  const reservas = []
  const resenas = []
  const promociones = [
    {
      id: 1,
      titulo: 'Escapada de temporada seca',
      descripcion: '15% de descuento en alojamientos de Guanacaste durante diciembre y enero.',
      descuento: 15
    },
    {
      id: 2,
      titulo: 'Estadías largas',
      descripcion: 'Beneficios especiales para reservas de más de 7 noches.',
      descuento: 20
    }
  ]

  localStorage.setItem(`${STORAGE_PREFIX}propiedades`, JSON.stringify(propiedades))
  localStorage.setItem(`${STORAGE_PREFIX}usuarios`, JSON.stringify(usuarios))
  localStorage.setItem(`${STORAGE_PREFIX}reservas`, JSON.stringify(reservas))
  localStorage.setItem(`${STORAGE_PREFIX}resenas`, JSON.stringify(resenas))
  localStorage.setItem(`${STORAGE_PREFIX}promociones`, JSON.stringify(promociones))
}

// ============ Limpieza ============

export function limpiarTodo() {
  /**
   * Borra todo el storage. Útil para testing/reset.
   */
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(STORAGE_PREFIX)) {
      localStorage.removeItem(key)
    }
  })
}
