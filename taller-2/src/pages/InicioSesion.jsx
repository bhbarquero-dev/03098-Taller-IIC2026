import { useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { verificarCredenciales } from '../utils/dataStore'
import { useSesion } from '../hooks/useDataStore'

const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validarInicioSesion(valores) {
  const errores = {}
  if (!valores.correo.trim()) {
    errores.correo = 'El correo es obligatorio.'
  } else if (!patronCorreo.test(valores.correo)) {
    errores.correo = 'Ingresa un correo electrónico válido.'
  }
  if (!valores.clave) {
    errores.clave = 'La contraseña es obligatoria.'
  }
  return errores
}

export default function InicioSesion() {
  const [valores, setValores] = useState({ correo: '', clave: '' })
  const [errores, setErrores] = useState({})
  const [errorCredenciales, setErrorCredenciales] = useState('')
  const correoRef = useRef(null)
  const claveRef = useRef(null)
  const navigate = useNavigate()
  const { iniciarSesion } = useSesion()

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setValores((anteriores) => ({ ...anteriores, [name]: value }))
  }

  function manejarEnvio(evento) {
    evento.preventDefault()
    setErrorCredenciales('')

    const erroresEncontrados = validarInicioSesion(valores)
    setErrores(erroresEncontrados)
    if (erroresEncontrados.correo) {
      correoRef.current?.focus()
      return
    }
    if (erroresEncontrados.clave) {
      claveRef.current?.focus()
      return
    }

    const usuario = verificarCredenciales(valores.correo, valores.clave)
    if (!usuario) {
      setErrorCredenciales('Correo o contraseña incorrectos.')
      correoRef.current?.focus()
      return
    }

    iniciarSesion(usuario.nombre, usuario.rol, usuario.id)
    navigate('/perfil')
  }

  return (
    <section aria-labelledby="login-heading">
      <h2 id="login-heading">Iniciar sesión</h2>
      <p>Ingresa con tu correo y contraseña para administrar tus reservas, tu perfil y tus alojamientos favoritos
      dentro de StayBooker 360.</p>

      <form onSubmit={manejarEnvio} noValidate>
        <fieldset>
          <legend>Datos de acceso</legend>

          <label htmlFor="login-correo">Correo electrónico</label>
          <input
            type="email"
            id="login-correo"
            name="correo"
            value={valores.correo}
            onChange={manejarCambio}
            ref={correoRef}
            className={errores.correo ? 'campo-invalido' : ''}
            aria-describedby={errores.correo ? 'login-correo-error' : undefined}
            required
          />
          {errores.correo && (
            <p id="login-correo-error" className="mensaje-error">{errores.correo}</p>
          )}

          <label htmlFor="login-clave">Contraseña</label>
          <input
            type="password"
            id="login-clave"
            name="clave"
            value={valores.clave}
            onChange={manejarCambio}
            ref={claveRef}
            className={errores.clave ? 'campo-invalido' : ''}
            aria-describedby={errores.clave ? 'login-clave-error' : undefined}
            required
          />
          {errores.clave && (
            <p id="login-clave-error" className="mensaje-error">{errores.clave}</p>
          )}

          {errorCredenciales && <p className="mensaje-error">{errorCredenciales}</p>}

          <button type="submit" className="btn-primario">Iniciar sesión</button>
        </fieldset>
      </form>

      <p><Link to="/ayuda">¿Olvidaste tu contraseña? Contacta a soporte</Link></p>
      <p>¿No tienes cuenta todavía? <Link to="/registro">Regístrate aquí</Link></p>
    </section>
  )
}
