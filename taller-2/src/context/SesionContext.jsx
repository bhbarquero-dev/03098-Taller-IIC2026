import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { actualizarUsuario } from '../utils/dataStore'

/**
 * Sesión activa de la aplicación.
 *
 * Vive en un contexto (no en un hook con estado local) porque el estado tiene
 * que ser el mismo para todos los componentes: si el header y la página de
 * inicio de sesión tuvieran cada uno su propio `useState`, iniciar sesión no
 * actualizaría el menú.
 *
 * Persiste en localStorage bajo `staybooker_usuario`: la sesión sobrevive al
 * cierre del navegador, simulando un "recordarme" permanente.
 *
 * TODO (back-end): `iniciarSesion` pasará de escribir en localStorage a llamar
 * POST /api/auth/login y guardar el token devuelto; el resto de la aplicación
 * sigue consumiendo este mismo contexto sin cambios.
 */

const CLAVE_SESION = 'staybooker_usuario'

const SesionContext = createContext(null)

function leerSesionGuardada() {
  const guardado = localStorage.getItem(CLAVE_SESION)
  if (!guardado) return null
  try {
    return JSON.parse(guardado)
  } catch {
    localStorage.removeItem(CLAVE_SESION)
    return null
  }
}

export function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(leerSesionGuardada)

  const iniciarSesion = useCallback((datosUsuario) => {
    // La contraseña nunca entra en la sesión.
    const { clave, ...resto } = datosUsuario
    const sesion = { ...resto, inicio: new Date().toISOString() }
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
    setUsuario(sesion)
    return sesion
  }, [])

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem(CLAVE_SESION)
    setUsuario(null)
    document.title = 'StayBooker 360'
  }, [])

  /**
   * Actualiza la sesión y, además, el registro persistente del usuario, para
   * que los cambios de perfil no se pierdan al cerrar sesión.
   */
  const actualizarPerfil = useCallback((datos) => {
    setUsuario((anterior) => {
      if (!anterior) return anterior
      const actualizado = { ...anterior, ...datos }
      localStorage.setItem(CLAVE_SESION, JSON.stringify(actualizado))
      actualizarUsuario(anterior.id, datos)
      return actualizado
    })
  }, [])

  const valor = useMemo(() => ({
    usuario,
    iniciarSesion,
    cerrarSesion,
    actualizarPerfil,
    estaAutenticado: !!usuario,
    esAnfitrion: usuario?.rol === 'anfitrion' || usuario?.rol === 'administrador',
    esAdministrador: usuario?.rol === 'administrador'
  }), [usuario, iniciarSesion, cerrarSesion, actualizarPerfil])

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>
}

export function useSesion() {
  const contexto = useContext(SesionContext)
  if (!contexto) {
    throw new Error('useSesion debe usarse dentro de <SesionProvider>')
  }
  return contexto
}
