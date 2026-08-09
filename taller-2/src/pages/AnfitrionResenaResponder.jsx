import { Link, useParams } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useDataStore } from '../hooks/useDataStore'
import { useFormulario } from '../hooks/useFormulario'
import { MensajeError, MensajeExito } from '../components/MensajeCampo'
import { actualizarResena, obtenerPropiedad } from '../utils/dataStore'
import { requerido, textoMaximo, validar } from '../utils/validaciones'

export default function AnfitrionResenaResponder() {
  const { id } = useParams()
  const { t, formatearFecha } = useIdioma()
  useTituloPagina('anfitrion.detalleResena')

  const { datos: resena, cargar } = useDataStore('resena', { id })

  const formulario = useFormulario({
    prefijoId: 'respuesta',
    valoresIniciales: { respuesta: '' },
    validarValores: (v) => validar({
      respuesta: requerido(v.respuesta) || textoMaximo(v.respuesta)
    }),
    alEnviar: (v, { setExito, setValores }) => {
      actualizarResena(id, {
        respuestaAnfitrion: v.respuesta.trim(),
        fechaRespuesta: new Date().toISOString().slice(0, 10)
      })
      cargar()
      setValores({ respuesta: '' })
      setExito(t('anfitrion.respuestaExito'))
    }
  })

  if (!resena) {
    return (
      <section aria-labelledby="resena-heading">
        <h2 id="resena-heading">{t('anfitrion.detalleResena')}</h2>
        <p>{t('comun.sinDatos')}</p>
        <p><Link to="/anfitrion-propiedades">{t('anfitrion.misPropiedades')}</Link></p>
      </section>
    )
  }

  const propiedad = obtenerPropiedad(resena.propiedadId)
  const { valores, errores, exito, setExito, manejarEnvio, propsCampo } = formulario

  return (
    <>
      <section aria-labelledby="resena-heading">
        <h2 id="resena-heading">{t('anfitrion.resenaDe', { autor: resena.autor })}</h2>

        <h3>{t('anfitrion.detalleResena')}</h3>
        <ul>
          <li>{t('anfitrion.consultaPropiedad', { propiedad: propiedad?.nombre || '—' })}</li>
          <li>{t('comun.valoracionDe', { valor: resena.valoracion })}</li>
          <li>
            <time dateTime={resena.fecha}>
              {t('anfitrion.consultaFecha', { fecha: formatearFecha(resena.fecha) })}
            </time>
          </li>
        </ul>

        <blockquote>
          <p>&quot;{resena.comentario}&quot;</p>
        </blockquote>

        {resena.respuestaAnfitrion && (
          <p>{t('anfitrion.respuestaPrevia', { texto: resena.respuestaAnfitrion })}</p>
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

        <p>
          <Link to={`/anfitrion-propiedad-resenas/${resena.propiedadId}`}>
            {t('anfitrion.verResenas')}
          </Link>
        </p>
      </section>
    </>
  )
}
