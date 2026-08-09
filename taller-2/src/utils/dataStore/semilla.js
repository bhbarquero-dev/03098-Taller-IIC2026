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
      imagenes: ['sala.jpg', 'cocina.jpg', 'cuarto.jpg']
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
      imagenes: ['cocina.jpg', 'cuarto.jpg']
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
      imagenes: ['montaña.jpg', 'sala.jpg', 'cuarto.jpg']
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
      imagenes: ['playa.jpg', 'cuarto.jpg']
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
      imagenes: ['playa.jpg', 'sala.jpg', 'cocina.jpg']
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
      imagenes: ['cuarto.jpg', 'cocina.jpg']
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
      imagenes: ['sala.jpg', 'cocina.jpg', 'cuarto.jpg']
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
      imagenes: ['montaña.jpg', 'cuarto.jpg']
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

  const reservas = [
    {
      id: 1,
      propiedadId: 1,
      usuarioId: 1,
      fechaEntrada: '2026-08-12',
      fechaSalida: '2026-08-17',
      huespedes: 4,
      estado: 'confirmada'
    },
    {
      id: 2,
      propiedadId: 1,
      usuarioId: 1,
      fechaEntrada: '2026-08-17',
      fechaSalida: '2026-08-19',
      huespedes: 2,
      estado: 'confirmada'
    },
    {
      id: 3,
      propiedadId: 2,
      usuarioId: 1,
      fechaEntrada: '2026-08-05',
      fechaSalida: '2026-08-08',
      huespedes: 2,
      estado: 'confirmada'
    },
    {
      id: 4,
      propiedadId: 3,
      usuarioId: 1,
      fechaEntrada: '2026-08-03',
      fechaSalida: '2026-08-06',
      huespedes: 3,
      estado: 'confirmada'
    },
    {
      id: 5,
      propiedadId: 4,
      usuarioId: 1,
      fechaEntrada: '2026-08-20',
      fechaSalida: '2026-08-23',
      huespedes: 2,
      estado: 'confirmada'
    },
    {
      id: 6,
      propiedadId: 5,
      usuarioId: 1,
      fechaEntrada: '2026-08-10',
      fechaSalida: '2026-08-14',
      huespedes: 6,
      estado: 'confirmada'
    },
    {
      id: 7,
      propiedadId: 6,
      usuarioId: 1,
      fechaEntrada: '2026-08-15',
      fechaSalida: '2026-08-17',
      huespedes: 2,
      estado: 'confirmada'
    },
    {
      id: 8,
      propiedadId: 7,
      usuarioId: 1,
      fechaEntrada: '2026-08-22',
      fechaSalida: '2026-08-27',
      huespedes: 5,
      estado: 'confirmada'
    },
    {
      id: 9,
      propiedadId: 8,
      usuarioId: 1,
      fechaEntrada: '2026-08-06',
      fechaSalida: '2026-08-09',
      huespedes: 3,
      estado: 'confirmada'
    }
  ]

  const resenas = [
    {
      id: 1,
      propiedadId: 1,
      autor: 'María F.',
      comentario: 'La casa estaba impecable y la piscina fue el punto favorito de los niños. Volveríamos sin dudarlo.',
      valoracion: 5,
      fecha: '2026-06-02'
    },
    {
      id: 2,
      propiedadId: 1,
      autor: 'Carlos R.',
      comentario: 'Muy buena ubicación, aunque el camino de acceso es algo angosto para autos grandes.',
      valoracion: 4,
      fecha: '2026-05-14'
    },
    {
      id: 3,
      propiedadId: 1,
      autor: 'Andrea V.',
      comentario: 'Excelente atención del anfitrión, respondió todas nuestras consultas antes de llegar.',
      valoracion: 5,
      fecha: '2026-07-20'
    },
    {
      id: 4,
      propiedadId: 4,
      autor: 'Luis M.',
      comentario: 'El glamping frente al mar fue una experiencia increíble, muy recomendado para parejas.',
      valoracion: 5,
      fecha: '2026-07-01'
    },
    {
      id: 5,
      propiedadId: 2,
      autor: 'Fernanda S.',
      comentario: 'Ubicación céntrica, ideal para moverse a pie por San José. El apartamento es pequeño pero muy funcional.',
      valoracion: 4,
      fecha: '2026-06-18'
    },
    {
      id: 6,
      propiedadId: 2,
      autor: 'Ricardo P.',
      comentario: 'Todo limpio y como en las fotos. La cocina equipada fue un gran plus para nuestra estadía.',
      valoracion: 5,
      fecha: '2026-04-22'
    },
    {
      id: 7,
      propiedadId: 3,
      autor: 'Gabriela M.',
      comentario: 'La chimenea y el sonido del bosque hicieron la estadía perfecta para desconectarse.',
      valoracion: 5,
      fecha: '2026-05-30'
    },
    {
      id: 8,
      propiedadId: 3,
      autor: 'Esteban Q.',
      comentario: 'Muy buena para ir con mascota, el anfitrión fue claro con las reglas desde el inicio.',
      valoracion: 4,
      fecha: '2026-07-11'
    },
    {
      id: 9,
      propiedadId: 5,
      autor: 'Daniela C.',
      comentario: 'Perfecta para grupos grandes, la cercanía a la playa fue justo lo que buscábamos.',
      valoracion: 5,
      fecha: '2026-06-25'
    },
    {
      id: 10,
      propiedadId: 5,
      autor: 'Jorge A.',
      comentario: 'Buen espacio y parqueo amplio, aunque el ruido de la calle se siente un poco en las noches.',
      valoracion: 4,
      fecha: '2026-05-08'
    },
    {
      id: 11,
      propiedadId: 6,
      autor: 'Paola R.',
      comentario: 'Ideal para una escapada corta al Valle Central, el anfitrión respondió rápido a todo.',
      valoracion: 4,
      fecha: '2026-07-05'
    },
    {
      id: 12,
      propiedadId: 6,
      autor: 'Manuel T.',
      comentario: 'Apartamento acogedor y bien ubicado, buena relación precio-calidad.',
      valoracion: 5,
      fecha: '2026-04-30'
    },
    {
      id: 13,
      propiedadId: 7,
      autor: 'Valeria N.',
      comentario: 'La piscina privada fue el punto más alto, villa exclusiva y muy bien mantenida.',
      valoracion: 5,
      fecha: '2026-07-15'
    },
    {
      id: 14,
      propiedadId: 7,
      autor: 'Diego H.',
      comentario: 'Excelente para grupos grandes, aunque el precio por noche es de los más altos del catálogo.',
      valoracion: 4,
      fecha: '2026-06-09'
    },
    {
      id: 15,
      propiedadId: 8,
      autor: 'Camila B.',
      comentario: 'Vista a la montaña espectacular, muy tranquila y aislada del ruido.',
      valoracion: 5,
      fecha: '2026-06-30'
    },
    {
      id: 16,
      propiedadId: 8,
      autor: 'Andrés L.',
      comentario: 'Buena opción para desconectarse, la chimenea ayudó mucho con el frío de la noche.',
      valoracion: 4,
      fecha: '2026-05-19'
    }
  ]

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
