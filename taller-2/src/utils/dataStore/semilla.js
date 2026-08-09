import { STORAGE_PREFIX, sembrarSiVacio } from './storage'

/**
 * Versión del esquema de datos de ejemplo.
 *
 * `sembrarSiVacio` nunca reescribe lo que ya está guardado, así que quien abrió
 * el sitio con una versión anterior se quedaría sin los campos nuevos. Al subir
 * esta constante, la próxima carga limpia el storage y vuelve a sembrar.
 */
const VERSION_DATOS = 3
const CLAVE_VERSION = `${STORAGE_PREFIX}version_datos`

const CONTACTO_ANFITRION = {
  contactoCorreo: 'anfitrion@ejemplo.com',
  contactoTelefono: '+506 8888-0001'
}

const POLITICAS_BASE = {
  politicaCancelacion: 'Cancelación gratuita hasta 5 días antes de la fecha de entrada.',
  mascotas: false,
  fumar: false,
  horaEntrada: '15:00',
  horaSalida: '11:00'
}

export function inicializarDatosEjemplo() {
  /**
   * Llena localStorage con datos de ejemplo, entidad por entidad, solo para las
   * que aún no tengan datos guardados. Se llama una vez al iniciar la app.
   */

  if (localStorage.getItem(CLAVE_VERSION) !== String(VERSION_DATOS)) {
    limpiarTodo()
    localStorage.setItem(CLAVE_VERSION, String(VERSION_DATOS))
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
      descripcion: 'Villa lujosa con vistas al océano',
      imagenes: ['sala.jpg', 'cocina.jpg', 'cuarto.jpg'],
      anfitrionId: 2,
      estado: 'publicada',
      promocionId: 1,
      fechasBloqueadas: ['2026-08-29', '2026-08-30'],
      consultasContador: 42,
      ...POLITICAS_BASE,
      ...CONTACTO_ANFITRION
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
      imagenes: ['cocina.jpg', 'cuarto.jpg'],
      anfitrionId: 2,
      estado: 'publicada',
      fechasBloqueadas: [],
      consultasContador: 27,
      ...POLITICAS_BASE,
      politicaCancelacion: 'Cancelación gratuita hasta 48 horas antes de la fecha de entrada.',
      ...CONTACTO_ANFITRION
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
      imagenes: ['montaña.jpg', 'sala.jpg', 'cuarto.jpg'],
      anfitrionId: 2,
      estado: 'publicada',
      promocionId: 3,
      fechasBloqueadas: [],
      consultasContador: 35,
      ...POLITICAS_BASE,
      mascotas: true,
      ...CONTACTO_ANFITRION
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
      imagenes: ['playa.jpg', 'cuarto.jpg'],
      anfitrionId: 2,
      estado: 'publicada',
      fechasBloqueadas: [],
      consultasContador: 19,
      ...POLITICAS_BASE,
      ...CONTACTO_ANFITRION
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
      imagenes: ['playa.jpg', 'sala.jpg', 'cocina.jpg'],
      anfitrionId: 4,
      estado: 'publicada',
      fechasBloqueadas: [],
      consultasContador: 31,
      ...POLITICAS_BASE,
      mascotas: true,
      politicaCancelacion: 'Sin reembolso a partir de la confirmación de la reserva.',
      contactoCorreo: 'marcela@ejemplo.com',
      contactoTelefono: '+506 8888-0003'
    },
    {
      id: 6,
      nombre: 'Apartamento Heredia',
      tipo: 'apartamento',
      ubicacion: 'Heredia, Costa Rica',
      capacidad: 2,
      precioNoche: 35,
      valoracion: 4.4,
      servicios: ['wifi', 'cocina'],
      descripcion: 'Apartamento acogedor cerca del Valle Central, ideal para estadías cortas',
      imagenes: ['cuarto.jpg', 'cocina.jpg'],
      anfitrionId: 4,
      estado: 'pendiente',
      fechasBloqueadas: [],
      consultasContador: 8,
      ...POLITICAS_BASE,
      contactoCorreo: 'marcela@ejemplo.com',
      contactoTelefono: '+506 8888-0003'
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
      imagenes: ['sala.jpg', 'cocina.jpg', 'cuarto.jpg'],
      anfitrionId: 2,
      estado: 'publicada',
      promocionId: 1,
      fechasBloqueadas: [],
      consultasContador: 24,
      ...POLITICAS_BASE,
      politicaCancelacion: 'Sin reembolso a partir de la confirmación de la reserva.',
      ...CONTACTO_ANFITRION
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
      imagenes: ['montaña.jpg', 'cuarto.jpg'],
      anfitrionId: 4,
      estado: 'rechazada',
      motivoRechazo: 'Las fotografías no corresponden a la ubicación declarada.',
      fechasBloqueadas: [],
      consultasContador: 12,
      ...POLITICAS_BASE,
      contactoCorreo: 'marcela@ejemplo.com',
      contactoTelefono: '+506 8888-0003'
    }
  ]

  const usuarios = [
    {
      id: 1,
      nombre: 'Huésped Demo',
      correo: 'huesped@ejemplo.com',
      clave: 'huesped123',
      rol: 'huesped',
      estado: 'activa',
      telefono: '+506 8888-0000',
      preferencias: { idioma: 'es', moneda: 'crc', tipoPreferido: 'villa', notificaciones: true },
      favoritos: [1, 3]
    },
    {
      id: 2,
      nombre: 'Anfitrión Demo',
      correo: 'anfitrion@ejemplo.com',
      clave: 'anfitrion123',
      rol: 'anfitrion',
      estado: 'activa',
      telefono: '+506 8888-0001',
      preferencias: { idioma: 'es', moneda: 'crc', tipoPreferido: 'apartamento', notificaciones: false },
      favoritos: []
    },
    {
      id: 3,
      nombre: 'Admin Demo',
      correo: 'admin@ejemplo.com',
      clave: 'admin123',
      rol: 'administrador',
      estado: 'activa',
      telefono: '+506 8888-0002',
      preferencias: { idioma: 'es', moneda: 'usd', tipoPreferido: 'cabaña', notificaciones: true },
      favoritos: []
    },
    {
      id: 4,
      nombre: 'Marcela Vargas',
      correo: 'marcela@ejemplo.com',
      clave: 'marcela123',
      rol: 'anfitrion',
      estado: 'suspendida',
      telefono: '+506 8888-0003',
      preferencias: { idioma: 'en', moneda: 'usd', tipoPreferido: 'casa', notificaciones: true },
      favoritos: [4]
    }
  ]

  const reservas = [
    { id: 1, propiedadId: 1, anfitrionId: 2, usuarioId: 1, fechaEntrada: '2026-08-12', fechaSalida: '2026-08-17', huespedes: 4, monto: 425, estado: 'confirmada', estadoPago: 'pagado' },
    { id: 2, propiedadId: 1, anfitrionId: 2, usuarioId: 1, fechaEntrada: '2026-08-17', fechaSalida: '2026-08-19', huespedes: 2, monto: 170, estado: 'pendiente', estadoPago: 'pendiente' },
    { id: 3, propiedadId: 2, anfitrionId: 2, usuarioId: 1, fechaEntrada: '2026-08-05', fechaSalida: '2026-08-08', huespedes: 2, monto: 120, estado: 'finalizada', estadoPago: 'pagado' },
    { id: 4, propiedadId: 3, anfitrionId: 2, usuarioId: 1, fechaEntrada: '2026-08-03', fechaSalida: '2026-08-06', huespedes: 3, monto: 180, estado: 'finalizada', estadoPago: 'pagado' },
    { id: 5, propiedadId: 4, anfitrionId: 2, usuarioId: 1, fechaEntrada: '2026-08-20', fechaSalida: '2026-08-23', huespedes: 2, monto: 210, estado: 'confirmada', estadoPago: 'pagado' },
    {
      id: 6,
      propiedadId: 5,
      anfitrionId: 4,
      usuarioId: 1,
      fechaEntrada: '2026-08-10',
      fechaSalida: '2026-08-14',
      huespedes: 6,
      monto: 380,
      estado: 'cancelada',
      estadoPago: 'reembolsado',
      motivoCancelacion: 'Cambio de planes de viaje del huésped.',
      decisionCancelacion: 'aprobada',
      decisionReembolso: 'aprobado',
      montoReembolso: 380,
      motivoReembolso: 'Cancelación dentro del plazo de la política flexible.'
    },
    { id: 7, propiedadId: 6, anfitrionId: 4, usuarioId: 1, fechaEntrada: '2026-08-15', fechaSalida: '2026-08-17', huespedes: 2, monto: 70, estado: 'pendiente', estadoPago: 'pendiente' },
    { id: 8, propiedadId: 7, anfitrionId: 2, usuarioId: 1, fechaEntrada: '2026-08-22', fechaSalida: '2026-08-27', huespedes: 5, monto: 550, estado: 'confirmada', estadoPago: 'pendiente' },
    { id: 9, propiedadId: 8, anfitrionId: 4, usuarioId: 1, fechaEntrada: '2026-08-06', fechaSalida: '2026-08-09', huespedes: 3, monto: 195, estado: 'finalizada', estadoPago: 'pagado' },
    { id: 10, propiedadId: 3, anfitrionId: 2, usuarioId: 3, fechaEntrada: '2026-09-02', fechaSalida: '2026-09-05', huespedes: 2, monto: 180, estado: 'pendiente', estadoPago: 'pendiente' }
  ]

  const resenas = [
    { id: 1, propiedadId: 1, usuarioId: 1, reservaId: 1, autor: 'María F.', comentario: 'La casa estaba impecable y la piscina fue el punto favorito de los niños. Volveríamos sin dudarlo.', valoracion: 5, fecha: '2026-06-02', respuestaAnfitrion: '¡Gracias, María! Nos alegra que la disfrutaran en familia.', fechaRespuesta: '2026-06-03' },
    { id: 2, propiedadId: 1, autor: 'Carlos R.', comentario: 'Muy buena ubicación, aunque el camino de acceso es algo angosto para autos grandes.', valoracion: 4, fecha: '2026-05-14' },
    { id: 3, propiedadId: 1, autor: 'Andrea V.', comentario: 'Excelente atención del anfitrión, respondió todas nuestras consultas antes de llegar.', valoracion: 5, fecha: '2026-07-20' },
    { id: 4, propiedadId: 4, autor: 'Luis M.', comentario: 'El glamping frente al mar fue una experiencia increíble, muy recomendado para parejas.', valoracion: 5, fecha: '2026-07-01' },
    { id: 5, propiedadId: 2, usuarioId: 1, reservaId: 3, autor: 'Fernanda S.', comentario: 'Ubicación céntrica, ideal para moverse a pie por San José. El apartamento es pequeño pero muy funcional.', valoracion: 4, fecha: '2026-06-18' },
    { id: 6, propiedadId: 2, autor: 'Ricardo P.', comentario: 'Todo limpio y como en las fotos. La cocina equipada fue un gran plus para nuestra estadía.', valoracion: 5, fecha: '2026-04-22' },
    { id: 7, propiedadId: 3, autor: 'Gabriela M.', comentario: 'La chimenea y el sonido del bosque hicieron la estadía perfecta para desconectarse.', valoracion: 5, fecha: '2026-05-30' },
    { id: 8, propiedadId: 3, autor: 'Esteban Q.', comentario: 'Muy buena para ir con mascota, el anfitrión fue claro con las reglas desde el inicio.', valoracion: 4, fecha: '2026-07-11' },
    { id: 9, propiedadId: 5, autor: 'Daniela C.', comentario: 'Perfecta para grupos grandes, la cercanía a la playa fue justo lo que buscábamos.', valoracion: 5, fecha: '2026-06-25' },
    { id: 10, propiedadId: 5, autor: 'Jorge A.', comentario: 'Buen espacio y parqueo amplio, aunque el ruido de la calle se siente un poco en las noches.', valoracion: 4, fecha: '2026-05-08' },
    { id: 11, propiedadId: 6, autor: 'Paola R.', comentario: 'Ideal para una escapada corta al Valle Central, el anfitrión respondió rápido a todo.', valoracion: 4, fecha: '2026-07-05' },
    { id: 12, propiedadId: 6, autor: 'Manuel T.', comentario: 'Apartamento acogedor y bien ubicado, buena relación precio-calidad.', valoracion: 5, fecha: '2026-04-30' },
    { id: 13, propiedadId: 7, autor: 'Valeria N.', comentario: 'La piscina privada fue el punto más alto, villa exclusiva y muy bien mantenida.', valoracion: 5, fecha: '2026-07-15' },
    { id: 14, propiedadId: 7, autor: 'Diego H.', comentario: 'Excelente para grupos grandes, aunque el precio por noche es de los más altos del catálogo.', valoracion: 4, fecha: '2026-06-09' },
    { id: 15, propiedadId: 8, autor: 'Camila B.', comentario: 'Vista a la montaña espectacular, muy tranquila y aislada del ruido.', valoracion: 5, fecha: '2026-06-30' },
    { id: 16, propiedadId: 8, autor: 'Andrés L.', comentario: 'Buena opción para desconectarse, la chimenea ayudó mucho con el frío de la noche.', valoracion: 4, fecha: '2026-05-19', bloqueada: true }
  ]

  const promociones = [
    {
      id: 1,
      titulo: 'Escapada de temporada seca',
      descripcion: '15% de descuento en alojamientos de Guanacaste durante diciembre y enero.',
      beneficio: '15% de descuento sobre el precio por noche',
      descuento: 15,
      vigenciaInicio: '2026-12-01',
      vigenciaFin: '2027-01-31',
      estado: 'activa',
      propiedadesParticipantes: [1, 7]
    },
    {
      id: 2,
      titulo: 'Estadías largas',
      descripcion: 'Beneficios especiales para reservas de más de 7 noches.',
      beneficio: '20% de descuento a partir de la séptima noche',
      descuento: 20,
      vigenciaInicio: '2026-06-01',
      vigenciaFin: '2026-12-31',
      estado: 'activa',
      propiedadesParticipantes: [5]
    },
    {
      id: 3,
      titulo: 'Experiencias con anfitrión',
      descripcion: 'Tours y actividades ofrecidas directamente por los anfitriones locales.',
      beneficio: 'Actividad guiada incluida en la estadía',
      descuento: 0,
      vigenciaInicio: '2026-07-01',
      vigenciaFin: '2026-11-30',
      estado: 'activa',
      propiedadesParticipantes: [3]
    },
    {
      id: 4,
      titulo: 'Primera reserva con descuento',
      descripcion: '10% de descuento en tu primera reserva en StayBooker 360.',
      beneficio: '10% de descuento en la primera reserva',
      descuento: 10,
      vigenciaInicio: '2026-01-01',
      vigenciaFin: '2026-12-31',
      estado: 'activa',
      propiedadesParticipantes: []
    },
    {
      id: 5,
      titulo: 'Semana de bienestar',
      descripcion: 'Alojamientos con espacios de descanso, naturaleza y desconexión.',
      beneficio: '12% de descuento en estadías de cinco noches o más',
      descuento: 12,
      vigenciaInicio: '2026-03-01',
      vigenciaFin: '2026-05-31',
      estado: 'finalizada',
      propiedadesParticipantes: [4]
    }
  ]

  const posts = [
    {
      id: 1,
      titulo: '5 razones para visitar Guanacaste esta temporada seca',
      autor: 'Camila Rojas',
      fechaPublicacion: '2026-07-03',
      imagen: 'playa.jpg',
      imagenAlt: 'Playa en Guanacaste, Costa Rica',
      imagenPie: 'Guanacaste al atardecer',
      extracto: 'Un recorrido por las playas, el clima y los alojamientos mejor valorados de la zona para quienes buscan sol garantizado entre diciembre y abril.',
      contenido: [
        'Entre diciembre y abril, Guanacaste concentra algunos de los días más soleados de todo el país. Para quienes buscan playas extensas, clima estable y una oferta amplia de alojamientos, esta temporada suele ser la más recomendada del año.',
        '1. Clima predecible: la temporada seca ofrece cielos despejados casi todos los días, ideal para quienes planean su viaje con poco margen de flexibilidad.',
        '2. Playas para todos los gustos: desde bahías tranquilas hasta puntos reconocidos para el surf, la provincia reúne una variedad de costas a poca distancia entre sí.',
        '3. Alojamientos mejor valorados: varias de las propiedades con mejor calificación dentro de StayBooker 360 se concentran en esta zona, con opciones que van desde villas hasta glampings frente al mar.',
        '4. Actividades al aire libre: senderismo, deportes acuáticos y recorridos por parques nacionales cercanos complementan la estadía sin necesidad de trasladarse largas distancias.',
        '5. Buena relación entre disponibilidad y precio antes de la temporada alta de fin de año, lo que permite reservar con más opciones disponibles en el calendario.'
      ],
      estado: 'publicado'
    },
    {
      id: 2,
      titulo: 'Cómo armar el equipaje ideal para una estadía de fin de semana',
      autor: 'Andrés Solano',
      fechaPublicacion: '2026-06-22',
      imagen: 'montaña.jpg',
      imagenAlt: 'Paisaje de montaña con cabañas y glampings en Costa Rica',
      imagenPie: 'Rumbo a la montaña',
      extracto: 'Recomendaciones prácticas para viajar liviano sin dejar nada esencial atrás, pensadas para estancias cortas en cabañas y glampings.',
      contenido: [
        'Una estadía de dos noches no necesita la misma preparación que un viaje largo, pero sí exige decisiones más precisas: cada objeto que se empaca de más pesa durante todo el trayecto.',
        'Ropa por capas: en zonas de montaña la temperatura baja bastante después del atardecer, aunque el día haya sido caluroso. Dos prendas ligeras superpuestas rinden más que una gruesa.',
        'Revisar qué ofrece el alojamiento: muchas cabañas y glampings incluyen toallas, secadora de pelo y utensilios de cocina. La ficha de cada propiedad en StayBooker 360 detalla los servicios disponibles.',
        'Un botiquín mínimo: repelente, protector solar y los medicamentos de uso personal. En destinos rurales la farmacia más cercana puede quedar a varios kilómetros.',
        'Documentos y respaldos digitales: la confirmación de la reserva, un documento de identidad y el contacto directo del anfitrión, guardados también fuera de línea por si la señal falla.'
      ],
      estado: 'publicado'
    },
    {
      id: 3,
      titulo: 'Qué preguntar antes de reservar: políticas de cancelación y check-in',
      autor: 'Camila Rojas',
      fechaPublicacion: '2026-06-10',
      imagen: 'playa.jpg',
      imagenAlt: 'Playa en Costa Rica al llegar al destino de hospedaje',
      imagenPie: 'Antes de llegar al alojamiento',
      extracto: 'Una guía sobre la información de hospedaje que conviene revisar en la ficha de cada propiedad antes de confirmar una reserva.',
      contenido: [
        'La mayoría de los inconvenientes en una estadía no vienen del alojamiento en sí, sino de expectativas que nunca se aclararon antes de reservar. Conviene revisar cuatro puntos en la ficha de la propiedad.',
        'Política de cancelación: flexible, moderada o estricta determina cuánto se recupera y hasta qué momento. Es el dato que más pesa cuando el viaje depende de terceros.',
        'Horarios de entrada y salida: si el vuelo o el traslado llegan fuera del rango indicado, hay que coordinarlo con el anfitrión antes de confirmar, no el mismo día.',
        'Reglas de convivencia: mascotas, fumado, visitas y horarios de silencio están declarados en cada propiedad y evitan discusiones durante la estadía.',
        'Vía de contacto con el anfitrión: el formulario de consulta de cada ficha deja constancia escrita de lo acordado, algo que una llamada no ofrece.'
      ],
      estado: 'borrador'
    }
  ]

  const consultas = [
    {
      id: 1,
      propiedadId: 1,
      anfitrionId: 2,
      usuarioId: 1,
      huespedNombre: 'Huésped Demo',
      huespedCorreo: 'huesped@ejemplo.com',
      asunto: 'Disponibilidad para setiembre',
      mensaje: '¿La villa estará disponible la primera semana de setiembre? Somos cuatro personas y llegaríamos en la tarde.',
      fecha: '2026-07-28',
      estado: 'pendiente',
      respuesta: ''
    },
    {
      id: 2,
      propiedadId: 3,
      anfitrionId: 2,
      usuarioId: 1,
      huespedNombre: 'Gabriela M.',
      huespedCorreo: 'gabriela@ejemplo.com',
      asunto: 'Consulta sobre mascotas',
      mensaje: 'Viajamos con un perro pequeño. ¿Hay alguna restricción de tamaño o costo adicional?',
      fecha: '2026-07-19',
      estado: 'respondida',
      respuesta: 'Sí se admiten mascotas pequeñas, sin costo adicional. Solo pedimos avisar con antelación para preparar el espacio.',
      fechaRespuesta: '2026-07-20'
    },
    {
      id: 3,
      propiedadId: 2,
      anfitrionId: 2,
      huespedNombre: 'Ricardo P.',
      huespedCorreo: 'ricardo@ejemplo.com',
      asunto: 'Parqueo cercano',
      mensaje: '¿El apartamento cuenta con parqueo propio o hay alguna opción cercana que recomienden?',
      fecha: '2026-08-02',
      estado: 'pendiente',
      respuesta: ''
    },
    {
      id: 4,
      propiedadId: 5,
      anfitrionId: 4,
      huespedNombre: 'Daniela C.',
      huespedCorreo: 'daniela@ejemplo.com',
      asunto: 'Capacidad real de la casa',
      mensaje: 'Somos ocho adultos. ¿Las camas alcanzan sin necesidad de colchones adicionales?',
      fecha: '2026-07-11',
      estado: 'pendiente',
      respuesta: ''
    }
  ]

  const incidencias = [
    {
      id: 1,
      entidad: 'alojamiento',
      entidadId: 8,
      tipo: 'contenido',
      descripcion: 'Las fotografías publicadas no corresponden a la ubicación declarada en la ficha.',
      fecha: '2026-07-25'
    },
    {
      id: 2,
      entidad: 'usuario',
      entidadId: 4,
      tipo: 'convivencia',
      descripcion: 'Reportes reiterados de huéspedes sobre respuestas fuera de plazo.',
      fecha: '2026-08-01'
    },
    {
      id: 3,
      entidad: 'reserva',
      entidadId: 6,
      tipo: 'pago',
      descripcion: 'Reembolso procesado fuera del plazo habitual por revisión manual.',
      fecha: '2026-08-04'
    }
  ]

  sembrarSiVacio('propiedades', propiedades)
  sembrarSiVacio('usuarios', usuarios)
  sembrarSiVacio('reservas', reservas)
  sembrarSiVacio('resenas', resenas)
  sembrarSiVacio('promociones', promociones)
  sembrarSiVacio('posts', posts)
  sembrarSiVacio('consultas', consultas)
  sembrarSiVacio('incidencias', incidencias)
}

export function limpiarTodo() {
  /**
   * Borra todo el storage del sitio. Útil para reiniciar la demostración.
   * No borra la marca de versión: la escribe quien llama a la inicialización.
   */
  Object.keys(localStorage).forEach((clave) => {
    if (clave.startsWith(STORAGE_PREFIX)) {
      localStorage.removeItem(clave)
    }
  })
}

/** Reinicia los datos de ejemplo desde cero (botón de la interfaz). */
export function reiniciarDatosEjemplo() {
  limpiarTodo()
  inicializarDatosEjemplo()
}
