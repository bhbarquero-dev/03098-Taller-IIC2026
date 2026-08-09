import { Link } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useDataStore } from '../hooks/useDataStore'

export default function Blog() {
  const { t, formatearFecha } = useIdioma()
  useTituloPagina('blog.titulo')

  const { datos: posts, cargando } = useDataStore('posts', { filtros: { estado: 'publicado' } })
  const listado = posts || []

  return (
    <section aria-labelledby="blog-heading">
      <h2 id="blog-heading">{t('blog.titulo')}</h2>
      <p>{t('blog.intro')}</p>

      {cargando && <p>{t('comun.cargando')}</p>}
      {!cargando && listado.length === 0 && <p>{t('blog.sinPosts')}</p>}

      {listado.map((post) => (
        <article key={post.id} className="tarjeta-post">
          <figure>
            <img src={`/imagenes/${post.imagen}`} alt={post.imagenAlt} />
            <figcaption>{post.imagenPie}</figcaption>
          </figure>
          <h3>{post.titulo}</h3>
          <p>{t('blog.publicadoEl', { fecha: formatearFecha(post.fechaPublicacion) })}</p>
          <p>{post.extracto}</p>
          <p><Link to={`/blog/${post.id}`}>{t('blog.leerMas')}</Link></p>
        </article>
      ))}
    </section>
  )
}
