import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSesion } from '../context/SesionContext'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useFormulario } from '../hooks/useFormulario'
import { MensajeError, MensajeExito } from '../components/MensajeCampo'
import {
  actualizarUsuario,
  obtenerPropiedad,
  obtenerPropiedades,
  obtenerUsuario,
  reiniciarDatosEjemplo
} from '../utils/dataStore'
import { correoValido, requerido, telefonoValido, validar } from '../utils/validaciones'
import { TIPOS_DESTACADOS, claveTipo } from '../utils/catalogos'

export default function Perfil() {
  const { usuario, actualizarPerfil } = useSesion()
  const { t, idioma, cambiarIdioma, moneda, cambiarMoneda, idiomas } = useIdioma()
  const location = useLocation()
  useTituloPagina('perfil.datosTitulo')

  const [favoritos, setFavoritos] = useState([])
  const [mensajePreferencias, setMensajePreferencias] = useState(null)
  const [mensajeBienvenida, setMensajeBienvenida] = useState(location.state?.mensaje || null)
  const [preferencias, setPreferencias] = useState({
    idioma,
    moneda,
    tipoPreferido: usuario?.preferencias?.tipoPreferido || 'casa',
    notificaciones: usuario?.preferencias?.notificaciones || false
  })

  const datos = useFormulario({
    prefijoId: 'perfil',
    valoresIniciales: {
      nombre: usuario?.nombre || '',
      correo: usuario?.correo || '',
      telefono: usuario?.telefono || ''
    },
    validarValores: (v) => validar({
      nombre: requerido(v.nombre),
      correo: correoValido(v.correo),
      telefono: v.telefono ? telefonoValido(v.telefono) : null
    }),
    alEnviar: (v, { setExito }) => {
      actualizarPerfil({ nombre: v.nombre.trim(), correo: v.correo.trim(), telefono: v.telefono.trim() })
      setExito(t('perfil.datosGuardados'))
    }
  })

  // Los favoritos se releen del registro persistente, no de la sesión.
  useEffect(() => {
    if (!usuario) return
    const registro = obtenerUsuario(usuario.id)
    if (!registro) return
    datos.setValores({
      nombre: registro.nombre || '',
      correo: registro.correo || '',
      telefono: registro.telefono || ''
    })
    setFavoritos((registro.favoritos || []).map((id) => obtenerPropiedad(id)).filter(Boolean))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario?.id])

  // El idioma y la moneda del contexto mandan sobre el estado local del formulario.
  useEffect(() => {
    setPreferencias((anteriores) => ({ ...anteriores, idioma, moneda }))
  }, [idioma, moneda])

  function manejarCambioPreferencias(evento) {
    const { name, value, type, checked } = evento.target
    setPreferencias((anteriores) => ({
      ...anteriores,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  function guardarPreferencias(evento) {
    evento.preventDefault()
    // Idioma y moneda se aplican de inmediato en toda la aplicación.
    if (preferencias.idioma !== idioma) cambiarIdioma(preferencias.idioma)
    if (preferencias.moneda !== moneda) cambiarMoneda(preferencias.moneda)
    actualizarUsuario(usuario.id, { preferencias })
    actualizarPerfil({ preferencias })
    setMensajePreferencias(t('perfil.preferenciasGuardadas'))
  }

  function reiniciarDatos() {
    reiniciarDatosEjemplo()
    setMensajePreferencias(t('perfil.datosReiniciados'))
  }

  const mostrarPanelAnfitrion = obtenerPropiedades({ incluirTodas: true })
    .some((propiedad) => propiedad.anfitrionId === usuario.id)
  const mostrarPanelAdmin = usuario.rol === 'administrador'

  const { valores, errores, exito, setExito, manejarEnvio, propsCampo } = datos

  return (
    <>
      <MensajeExito mensaje={mensajeBienvenida} alOcultar={() => setMensajeBienvenida(null)} />

      <section aria-labelledby="datos-heading">
        <h2 id="datos-heading">{t('perfil.datosTitulo')}</h2>

        <form onSubmit={manejarEnvio} noValidate>
          <fieldset>
            <legend>{t('perfil.infoLeyenda')}</legend>

            <label htmlFor="perfil-nombre">{t('perfil.nombre')}</label>
            <input type="text" {...propsCampo('nombre')} value={valores.nombre} required />
            <MensajeError error={errores.nombre} id="perfil-nombre-error" />

            <label htmlFor="perfil-correo">{t('comun.correo')}</label>
            <input type="email" {...propsCampo('correo')} value={valores.correo} required />
            <MensajeError error={errores.correo} id="perfil-correo-error" />

            <label htmlFor="perfil-telefono">{t('comun.telefono')}</label>
            <input type="tel" {...propsCampo('telefono')} value={valores.telefono} />
            <MensajeError error={errores.telefono} id="perfil-telefono-error" />

            <MensajeExito mensaje={exito} alOcultar={() => setExito(null)} />

            <button type="submit" className="btn-primario">{t('comun.guardar')}</button>
          </fieldset>
        </form>
      </section>

      <section aria-labelledby="preferencias-heading">
        <h2 id="preferencias-heading">{t('perfil.preferenciasTitulo')}</h2>

        <form onSubmit={guardarPreferencias}>
          <fieldset>
            <legend>{t('perfil.preferenciasLeyenda')}</legend>

            <label htmlFor="preferencia-idioma">{t('perfil.idioma')}</label>
            <select
              id="preferencia-idioma"
              name="idioma"
              value={preferencias.idioma}
              onChange={manejarCambioPreferencias}
            >
              {idiomas.map((opcion) => (
                <option value={opcion.codigo} key={opcion.codigo}>{opcion.nombre}</option>
              ))}
            </select>

            <label htmlFor="preferencia-moneda">{t('perfil.moneda')}</label>
            <select
              id="preferencia-moneda"
              name="moneda"
              value={preferencias.moneda}
              onChange={manejarCambioPreferencias}
            >
              <option value="crc">{t('header.monedaCrc')}</option>
              <option value="usd">{t('header.monedaUsd')}</option>
            </select>

            <label htmlFor="preferencia-tipo">{t('perfil.tipoPreferido')}</label>
            <select
              id="preferencia-tipo"
              name="tipoPreferido"
              value={preferencias.tipoPreferido}
              onChange={manejarCambioPreferencias}
            >
              {TIPOS_DESTACADOS.map((tipo) => (
                <option value={tipo} key={tipo}>{t(claveTipo(tipo))}</option>
              ))}
            </select>

            <input
              type="checkbox"
              id="preferencia-notificaciones"
              name="notificaciones"
              checked={preferencias.notificaciones}
              onChange={manejarCambioPreferencias}
            />
            <label htmlFor="preferencia-notificaciones">{t('perfil.notificaciones')}</label>

            <MensajeExito mensaje={mensajePreferencias} alOcultar={() => setMensajePreferencias(null)} />

            <button type="submit" className="btn-primario">{t('perfil.guardarPreferencias')}</button>
          </fieldset>
        </form>
      </section>

      <p>
        <Link to="/mis-reservas">{t('perfil.verReservas')}</Link>
        {mostrarPanelAnfitrion && <> · <Link to="/anfitrion-panel">{t('perfil.panelAnfitrion')}</Link></>}
        {mostrarPanelAdmin && <> · <Link to="/admin-panel">{t('perfil.panelAdmin')}</Link></>}
      </p>

      <section aria-labelledby="favoritos-heading">
        <h2 id="favoritos-heading">{t('perfil.favoritosTitulo')}</h2>

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
          <p>{t('perfil.sinFavoritos')}</p>
        )}
      </section>

      <p>
        <button type="button" className="btn-secundario" onClick={reiniciarDatos}>
          {t('comun.reiniciarDatos')}
        </button>
      </p>
    </>
  )
}
