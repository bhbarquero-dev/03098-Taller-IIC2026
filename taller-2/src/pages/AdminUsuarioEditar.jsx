import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useDataStore } from '../hooks/useDataStore'
import { useFormulario } from '../hooks/useFormulario'
import { MensajeError, MensajeExito } from '../components/MensajeCampo'
import SeccionIncidencias from '../components/SeccionIncidencias'
import { claveTipoCuenta } from './AdminUsuarios'
import { actualizarUsuario, eliminarUsuario } from '../utils/dataStore'
import {
  claveValida,
  clavesCoinciden,
  correoValido,
  requerido,
  telefonoValido,
  validar
} from '../utils/validaciones'

export default function AdminUsuarioEditar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useIdioma()
  useTituloPagina('admin.usuariosTitulo')

  const { datos: usuario, cargar } = useDataStore('usuario', { id })
  const [estado, setEstado] = useState('activa')
  const [mensajeEstado, setMensajeEstado] = useState(null)
  const [confirmandoBorrado, setConfirmandoBorrado] = useState(false)

  const datos = useFormulario({
    prefijoId: 'cuenta',
    valoresIniciales: { nombre: '', correo: '', telefono: '' },
    validarValores: (v) => validar({
      nombre: requerido(v.nombre),
      correo: correoValido(v.correo),
      telefono: v.telefono ? telefonoValido(v.telefono) : null
    }),
    alEnviar: (v, { setExito }) => {
      actualizarUsuario(id, {
        nombre: v.nombre.trim(),
        correo: v.correo.trim(),
        telefono: v.telefono.trim()
      })
      cargar()
      setExito(t('admin.datosGuardados'))
    }
  })

  const clave = useFormulario({
    prefijoId: 'clave',
    valoresIniciales: { clave: '', clave_confirmar: '' },
    validarValores: (v) => validar({
      clave: claveValida(v.clave),
      clave_confirmar: requerido(v.clave_confirmar) || clavesCoinciden(v.clave, v.clave_confirmar)
    }),
    alEnviar: (v, { setExito, setValores }) => {
      actualizarUsuario(id, { clave: v.clave })
      setValores({ clave: '', clave_confirmar: '' })
      setExito(t('admin.claveExito'))
    }
  })

  useEffect(() => {
    if (!usuario) return
    datos.setValores({
      nombre: usuario.nombre || '',
      correo: usuario.correo || '',
      telefono: usuario.telefono || ''
    })
    setEstado(usuario.estado || 'activa')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario?.id])

  if (!usuario) {
    return (
      <section aria-labelledby="cuenta-heading">
        <h2 id="cuenta-heading">{t('admin.usuariosTitulo')}</h2>
        <p>{t('comun.sinDatos')}</p>
        <p><Link to="/admin-usuarios">{t('comun.volver')}</Link></p>
      </section>
    )
  }

  function guardarEstado(evento) {
    evento.preventDefault()
    actualizarUsuario(id, { estado })
    cargar()
    setMensajeEstado(t('admin.datosGuardados'))
  }

  function borrarCuenta() {
    eliminarUsuario(id)
    navigate('/admin-usuarios', { state: { mensaje: t('admin.cuentaEliminada') } })
  }

  return (
    <>
      <section aria-labelledby="cuenta-heading">
        <h2 id="cuenta-heading">{t('admin.usuarioTitulo', { nombre: usuario.nombre })}</h2>

        <form className="panel-formulario" onSubmit={datos.manejarEnvio} noValidate>
          <fieldset>
            <legend>{t('admin.datosCuentaLeyenda')}</legend>

            <label htmlFor="cuenta-nombre">{t('comun.nombre')}</label>
            <input type="text" {...datos.propsCampo('nombre')} value={datos.valores.nombre} required />
            <MensajeError error={datos.errores.nombre} id="cuenta-nombre-error" />

            <label htmlFor="cuenta-correo">{t('comun.correo')}</label>
            <input type="email" {...datos.propsCampo('correo')} value={datos.valores.correo} required />
            <MensajeError error={datos.errores.correo} id="cuenta-correo-error" />

            <label htmlFor="cuenta-telefono">{t('comun.telefono')}</label>
            <input type="tel" {...datos.propsCampo('telefono')} value={datos.valores.telefono} />
            <MensajeError error={datos.errores.telefono} id="cuenta-telefono-error" />

            <MensajeExito mensaje={datos.exito} alOcultar={() => datos.setExito(null)} />

            <button type="submit" className="btn-primario">{t('comun.guardar')}</button>
          </fieldset>
        </form>

        <form className="panel-formulario" onSubmit={guardarEstado}>
          <fieldset>
            <legend>{t('admin.tipoCuentaLeyenda')}</legend>
            <p>{t(claveTipoCuenta(usuario.rol))}</p>
          </fieldset>

          <fieldset>
            <legend>{t('admin.estadoCuentaLeyenda')}</legend>

            <label htmlFor="cuenta-estado">{t('comun.estado')}</label>
            <select
              id="cuenta-estado"
              name="estado"
              value={estado}
              onChange={(evento) => setEstado(evento.target.value)}
            >
              <option value="activa">{t('estados.activa')}</option>
              <option value="suspendida">{t('estados.suspendida')}</option>
            </select>

            <MensajeExito mensaje={mensajeEstado} alOcultar={() => setMensajeEstado(null)} />

            <button type="submit" className="btn-primario">{t('comun.guardar')}</button>
          </fieldset>
        </form>

        <form className="panel-formulario" onSubmit={clave.manejarEnvio} noValidate>
          <fieldset>
            <legend>{t('admin.claveLeyenda')}</legend>

            <label htmlFor="clave-clave">{t('admin.claveNueva')}</label>
            <input type="password" {...clave.propsCampo('clave')} value={clave.valores.clave} minLength={8} required />
            <MensajeError error={clave.errores.clave} id="clave-clave-error" />

            <label htmlFor="clave-clave_confirmar">{t('admin.claveConfirmar')}</label>
            <input
              type="password"
              {...clave.propsCampo('clave_confirmar')}
              value={clave.valores.clave_confirmar}
              minLength={8}
              required
            />
            <MensajeError error={clave.errores.clave_confirmar} id="clave-clave_confirmar-error" />

            <MensajeExito mensaje={clave.exito} alOcultar={() => clave.setExito(null)} />

            <button type="submit" className="btn-primario">{t('admin.restablecer')}</button>
          </fieldset>
        </form>

        <form className="panel-formulario" onSubmit={(evento) => evento.preventDefault()}>
          <fieldset>
            <legend>{t('admin.eliminarLeyenda')}</legend>
            <p>{t('admin.eliminarTexto')}</p>

            {confirmandoBorrado ? (
              <p className="confirmacion" role="alert">
                {t('comun.seguroTitulo')}
                <span className="grupo-botones">
                  <button type="button" className="btn-peligro" onClick={borrarCuenta}>
                    {t('comun.seguroSi')}
                  </button>
                  <button
                    type="button"
                    className="btn-secundario"
                    onClick={() => setConfirmandoBorrado(false)}
                  >
                    {t('comun.seguroNo')}
                  </button>
                </span>
              </p>
            ) : (
              <button type="button" className="btn-peligro" onClick={() => setConfirmandoBorrado(true)}>
                {t('admin.eliminarCuenta')}
              </button>
            )}
          </fieldset>
        </form>
      </section>

      <SeccionIncidencias entidad="usuario" entidadId={id} />

      <p><Link to="/admin-usuarios">{t('admin.usuariosTitulo')}</Link></p>
    </>
  )
}
