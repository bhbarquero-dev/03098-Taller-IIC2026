import { Link, useNavigate } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'
import { useSesion } from '../context/SesionContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useFormulario } from '../hooks/useFormulario'
import { MensajeError } from '../components/MensajeCampo'
import { crearUsuario, obtenerUsuarioPorCorreo } from '../utils/dataStore'
import {
  casillaMarcada,
  claveValida,
  clavesCoinciden,
  correoValido,
  requerido,
  telefonoValido,
  validar
} from '../utils/validaciones'

export default function Registro() {
  const { t } = useIdioma()
  const { iniciarSesion } = useSesion()
  const navigate = useNavigate()
  useTituloPagina('registro.titulo')

  const { valores, errores, manejarEnvio, propsCampo } = useFormulario({
    prefijoId: 'registro',
    valoresIniciales: {
      nombre: '', correo: '', clave: '', clave_confirmar: '', telefono: '', terminos: false
    },
    validarValores: (v) => validar({
      nombre: requerido(v.nombre),
      correo: correoValido(v.correo) ||
        (obtenerUsuarioPorCorreo(v.correo) ? { clave: 'validacion.correoRepetido' } : null),
      clave: claveValida(v.clave),
      clave_confirmar: requerido(v.clave_confirmar) || clavesCoinciden(v.clave, v.clave_confirmar),
      // El teléfono es opcional: solo se valida si se escribió algo.
      telefono: v.telefono ? telefonoValido(v.telefono) : null,
      terminos: casillaMarcada(v.terminos)
    }),
    alEnviar: (v) => {
      const usuario = crearUsuario({
        nombre: v.nombre.trim(),
        correo: v.correo.trim(),
        clave: v.clave,
        telefono: v.telefono.trim()
      })
      iniciarSesion(usuario)
      navigate('/perfil', { state: { mensaje: t('registro.exito', { nombre: usuario.nombre }) } })
    }
  })

  return (
    <section aria-labelledby="registro-heading">
      <h2 id="registro-heading">{t('registro.titulo')}</h2>
      <p>{t('registro.intro')}</p>

      <form onSubmit={manejarEnvio} noValidate>
        <fieldset>
          <legend>{t('registro.leyenda')}</legend>

          <label htmlFor="registro-nombre">{t('registro.nombre')}</label>
          <input type="text" {...propsCampo('nombre')} value={valores.nombre} required />
          <MensajeError error={errores.nombre} id="registro-nombre-error" />

          <label htmlFor="registro-correo">{t('comun.correo')}</label>
          <input type="email" {...propsCampo('correo')} value={valores.correo} required />
          <MensajeError error={errores.correo} id="registro-correo-error" />

          <label htmlFor="registro-clave">{t('registro.clave')}</label>
          <input type="password" {...propsCampo('clave')} value={valores.clave} minLength={8} required />
          <MensajeError error={errores.clave} id="registro-clave-error" />

          <label htmlFor="registro-clave_confirmar">{t('registro.claveConfirmar')}</label>
          <input
            type="password"
            {...propsCampo('clave_confirmar')}
            value={valores.clave_confirmar}
            minLength={8}
            required
          />
          <MensajeError error={errores.clave_confirmar} id="registro-clave_confirmar-error" />

          <label htmlFor="registro-telefono">{t('registro.telefono')}</label>
          <input type="tel" {...propsCampo('telefono')} value={valores.telefono} />
          <MensajeError error={errores.telefono} id="registro-telefono-error" />

          <input type="checkbox" {...propsCampo('terminos')} checked={valores.terminos} required />
          <label htmlFor="registro-terminos">
            {t('registro.aceptoInicio')}
            <Link to="/terminos-uso">{t('registro.aceptoTerminos')}</Link>
            {t('registro.aceptoY')}
            <Link to="/politicas-privacidad">{t('registro.aceptoPoliticas')}</Link>
          </label>
          <MensajeError error={errores.terminos} id="registro-terminos-error" />

          <button type="submit" className="btn-primario">{t('registro.crearCuenta')}</button>
        </fieldset>
      </form>

      <p>{t('registro.yaTienes')} <Link to="/inicio-sesion">{t('registro.iniciaSesion')}</Link></p>
      <p>{t('registro.publicarPregunta')} <Link to="/publicar-propiedad">{t('registro.publicarEnlace')}</Link></p>
    </section>
  )
}
