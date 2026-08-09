import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'
import { useSesion } from '../context/SesionContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useFormulario } from '../hooks/useFormulario'
import { MensajeError } from '../components/MensajeCampo'
import { verificarCredenciales } from '../utils/dataStore'
import { correoValido, requerido, validar } from '../utils/validaciones'

export default function InicioSesion() {
  const { t } = useIdioma()
  const { iniciarSesion } = useSesion()
  const navigate = useNavigate()
  const location = useLocation()
  useTituloPagina('login.titulo')

  const [errorAcceso, setErrorAcceso] = useState(null)

  const { valores, errores, manejarEnvio, propsCampo } = useFormulario({
    prefijoId: 'login',
    valoresIniciales: { correo: '', clave: '' },
    validarValores: (v) => validar({
      correo: correoValido(v.correo),
      clave: requerido(v.clave)
    }),
    alEnviar: (v) => {
      setErrorAcceso(null)
      const usuario = verificarCredenciales(v.correo, v.clave)

      if (!usuario) {
        setErrorAcceso({ clave: 'login.credencialesInvalidas' })
        return
      }
      if (usuario.estado === 'suspendida') {
        setErrorAcceso({ clave: 'login.cuentaSuspendida' })
        return
      }

      iniciarSesion(usuario)
      // Si el usuario había intentado entrar a una ruta protegida, vuelve ahí.
      navigate(location.state?.destino || '/perfil')
    }
  })

  return (
    <section aria-labelledby="login-heading">
      <h2 id="login-heading">{t('login.titulo')}</h2>
      <p>{t('login.intro')}</p>

      <form onSubmit={manejarEnvio} noValidate>
        <fieldset>
          <legend>{t('login.leyenda')}</legend>

          <label htmlFor="login-correo">{t('comun.correo')}</label>
          <input type="email" {...propsCampo('correo')} value={valores.correo} required />
          <MensajeError error={errores.correo} id="login-correo-error" />

          <label htmlFor="login-clave">{t('login.clave')}</label>
          <input type="password" {...propsCampo('clave')} value={valores.clave} required />
          <MensajeError error={errores.clave} id="login-clave-error" />

          <MensajeError error={errorAcceso} id="login-acceso-error" />

          <button type="submit" className="btn-primario">{t('login.entrar')}</button>
        </fieldset>
      </form>

      <p><Link to="/ayuda">{t('login.olvidaste')}</Link></p>
      <p>{t('login.sinCuenta')} <Link to="/registro">{t('login.registrate')}</Link></p>

      <aside aria-labelledby="demo-heading">
        <h3 id="demo-heading">{t('login.demoTitulo')}</h3>
        <ul>
          <li>{t('login.demoHuesped')}</li>
          <li>{t('login.demoAnfitrion')}</li>
          <li>{t('login.demoAdmin')}</li>
        </ul>
      </aside>
    </section>
  )
}
