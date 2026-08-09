/**
 * Data Store — Abstracción de persistencia
 *
 * Hoy: localStorage (ver storage.js)
 * Futuro: API REST backend
 *
 * La interfaz pública (firmas de funciones) permanece igual en ambos casos.
 * Solo la implementación interna de cada módulo de entidad cambia.
 *
 * Este archivo centraliza los exports: el resto del código sigue haciendo
 * `import { obtenerPropiedades, ... } from '../utils/dataStore'` sin saber
 * que por dentro está dividido por entidad.
 */

export * from './propiedades'
export * from './reservas'
export * from './usuarios'
export * from './resenas'
export * from './promociones'
export * from './semilla'
