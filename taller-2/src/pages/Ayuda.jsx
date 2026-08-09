import { Link } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useFormulario } from '../hooks/useFormulario'
import { MensajeError, MensajeExito } from '../components/MensajeCampo'
import { correoValido, requerido, textoMaximo, validar } from '../utils/validaciones'

const MAXIMO_MENSAJE = 500

export default function Ayuda() {
  const { t } = useIdioma()
  useTituloPagina('ayuda.faqTitulo')

  const formulario = useFormulario({
    prefijoId: 'contacto',
    valoresIniciales: { nombre: '', correo: '', asunto: '', mensaje: '' },
    validarValores: (valores) => validar({
      nombre: requerido(valores.nombre),
      correo: correoValido(valores.correo),
      asunto: requerido(valores.asunto),
      mensaje: requerido(valores.mensaje) || textoMaximo(valores.mensaje, MAXIMO_MENSAJE)
    }),
    alEnviar: (valores, { setExito, setValores }) => {
      // Sin back-end: el mensaje se confirma del lado del cliente.
      setExito(t('ayuda.exito', { correo: valores.correo }))
      setValores({ nombre: '', correo: '', asunto: '', mensaje: '' })
    }
  })

  const { valores, errores, exito, setExito, manejarEnvio, propsCampo } = formulario
  const restantes = MAXIMO_MENSAJE - (valores.mensaje?.length || 0)

  const preguntas = [1, 2, 3, 4, 5]

  return (
    <>
      <section aria-labelledby="faq-heading">
        <h2 id="faq-heading">{t('ayuda.faqTitulo')}</h2>

        {preguntas.map((numero) => (
          <details key={numero}>
            <summary>{t(`ayuda.p${numero}`)}</summary>
            <p>{t(`ayuda.r${numero}`)}</p>
          </details>
        ))}
      </section>

      <section aria-labelledby="politicas-heading">
        <h2 id="politicas-heading">{t('ayuda.politicasTitulo')}</h2>
        <ul>
          <li><Link to="/politicas-privacidad">{t('ayuda.politicasEnlace')}</Link></li>
          <li><Link to="/terminos-uso">{t('ayuda.terminosEnlace')}</Link></li>
        </ul>
      </section>

      <section aria-labelledby="contacto-heading">
        <h2 id="contacto-heading">{t('ayuda.contactoTitulo')}</h2>

        <form onSubmit={manejarEnvio} noValidate>
          <fieldset>
            <legend>{t('ayuda.escribenos')}</legend>

            <label htmlFor="contacto-nombre">{t('comun.nombre')}</label>
            <input type="text" {...propsCampo('nombre')} value={valores.nombre} required />
            <MensajeError error={errores.nombre} id="contacto-nombre-error" />

            <label htmlFor="contacto-correo">{t('comun.correo')}</label>
            <input type="email" {...propsCampo('correo')} value={valores.correo} required />
            <MensajeError error={errores.correo} id="contacto-correo-error" />

            <label htmlFor="contacto-asunto">{t('ayuda.asunto')}</label>
            <input type="text" {...propsCampo('asunto')} value={valores.asunto} required />
            <MensajeError error={errores.asunto} id="contacto-asunto-error" />

            <label htmlFor="contacto-mensaje">{t('ayuda.mensaje')}</label>
            <textarea
              {...propsCampo('mensaje')}
              value={valores.mensaje}
              rows="4"
              maxLength={MAXIMO_MENSAJE}
              required
            />
            <p className="contador-caracteres">{t('validacion.caracteresRestantes', { n: restantes })}</p>
            <MensajeError error={errores.mensaje} id="contacto-mensaje-error" />

            <MensajeExito mensaje={exito} alOcultar={() => setExito(null)} />

            <button type="submit" className="btn-primario">{t('ayuda.enviarMensaje')}</button>
          </fieldset>
        </form>
      </section>
    </>
  )
}
