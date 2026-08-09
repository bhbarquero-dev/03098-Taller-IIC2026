import { Link } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useDataStore } from '../hooks/useDataStore'
import EtiquetaEstado from '../components/EtiquetaEstado'
import { obtenerUsuario } from '../utils/dataStore'
import { claveTipo } from '../utils/catalogos'

export default function AdminAlojamientos() {
  const { t } = useIdioma()
  useTituloPagina('admin.alojamientosTitulo')

  const { datos: propiedades } = useDataStore('propiedades', { filtros: { incluirTodas: true } })
  const listado = propiedades || []

  return (
    <section aria-labelledby="alojamientos-heading">
      <h2 id="alojamientos-heading">{t('admin.alojamientosTitulo')}</h2>

      <table className="tabla-panel">
        <thead>
          <tr>
            <th scope="col">{t('comun.propiedad')}</th>
            <th scope="col">{t('comun.anfitrion')}</th>
            <th scope="col">{t('comun.tipo')}</th>
            <th scope="col">{t('comun.estado')}</th>
            <th scope="col">{t('comun.acciones')}</th>
          </tr>
        </thead>
        <tbody>
          {listado.map((propiedad) => (
            <tr key={propiedad.id}>
              <td>{propiedad.nombre}</td>
              <td>{obtenerUsuario(propiedad.anfitrionId)?.nombre || '—'}</td>
              <td>{t(claveTipo(propiedad.tipo))}</td>
              <td><EtiquetaEstado estado={propiedad.estado} /></td>
              <td><Link to={`/admin-alojamiento-editar/${propiedad.id}`}>{t('comun.editar')}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>

      <p><Link to="/admin-panel">{t('admin.volverPanel')}</Link></p>
    </section>
  )
}
