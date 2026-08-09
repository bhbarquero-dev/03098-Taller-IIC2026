import { useCallback, useEffect, useState } from 'react'
import * as dataStore from '../utils/dataStore'

/**
 * Hook de acceso a datos con reactividad.
 *
 * Es agnóstico respecto a de dónde vienen los datos: hoy el data store lee
 * localStorage, mañana hará fetch a una API y este hook no cambia.
 *
 * Uso:
 *   const { datos, cargando, crear } = useDataStore('propiedades')
 *   const { datos: propiedad } = useDataStore('propiedad', { id })
 */

/**
 * Tabla de operaciones por entidad. Las claves en plural devuelven listas y
 * aceptan filtros; las claves en singular operan sobre un registro por id.
 */
const OPERACIONES = {
  propiedades: { listar: (filtros) => dataStore.obtenerPropiedades(filtros) },
  propiedad: {
    obtener: dataStore.obtenerPropiedad,
    crear: dataStore.crearPropiedad,
    actualizar: dataStore.actualizarPropiedad,
    eliminar: dataStore.eliminarPropiedad
  },
  reservas: { listar: (filtros) => dataStore.obtenerReservas(filtros) },
  reserva: {
    obtener: dataStore.obtenerReserva,
    crear: dataStore.crearReserva,
    actualizar: dataStore.actualizarReserva,
    eliminar: dataStore.cancelarReserva
  },
  usuarios: { listar: () => dataStore.obtenerUsuarios() },
  usuario: {
    obtener: dataStore.obtenerUsuario,
    crear: dataStore.crearUsuario,
    actualizar: dataStore.actualizarUsuario,
    eliminar: dataStore.eliminarUsuario
  },
  resenas: { listar: (filtros) => dataStore.obtenerResenas(filtros) },
  resena: {
    obtener: dataStore.obtenerResena,
    crear: dataStore.crearResena,
    actualizar: dataStore.actualizarResena
  },
  promociones: { listar: (filtros) => dataStore.obtenerPromociones(filtros) },
  promocion: {
    obtener: dataStore.obtenerPromocion,
    crear: dataStore.crearPromocion,
    actualizar: dataStore.actualizarPromocion,
    eliminar: dataStore.eliminarPromocion
  },
  consultas: { listar: (filtros) => dataStore.obtenerConsultas(filtros) },
  consulta: {
    obtener: dataStore.obtenerConsulta,
    crear: dataStore.crearConsulta,
    actualizar: dataStore.responderConsulta
  },
  posts: { listar: (filtros) => dataStore.obtenerPosts(filtros) },
  post: {
    obtener: dataStore.obtenerPost,
    crear: dataStore.crearPost,
    actualizar: dataStore.actualizarPost,
    eliminar: dataStore.eliminarPost
  },
  incidencias: { listar: (filtros) => dataStore.obtenerIncidencias(filtros) },
  incidencia: { crear: dataStore.crearIncidencia }
}

function operacionesDe(entidad) {
  const operaciones = OPERACIONES[entidad]
  if (!operaciones) throw new Error(`Entidad desconocida: ${entidad}`)
  return operaciones
}

export function useDataStore(entidad, opciones = {}) {
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  // `opciones` (y su campo `filtros`) es un objeto nuevo en cada render del
  // componente. Se depende de su forma serializada, no de su identidad, para
  // que `cargar` no cambie en cada render y dispare el useEffect en bucle.
  const filtrosSerializados = JSON.stringify(opciones.filtros ?? null)

  const cargar = useCallback(async (filtros) => {
    setCargando(true)
    setError(null)
    try {
      const operaciones = operacionesDe(entidad)
      const resultado = operaciones.listar
        ? operaciones.listar(filtros || JSON.parse(filtrosSerializados) || undefined)
        : operaciones.obtener?.(opciones.id)
      setDatos(resultado ?? null)
      return resultado
    } catch (err) {
      setError(err.message)
      console.error(`Error cargando ${entidad}:`, err)
    } finally {
      setCargando(false)
    }
  }, [entidad, filtrosSerializados, opciones.id])

  const ejecutar = useCallback(async (nombre, ...argumentos) => {
    setCargando(true)
    setError(null)
    try {
      const operaciones = operacionesDe(entidad)
      const operacion = operaciones[nombre]
      if (!operacion) throw new Error(`No se puede ${nombre} ${entidad}`)
      const resultado = operacion(...argumentos)
      await cargar()
      return resultado
    } catch (err) {
      setError(err.message)
      console.error(`Error al ${nombre} ${entidad}:`, err)
    } finally {
      setCargando(false)
    }
  }, [entidad, cargar])

  const crear = useCallback((nuevosDatos) => ejecutar('crear', nuevosDatos), [ejecutar])
  const actualizar = useCallback((id, nuevosDatos) => ejecutar('actualizar', id, nuevosDatos), [ejecutar])
  const eliminar = useCallback((id) => ejecutar('eliminar', id), [ejecutar])

  useEffect(() => {
    cargar()
  }, [cargar])

  return { datos, cargando, error, cargar, crear, actualizar, eliminar }
}

/**
 * La sesión vive en un contexto (ver src/context/SesionContext.jsx).
 * Se reexporta aquí porque este era su lugar original y varias páginas la
 * importan desde este módulo.
 */
export { useSesion } from '../context/SesionContext'
