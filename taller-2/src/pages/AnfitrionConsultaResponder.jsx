import { Link, useParams } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useDataStore } from '../hooks/useDataStore'
import { useFormulario } from '../hooks/useFormulario'
import { MensajeError, MensajeExito } from '../components/MensajeCampo'
import { obtenerPropiedad, responderConsulta } from '../utils/dataStore'
import { requerido, textoMaximo, validar } from '../utils/validaciones'

export default function AnfitrionConsultaResponder() {
  const { id } = useParams()
  const { t, formatearFecha } = useIdioma()
  useTituloPagina('anfitrion.respuestaTitulo')

  const { datos: consulta, cargar } = useDataStore('consulta', { id })

  const formulario = useFormulario({
    prefijoId: 'respuesta',
    valoresIniciales: { respuesta: '' },
    validarValores: (v) => validar({
      respuesta: requerido(v.respuesta) || textoMaximo(v.respuesta)
    }),
    alEnviar: (v, { setExito, setValores }) => {
      responderConsulta(id, v.respuesta.trim())
      cargar()
      setValores({ respuesta: '' })
      setExito(t('anfitrion.respuestaExito'))
    }
  })

  if (!consulta) {
    return (
      <section aria-labelledby="consulta-heading">
        <h2 id="consulta-heading">{t('anfitrion.consultasTitulo')}</h2>
        <p>{t('comun.sinDatos')}</p>
        <p><Link to="/anfitrion-consultas">{t('comun.volver')}</Link></p>
      </section>
    )
  }

  const propiedad = obtenerPropiedad(consulta.propiedadId)
  const { valores, errores, exito, setExito, manejarEnvio, propsCampo } = formulario

  return (
    <>
      <section aria-labelledby="consulta-heading">
        <h2 id="consulta-heading">
          {t('anfitrion.consultaTitulo', { propiedad: propiedad?.nombre || '—' })}
        </h2>

        <h3>{t('anfitrion.detalleConsulta')}</h3>
        <ul>
          <li>{t('anfitrion.consultaAsunto', { asunto: consulta.asunto })}</li>
          <li>{t('anfitrion.consultaPropiedad', { propiedad: propiedad?.nombre || '—' })}</li>
          <li>{t('anfitrion.consultaHuesped', { nombre: consulta.huespedNombre })}</li>
          <li>{t('anfitrion.consultaCorreo', { correo: consulta.huespedCorreo })}</li>
          <li>
            <time dateTime={consulta.fecha}>
              {t('anfitrion.consultaFecha', { fecha: formatearFecha(consulta.fecha) })}
            </time>
          </li>
          <li>{t('anfitrion.consultaEstado', { estado: t(`estados.${consulta.estado}`) })}</li>
        </ul>

        <blockquote>
          <p>&quot;{consulta.mensaje}&quot;</p>
        </blockquote>

        {consulta.respuesta && (
          <p>{t('anfitrion.respuestaPrevia', { texto: consulta.respuesta })}</p>
        )}
      </section>

      <section aria-labelledby="respuesta-heading">
        <h2 id="respuesta-heading">{t('anfitrion.respuestaTitulo')}</h2>

        <form className="panel-formulario" onSubmit={manejarEnvio} noValidate>
          <fieldset>
            <legend>{t('anfitrion.respuestaLeyenda')}</legend>

            <label htmlFor="respuesta-respuesta">{t('anfitrion.respuestaMensaje')}</label>
            <textarea {...propsCampo('respuesta')} value={valores.respuesta} rows="5" maxLength={500} required />
            <MensajeError error={errores.respuesta} id="respuesta-respuesta-error" />

            <MensajeExito mensaje={exito} alOcultar={() => setExito(null)} />

            <button type="submit" className="btn-primario">{t('anfitrion.enviarRespuesta')}</button>
          </fieldset>
        </form>

        <p><Link to="/anfitrion-consultas">{t('anfitrion.consultasTitulo')}</Link></p>
      </section>
    </>
  )
}
