/**
 * Catálogos de valores fijos del dominio.
 *
 * Aquí solo viven los VALORES que se guardan en el data store (y que un día
 * serían columnas o enumeraciones en base de datos). Sus etiquetas visibles
 * están en los diccionarios de i18n, bajo `tipos.*` y `servicios.*`: el valor
 * almacenado nunca se traduce, solo su etiqueta.
 */

/** Tipos disponibles en el formulario de propiedad. */
export const TIPOS_ALOJAMIENTO = ['casa', 'apartamento', 'villa', 'cabaña', 'glamping', 'habitacion']

/** Tipos que se muestran como categorías en la página principal. */
export const TIPOS_DESTACADOS = ['casa', 'apartamento', 'villa', 'cabaña', 'glamping']

/** Servicios filtrables y seleccionables al publicar una propiedad. */
export const SERVICIOS = ['wifi', 'parqueo', 'piscina', 'cocina', 'mascotas', 'chimenea', 'desayuno', 'vista al mar']

/** Servicios ofrecidos como filtro en el catálogo. */
export const SERVICIOS_FILTRO = ['wifi', 'piscina', 'parqueo', 'mascotas', 'cocina']

/** Calificaciones posibles de una reseña, de mejor a peor. */
export const CALIFICACIONES = [5, 4, 3, 2, 1]

/** Clave de traducción de la etiqueta de un servicio. */
export function claveServicio(valor) {
  return `servicios.${valor.replace(/\s+/g, '_')}`
}

/** Clave de traducción del nombre de un tipo de alojamiento. */
export function claveTipo(valor) {
  return `tipos.${valor === 'cabaña' ? 'cabana' : valor}.nombre`
}

/** Clave de traducción de la descripción de un tipo de alojamiento. */
export function claveTipoDescripcion(valor) {
  return `tipos.${valor === 'cabaña' ? 'cabana' : valor}.descripcion`
}
