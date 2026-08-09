import { useEffect, useState, useCallback } from 'react'
import * as dataStore from '../utils/dataStore'

/**
 * Hook personalizado para acceso a datos con reactividad
 *
 * Uso:
 *   const { propiedades, cargar } = useDataStore('propiedades')
 *   const { propiedad } = useDataStore('propiedad', { id: 1 })
 */

export function useDataStore(entidad, opciones = {}) {
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  const cargar = useCallback(async (filtros) => {
    setCargando(true)
    setError(null)
    try {
      let resultado
      switch (entidad) {
        case 'propiedades':
          resultado = dataStore.obtenerPropiedades(filtros || opciones.filtros)
          break
        case 'propiedad':
          resultado = dataStore.obtenerPropiedad(opciones.id)
          break
        case 'reservas':
          resultado = dataStore.obtenerReservas(filtros || opciones.filtros)
          break
        case 'reserva':
          resultado = dataStore.obtenerReserva(opciones.id)
          break
        case 'usuarios':
          resultado = dataStore.obtenerUsuarios()
          break
        case 'usuario':
          resultado = dataStore.obtenerUsuario(opciones.id)
          break
        case 'resenas':
          resultado = dataStore.obtenerResenas(filtros || opciones.filtros)
          break
        case 'promociones':
          resultado = dataStore.obtenerPromociones()
          break
        default:
          throw new Error(`Entidad desconocida: ${entidad}`)
      }
      setDatos(resultado)
      return resultado
    } catch (err) {
      setError(err.message)
      console.error(`Error cargando ${entidad}:`, err)
    } finally {
      setCargando(false)
    }
    // opciones={} por defecto es un objeto nuevo cada render; depender de sus
    // campos primitivos (no del objeto) evita que cargar cambie de identidad
    // en cada render y dispare el useEffect de abajo en loop infinito.
  }, [entidad, opciones.filtros, opciones.id])

  const crear = useCallback(async (nuevosDatos) => {
    setCargando(true)
    setError(null)
    try {
      let resultado
      switch (entidad) {
        case 'propiedad':
          resultado = dataStore.crearPropiedad(nuevosDatos)
          break
        case 'reserva':
          resultado = dataStore.crearReserva(nuevosDatos)
          break
        case 'usuario':
          resultado = dataStore.crearUsuario(nuevosDatos)
          break
        case 'resena':
          resultado = dataStore.crearResena(nuevosDatos)
          break
        default:
          throw new Error(`No se puede crear ${entidad}`)
      }
      // Recargar lista si aplica
      if (entidad.endsWith('a') || entidad === 'usuario') {
        await cargar()
      }
      return resultado
    } catch (err) {
      setError(err.message)
      console.error(`Error creando ${entidad}:`, err)
    } finally {
      setCargando(false)
    }
  }, [entidad, cargar])

  const actualizar = useCallback(async (id, nuevosDatos) => {
    setCargando(true)
    setError(null)
    try {
      let resultado
      switch (entidad) {
        case 'propiedad':
          resultado = dataStore.actualizarPropiedad(id, nuevosDatos)
          break
        case 'reserva':
          resultado = dataStore.actualizarReserva(id, nuevosDatos)
          break
        case 'usuario':
          resultado = dataStore.actualizarUsuario(id, nuevosDatos)
          break
        default:
          throw new Error(`No se puede actualizar ${entidad}`)
      }
      return resultado
    } catch (err) {
      setError(err.message)
      console.error(`Error actualizando ${entidad}:`, err)
    } finally {
      setCargando(false)
    }
  }, [entidad])

  const eliminar = useCallback(async (id) => {
    setCargando(true)
    setError(null)
    try {
      switch (entidad) {
        case 'propiedad':
          dataStore.eliminarPropiedad(id)
          break
        case 'reserva':
          dataStore.cancelarReserva(id)
          break
        default:
          throw new Error(`No se puede eliminar ${entidad}`)
      }
      await cargar()
    } catch (err) {
      setError(err.message)
      console.error(`Error eliminando ${entidad}:`, err)
    } finally {
      setCargando(false)
    }
  }, [entidad, cargar])

  // Cargar datos al montar componente
  useEffect(() => {
    cargar()
  }, [cargar])

  return {
    datos,
    cargando,
    error,
    cargar,
    crear,
    actualizar,
    eliminar
  }
}

/**
 * Hook para sesión de usuario con localStorage
 */
export function useSesion() {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('staybooker_usuario')
    return guardado ? JSON.parse(guardado) : null
  })

  const iniciarSesion = useCallback((nombre, rol, id) => {
    const datosSesion = {
      id,
      nombre,
      rol,
      inicio: new Date().toISOString()
    }
    localStorage.setItem('staybooker_usuario', JSON.stringify(datosSesion))
    setUsuario(datosSesion)
    document.title = `StayBooker 360 — Hola, ${nombre}`
  }, [])

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem('staybooker_usuario')
    setUsuario(null)
    document.title = 'StayBooker 360'
  }, [])

  const actualizarPerfil = useCallback((datos) => {
    const actualizado = { ...usuario, ...datos }
    localStorage.setItem('staybooker_usuario', JSON.stringify(actualizado))
    setUsuario(actualizado)
  }, [usuario])

  return {
    usuario,
    iniciarSesion,
    cerrarSesion,
    actualizarPerfil,
    estaAutenticado: !!usuario
  }
}
