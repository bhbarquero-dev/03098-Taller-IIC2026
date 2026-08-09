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

  const usuarios = [
    {
      id: 1,
      nombre: 'Huésped Demo',
      correo: 'huesped@ejemplo.com',
      clave: '123',
      rol: 'huesped'
    },
    {
      id: 2,
      nombre: 'Anfitrión Demo',
      correo: 'anfitrion@ejemplo.com',
      clave: '123',
      rol: 'anfitrion'
    },
    {
      id: 3,
      nombre: 'Admin Demo',
      correo: 'admin@ejemplo.com',
      clave: '123',
      rol: 'administrador'
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
