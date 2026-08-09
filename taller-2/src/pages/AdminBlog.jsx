import { Link } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useDataStore } from '../hooks/useDataStore'
import EtiquetaEstado from '../components/EtiquetaEstado'

export default function AdminBlog() {
  const { t, formatearFecha } = useIdioma()
  useTituloPagina('admin.blogTitulo')

  const { datos: posts } = useDataStore('posts')
  const listado = posts || []

  return (
    <section aria-labelledby="blog-heading">
      <h2 id="blog-heading">{t('admin.blogTitulo')}</h2>

      <table className="tabla-panel">
        <thead>
          <tr>
            <th scope="col">{t('comun.titulo')}</th>
            <th scope="col">{t('admin.autor')}</th>
            <th scope="col">{t('admin.fechaPublicacion')}</th>
            <th scope="col">{t('comun.estado')}</th>
            <th scope="col">{t('comun.acciones')}</th>
          </tr>
        </thead>
        <tbody>
          {listado.map((post) => (
            <tr key={post.id}>
              <td>{post.titulo}</td>
              <td>{post.autor}</td>
              <td>
                <time dateTime={post.fechaPublicacion}>
                  {formatearFecha(post.fechaPublicacion, 'medium')}
                </time>
              </td>
              <td><EtiquetaEstado estado={post.estado} /></td>
              <td><Link to={`/admin-blog-post-editar/${post.id}`}>{t('comun.editar')}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>

      <p><Link to="/admin-panel">{t('admin.volverPanel')}</Link></p>
    </section>
  )
}
