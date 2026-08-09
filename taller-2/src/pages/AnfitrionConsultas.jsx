import { Link } from 'react-router-dom'
import { useSesion } from '../context/SesionContext'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useDataStore } from '../hooks/useDataStore'
import EtiquetaEstado from '../components/EtiquetaEstado'
import { obtenerPropiedad } from '../utils/dataStore'

export default function AnfitrionConsultas() {
  const { usuario } = useSesion()
  const { t, formatearFecha } = useIdioma()
  useTituloPagina('anfitrion.consultasTitulo')

  const { datos: consultas } = useDataStore('consultas', { filtros: { anfitrionId: usuario.id } })
  const listado = consultas || []

  return (
    <section aria-labelledby="consultas-heading">
      <h2 id="consultas-heading">{t('anfitrion.consultasTitulo')}</h2>

      {listado.length === 0 ? (
        <p>{t('anfitrion.sinConsultas')}</p>
      ) : (
        <table className="tabla-panel">
          <thead>
            <tr>
              <th scope="col">{t('anfitrion.asunto')}</th>
              <th scope="col">{t('comun.propiedad')}</th>
              <th scope="col">{t('comun.huesped')}</th>
              <th scope="col">{t('comun.fecha')}</th>
              <th scope="col">{t('comun.estado')}</th>
              <th scope="col">{t('comun.acciones')}</th>
            </tr>
          </thead>
          <tbody>
            {listado.map((consulta) => (
              <tr key={consulta.id}>
                <td>{consulta.asunto}</td>
                <td>{obtenerPropiedad(consulta.propiedadId)?.nombre || '—'}</td>
                <td>{consulta.huespedNombre}</td>
                <td><time dateTime={consulta.fecha}>{formatearFecha(consulta.fecha, 'medium')}</time></td>
                <td><EtiquetaEstado estado={consulta.estado} /></td>
                <td>
                  <Link to={`/anfitrion-consulta-responder/${consulta.id}`}>
                    {t('anfitrion.responder')}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
