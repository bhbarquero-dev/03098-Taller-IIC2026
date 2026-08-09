import { Link } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useDataStore } from '../hooks/useDataStore'
import EtiquetaEstado from '../components/EtiquetaEstado'

/** Etiqueta del tipo de cuenta, derivada del rol. */
export function claveTipoCuenta(rol) {
  if (rol === 'administrador') return 'admin.cuentaAdmin'
  if (rol === 'anfitrion') return 'admin.cuentaAnfitrion'
  return 'admin.cuentaHuesped'
}

export default function AdminUsuarios() {
  const { t } = useIdioma()
  useTituloPagina('admin.usuariosTitulo')

  const { datos: usuarios } = useDataStore('usuarios')
  const listado = usuarios || []

  return (
    <section aria-labelledby="usuarios-heading">
      <h2 id="usuarios-heading">{t('admin.usuariosTitulo')}</h2>

      <table className="tabla-panel">
          <thead>
            <tr>
              <th scope="col">{t('comun.nombre')}</th>
              <th scope="col">{t('comun.correo')}</th>
              <th scope="col">{t('admin.tipoCuenta')}</th>
              <th scope="col">{t('comun.estado')}</th>
              <th scope="col">{t('comun.acciones')}</th>
            </tr>
          </thead>
          <tbody>
            {listado.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.correo}</td>
                <td>{t(claveTipoCuenta(usuario.rol))}</td>
                <td><EtiquetaEstado estado={usuario.estado} /></td>
                <td><Link to={`/admin-usuario-editar/${usuario.id}`}>{t('comun.editar')}</Link></td>
              </tr>
            ))}
        </tbody>
      </table>

      <p><Link to="/admin-panel">{t('admin.volverPanel')}</Link></p>
    </section>
  )
}
