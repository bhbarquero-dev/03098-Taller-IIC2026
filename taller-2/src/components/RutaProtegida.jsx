import { Navigate, useLocation } from 'react-router-dom'
import { useSesion } from '../context/SesionContext'

/**
 * Restringe una ruta a las sesiones que cumplen el rol requerido.
 *
 * Sin sesión: manda a iniciar sesión, recordando a dónde iba el usuario.
 * Con sesión pero sin el rol: manda al perfil, que es la pantalla de cuenta
 * disponible para cualquier rol.
 *
 * TODO (back-end): la comprobación de rol se repetirá del lado del servidor;
 * esta es solo la capa de interfaz.
 */
export default function RutaProtegida({ roles, children }) {
  const { usuario } = useSesion()
  const ubicacion = useLocation()

  if (!usuario) {
    return <Navigate to="/inicio-sesion" state={{ destino: ubicacion.pathname }} replace />
  }

  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to="/perfil" replace />
  }

  return children
}
