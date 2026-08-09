import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useDataStore } from '../hooks/useDataStore'
import { MensajeExito } from '../components/MensajeCampo'
import { crearIncidencia, obtenerPropiedad } from '../utils/dataStore'

export default function AnfitrionPropiedadResenas() {
  const { id } = useParams()
  const { t, formatearFecha } = useIdioma()
  useTituloPagina('anfitrion.verResenas')

  const { datos: resenas } = useDataStore('resenas', { filtros: { propiedadId: id, incluirBloqueadas: true } })
  const [mensaje, setMensaje] = useState(null)

  const propiedad = obtenerPropiedad(id)
  const listado = resenas || []

  function reportar(resena) {
    crearIncidencia({
      entidad: 'alojamiento',
      entidadId: Number(id),
      tipo: 'contenido',
      descripcion: `Reseña reportada por el anfitrión: "${resena.comentario}"`
    })
    setMensaje(t('anfitrion.reportada'))
  }

  return (
    <section aria-labelledby="resenas-heading">
      <h2 id="resenas-heading">
        {t('anfitrion.resenasTitulo', { propiedad: propiedad?.nombre || '—' })}
      </h2>

      <MensajeExito mensaje={mensaje} alOcultar={() => setMensaje(null)} />

      {listado.length === 0 ? (
        <p>{t('anfitrion.sinResenasPropiedad')}</p>
      ) : (
        <table className="tabla-panel">
          <thead>
            <tr>
              <th scope="col">{t('comun.huesped')}</th>
              <th scope="col">{t('anfitrion.resenaTexto')}</th>
              <th scope="col">{t('comun.valoracion')}</th>
              <th scope="col">{t('comun.fecha')}</th>
              <th scope="col">{t('comun.acciones')}</th>
            </tr>
          </thead>
          <tbody>
            {listado.map((resena) => (
              <tr key={resena.id}>
                <td>{resena.autor}</td>
                <td>{resena.comentario}</td>
                <td>{t('comun.valoracionDe', { valor: resena.valoracion })}</td>
                <td><time dateTime={resena.fecha}>{formatearFecha(resena.fecha, 'medium')}</time></td>
                <td className="acciones-fila">
                  <Link className="btn-secundario" to={`/anfitrion-resena-responder/${resena.id}`}>
                    {t('anfitrion.responder')}
                  </Link>
                  <button type="button" className="btn-peligro" onClick={() => reportar(resena)}>
                    {t('anfitrion.reportar')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p><Link to="/anfitrion-propiedades">{t('anfitrion.misPropiedades')}</Link></p>
    </section>
  )
}
