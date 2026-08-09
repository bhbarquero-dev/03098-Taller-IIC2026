import { Link } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useDataStore } from '../hooks/useDataStore'
import EtiquetaEstado from '../components/EtiquetaEstado'

export default function AdminPromociones() {
  const { t, formatearFecha } = useIdioma()
  useTituloPagina('admin.promocionesTitulo')

  const { datos: promociones } = useDataStore('promociones')
  const listado = promociones || []

  return (
    <section aria-labelledby="promociones-heading">
      <h2 id="promociones-heading">{t('admin.promocionesTitulo')}</h2>

      <table className="tabla-panel">
        <thead>
          <tr>
            <th scope="col">{t('comun.titulo')}</th>
            <th scope="col">{t('admin.vigenciaDesde')}</th>
            <th scope="col">{t('admin.vigenciaHasta')}</th>
            <th scope="col">{t('comun.estado')}</th>
            <th scope="col">{t('comun.acciones')}</th>
          </tr>
        </thead>
        <tbody>
          {listado.map((promocion) => (
            <tr key={promocion.id}>
              <td>{promocion.titulo}</td>
              <td>
                <time dateTime={promocion.vigenciaInicio}>
                  {formatearFecha(promocion.vigenciaInicio, 'medium')}
                </time>
              </td>
              <td>
                <time dateTime={promocion.vigenciaFin}>
                  {formatearFecha(promocion.vigenciaFin, 'medium')}
                </time>
              </td>
              <td><EtiquetaEstado estado={promocion.estado} /></td>
              <td><Link to={`/admin-promocion-editar/${promocion.id}`}>{t('comun.editar')}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>

      <p><Link to="/admin-panel">{t('admin.volverPanel')}</Link></p>
    </section>
  )
}
