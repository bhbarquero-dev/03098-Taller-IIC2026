import { STORAGE_PREFIX, sembrarSiVacio } from './storage'

export function inicializarDatosEjemplo() {
  /**
   * Llena localStorage con datos de ejemplo, entidad por entidad,
   * solo para las que aún no tengan datos guardados.
   * Llamar una sola vez en App init.
   */

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
      descripcion: 'Villa lujosa con vistas al océano',
      imagen: 'sala.jpg'
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
      descripcion: 'Apartamento moderno en el corazón de la ciudad',
      anfitrionId: 2,
      imagen: 'cocina.jpg'
    },
    {
      id: 3,
      nombre: 'Cabaña del Bosque',
      tipo: 'cabaña',
      ubicacion: 'Monteverde, Costa Rica',
      capacidad: 4,
      precioNoche: 60,
      valoracion: 4.9,
      servicios: ['wifi', 'chimenea', 'parqueo', 'mascotas'],
      descripcion: 'Cabaña rústica rodeada de naturaleza',
      imagen: 'montaña.jpg'
    },
    {
      id: 4,
      nombre: 'Glamping Costa Azul',
      tipo: 'glamping',
      ubicacion: 'Puntarenas, Costa Rica',
      capacidad: 3,
      precioNoche: 70,
      valoracion: 4.7,
      servicios: ['wifi', 'vista al mar', 'desayuno'],
      descripcion: 'Glamping frente al mar con comodidades de hotel',
      imagen: 'playa.jpg'
    },
    {
      id: 5,
      nombre: 'Casa de playa',
      tipo: 'casa',
      ubicacion: 'Puntarenas, Costa Rica',
      capacidad: 8,
      precioNoche: 95,
      valoracion: 4.5,
      servicios: ['wifi', 'parqueo', 'cocina', 'mascotas'],
      descripcion: 'Casa amplia a pocos pasos de la playa, ideal para grupos',
      imagen: 'playa.jpg'
    },
    {
      id: 6,
      nombre: 'Apartamento',
      tipo: 'apartamento',
      ubicacion: 'Heredia, Costa Rica',
      capacidad: 2,
      precioNoche: 35,
      valoracion: 4.4,
      servicios: ['wifi', 'cocina'],
      descripcion: 'Apartamento acogedor cerca del Valle Central, ideal para estadías cortas',
      imagen: 'cuarto.jpg'
    },
    {
      id: 7,
      nombre: 'Villa con piscina',
      tipo: 'villa',
      ubicacion: 'Guanacaste, Costa Rica',
      capacidad: 6,
      precioNoche: 110,
      valoracion: 4.9,
      servicios: ['wifi', 'piscina', 'parqueo'],
      descripcion: 'Villa exclusiva con piscina privada en Guanacaste',
      imagen: 'sala.jpg'
    },
    {
      id: 8,
      nombre: 'Cabaña de montaña',
      tipo: 'cabaña',
      ubicacion: 'Monteverde, Costa Rica',
      capacidad: 4,
      precioNoche: 65,
      valoracion: 4.8,
      servicios: ['wifi', 'chimenea'],
      descripcion: 'Cabaña tranquila rodeada de montaña, sugerida por destinos de montaña',
      imagen: 'montaña.jpg'
    }
  ]

  const usuarios = [
    {
      id: 1,
      nombre: 'Huésped Demo',
      correo: 'huesped@ejemplo.com',
      clave: '123',
      rol: 'huesped',
      telefono: '+506 8888-0000',
      preferencias: {
        idioma: 'es',
        moneda: 'crc',
        tipoPreferido: 'villa',
        notificaciones: true
      },
      favoritos: [1, 3]
    },
    {
      id: 2,
      nombre: 'Anfitrión Demo',
      correo: 'anfitrion@ejemplo.com',
      clave: '123',
      rol: 'anfitrion',
      telefono: '+506 8888-0001',
      preferencias: {
        idioma: 'es',
        moneda: 'crc',
        tipoPreferido: 'apartamento',
        notificaciones: false
      },
      favoritos: []
    },
    {
      id: 3,
      nombre: 'Admin Demo',
      correo: 'admin@ejemplo.com',
      clave: '123',
      rol: 'administrador',
      telefono: '+506 8888-0002',
      preferencias: {
        idioma: 'es',
        moneda: 'usd',
        tipoPreferido: 'cabaña',
        notificaciones: true
      },
      favoritos: []
    }
  ]

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
    },
    {
      id: 3,
      titulo: 'Experiencias con anfitrión',
      descripcion: 'Tours y actividades ofrecidas directamente por los anfitriones locales.',
      descuento: 0
    },
    {
      id: 4,
      titulo: 'Primera reserva',
      descripcion: '10% de descuento en tu primera reserva en StayBooker 360.',
      descuento: 10
    }
  ]

  sembrarSiVacio('propiedades', propiedades)
  sembrarSiVacio('usuarios', usuarios)
  sembrarSiVacio('reservas', reservas)
  sembrarSiVacio('resenas', resenas)
  sembrarSiVacio('promociones', promociones)
}

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
