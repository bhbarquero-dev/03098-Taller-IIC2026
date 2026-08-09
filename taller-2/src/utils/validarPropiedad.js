import {
  correoValido,
  imagenesValidas,
  numeroEnRango,
  requerido,
  telefonoValido,
  textoMaximo,
  validar,
  videoValido
} from './validaciones'

/** Reglas del formulario de propiedad, compartidas entre alta y edición. */
export function validarPropiedad(valores) {
  return validar({
    nombre: requerido(valores.nombre),
    tipo: requerido(valores.tipo),
    descripcion: requerido(valores.descripcion) || textoMaximo(valores.descripcion),
    ubicacion: requerido(valores.ubicacion),
    capacidad: numeroEnRango(valores.capacidad, { min: 1, max: 30 }),
    precioNoche: numeroEnRango(valores.precioNoche, { min: 1 }),
    hora_entrada: requerido(valores.hora_entrada),
    hora_salida: requerido(valores.hora_salida),
    politica_cancelacion: requerido(valores.politica_cancelacion) || textoMaximo(valores.politica_cancelacion),
    contacto_telefono: telefonoValido(valores.contacto_telefono),
    contacto_correo: correoValido(valores.contacto_correo),
    imagenes: imagenesValidas(valores.imagenes),
    video: videoValido(valores.video)
  })
}

/** Valores iniciales del formulario a partir de una propiedad existente. */
export function valoresDesdePropiedad(propiedad) {
  return {
    nombre: propiedad?.nombre || '',
    tipo: propiedad?.tipo || 'casa',
    descripcion: propiedad?.descripcion || '',
    ubicacion: propiedad?.ubicacion || '',
    capacidad: propiedad?.capacidad || '',
    precioNoche: propiedad?.precioNoche || '',
    servicios: propiedad?.servicios || [],
    mascotas: propiedad?.mascotas ? 'si' : 'no',
    fumar: propiedad?.fumar ? 'si' : 'no',
    hora_entrada: propiedad?.horaEntrada || '15:00',
    hora_salida: propiedad?.horaSalida || '11:00',
    politica_cancelacion: propiedad?.politicaCancelacion || '',
    contacto_telefono: propiedad?.contactoTelefono || '',
    contacto_correo: propiedad?.contactoCorreo || '',
    imagenes: null,
    video: null
  }
}

/**
 * Traduce los valores del formulario a la forma con la que se guarda la entidad.
 * Los archivos elegidos se registran solo por su nombre: sin back-end no hay
 * dónde subirlos, y la ficha necesita al menos una imagen para no quedar vacía.
 */
export function propiedadDesdeValores(valores, propiedadPrevia) {
  const nombresImagenes = valores.imagenes && valores.imagenes.length > 0
    ? Array.from(valores.imagenes).map((archivo) => archivo.name)
    : propiedadPrevia?.imagenes?.length
      ? propiedadPrevia.imagenes
      : ['sala.jpg']

  const nombreVideo = valores.video && valores.video.length > 0
    ? valores.video[0].name
    : propiedadPrevia?.video

  return {
    nombre: valores.nombre.trim(),
    tipo: valores.tipo,
    descripcion: valores.descripcion.trim(),
    ubicacion: valores.ubicacion.trim(),
    capacidad: Number(valores.capacidad),
    precioNoche: Number(valores.precioNoche),
    servicios: valores.servicios || [],
    mascotas: valores.mascotas === 'si',
    fumar: valores.fumar === 'si',
    horaEntrada: valores.hora_entrada,
    horaSalida: valores.hora_salida,
    politicaCancelacion: valores.politica_cancelacion.trim(),
    contactoTelefono: valores.contacto_telefono.trim(),
    contactoCorreo: valores.contacto_correo.trim(),
    imagenes: nombresImagenes,
    video: nombreVideo
  }
}
