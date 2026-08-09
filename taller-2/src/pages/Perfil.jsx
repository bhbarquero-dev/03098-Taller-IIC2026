import { useEffect, useRef, useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { obtenerUsuario, actualizarUsuario, obtenerPropiedad, obtenerPropiedades } from '../utils/dataStore'
import { useSesion } from '../hooks/useDataStore'

const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validarDatosPersonales(valores) {
  const errores = {}
  if (!valores.nombre.trim()) {
    errores.nombre = 'El nombre es obligatorio.'
  }
  if (!valores.correo.trim()) {
    errores.correo = 'El correo es obligatorio.'
  } else if (!patronCorreo.test(valores.correo)) {
    errores.correo = 'Ingresa un correo electrónico válido.'
  }
  return errores
}

export default function Perfil() {
  const { usuario, estaAutenticado, actualizarPerfil, cerrarSesion } = useSesion()
  const navigate = useNavigate()
  const [datosPersonales, setDatosPersonales] = useState({ nombre: '', correo: '', telefono: '' })
  const [preferencias, setPreferencias] = useState({
    idioma: 'es',
    moneda: 'crc',
    tipoPreferido: 'casa',
    notificaciones: false
  })
  const [favoritos, setFavoritos] = useState([])
  const [errores, setErrores] = useState({})
  const [mensajeDatos, setMensajeDatos] = useState('')
  const [mensajePreferencias, setMensajePreferencias] = useState('')
  const nombreRef = useRef(null)
  const correoRef = useRef(null)

  useEffect(() => {
    if (!usuario) return
    const registro = obtenerUsuario(usuario.id)
    if (!registro) return
    setDatosPersonales({
      nombre: registro.nombre || '',
      correo: registro.correo || '',
      telefono: registro.telefono || ''
    })
    setPreferencias({
      idioma: registro.preferencias?.idioma || 'es',
      moneda: registro.preferencias?.moneda || 'crc',
      tipoPreferido: registro.preferencias?.tipoPreferido || 'casa',
      notificaciones: registro.preferencias?.notificaciones || false
    })
    setFavoritos(
      (registro.favoritos || [])
        .map((id) => obtenerPropiedad(id))
        .filter(Boolean)
    )
  }, [usuario])

  if (!estaAutenticado) {
    return <Navigate to="/inicio-sesion" replace />
  }

  function manejarCambioDatos(evento) {
    const { name, value } = evento.target
    setDatosPersonales((anteriores) => ({ ...anteriores, [name]: value }))
  }

  function manejarEnvioDatos(evento) {
    evento.preventDefault()
    setMensajeDatos('')

    const erroresEncontrados = validarDatosPersonales(datosPersonales)
    setErrores(erroresEncontrados)
    if (erroresEncontrados.nombre) {
      nombreRef.current?.focus()
      return
    }
    if (erroresEncontrados.correo) {
      correoRef.current?.focus()
      return
    }

    actualizarUsuario(usuario.id, datosPersonales)
    actualizarPerfil({ nombre: datosPersonales.nombre })
    setMensajeDatos('Cambios guardados.')
  }

  function manejarCerrarSesion() {
    cerrarSesion()
    navigate('/')
  }

  function manejarCambioPreferencias(evento) {
    const { name, value, type, checked } = evento.target
    setPreferencias((anteriores) => ({
      ...anteriores,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  function manejarEnvioPreferencias(evento) {
    evento.preventDefault()
    actualizarUsuario(usuario.id, { preferencias })
    setMensajePreferencias('Preferencias guardadas.')
  }

  const mostrarPanelAnfitrion = obtenerPropiedades().some((p) => p.anfitrionId === usuario.id)
  const mostrarPanelAdmin = usuario.rol === 'administrador'

  return (
    <>
      <section aria-labelledby="datos-heading">
        <h2 id="datos-heading">Datos personales</h2>

        <form onSubmit={manejarEnvioDatos} noValidate>
          <fieldset>
            <legend>Información básica</legend>

            <label htmlFor="perfil-nombre">Nombre completo</label>
            <input
              type="text"
              id="perfil-nombre"
              name="nombre"
              value={datosPersonales.nombre}
              onChange={manejarCambioDatos}
              ref={nombreRef}
              className={errores.nombre ? 'campo-invalido' : ''}
              aria-describedby={errores.nombre ? 'perfil-nombre-error' : undefined}
              required
            />
            {errores.nombre && (
              <p id="perfil-nombre-error" className="mensaje-error">{errores.nombre}</p>
            )}

            <label htmlFor="perfil-correo">Correo electrónico</label>
            <input
              type="email"
              id="perfil-correo"
              name="correo"
              value={datosPersonales.correo}
              onChange={manejarCambioDatos}
              ref={correoRef}
              className={errores.correo ? 'campo-invalido' : ''}
              aria-describedby={errores.correo ? 'perfil-correo-error' : undefined}
              required
            />
            {errores.correo && (
              <p id="perfil-correo-error" className="mensaje-error">{errores.correo}</p>
            )}

            <label htmlFor="perfil-telefono">Teléfono</label>
            <input
              type="tel"
              id="perfil-telefono"
              name="telefono"
              value={datosPersonales.telefono}
              onChange={manejarCambioDatos}
            />

            {mensajeDatos && <p className="mensaje-exito" role="status">{mensajeDatos}</p>}

            <button type="submit" className="btn-primario">Guardar cambios</button>
          </fieldset>
        </form>
      </section>

      <section aria-labelledby="preferencias-heading">
        <h2 id="preferencias-heading">Preferencias</h2>

        <form onSubmit={manejarEnvioPreferencias}>
          <fieldset>
            <legend>Preferencias de reserva</legend>

            <label htmlFor="preferencia-idioma">Idioma preferido</label>
            <select
              id="preferencia-idioma"
              name="idioma"
              value={preferencias.idioma}
              onChange={manejarCambioPreferencias}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>

            <label htmlFor="preferencia-moneda">Moneda preferida</label>
            <select
              id="preferencia-moneda"
              name="moneda"
              value={preferencias.moneda}
              onChange={manejarCambioPreferencias}
            >
              <option value="crc">Colones (CRC)</option>
              <option value="usd">Dólares (USD)</option>
            </select>

            <label htmlFor="preferencia-tipo">Tipo de alojamiento preferido</label>
            <select
              id="preferencia-tipo"
              name="tipoPreferido"
              value={preferencias.tipoPreferido}
              onChange={manejarCambioPreferencias}
            >
              <option value="casa">Casa</option>
              <option value="apartamento">Apartamento</option>
              <option value="villa">Villa</option>
              <option value="cabaña">Cabaña</option>
              <option value="glamping">Glamping</option>
            </select>

            <label>
              <input
                type="checkbox"
                id="preferencia-notificaciones"
                name="notificaciones"
                checked={preferencias.notificaciones}
                onChange={manejarCambioPreferencias}
              /> Recibir notificaciones por correo
            </label>

            {mensajePreferencias && <p className="mensaje-exito" role="status">{mensajePreferencias}</p>}

            <button type="submit" className="btn-primario">Guardar preferencias</button>
          </fieldset>
        </form>
      </section>

      <p>
        <Link to="/mis-reservas">Ver mis reservas</Link>
        {mostrarPanelAnfitrion && <> · <Link to="/anfitrion-panel">Panel de anfitrión</Link></>}
        {mostrarPanelAdmin && <> · <Link to="/admin-panel">Panel de administración</Link></>}
      </p>

      <section aria-labelledby="favoritos-heading">
        <h2 id="favoritos-heading">Alojamientos favoritos</h2>

        {favoritos.length > 0 ? (
          <ul>
            {favoritos.map((propiedad) => (
              <li key={propiedad.id}>
                <Link to={`/propiedades/${propiedad.id}`}>
                  {propiedad.nombre} — {propiedad.ubicacion}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>Todavía no tienes alojamientos favoritos.</p>
        )}
      </section>

      <p>
        <button type="button" className="btn-secundario" onClick={manejarCerrarSesion}>
          Cerrar sesión
        </button>
      </p>
    </>
  )
}
