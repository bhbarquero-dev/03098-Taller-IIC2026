import { Link, useParams } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useDataStore } from '../hooks/useDataStore'

export default function BlogPost() {
  const { id } = useParams()
  const { t, formatearFecha } = useIdioma()
  const { datos: post, cargando } = useDataStore('post', { id })

  useTituloPagina('blog.titulo')

  if (cargando) {
    return <section><p>{t('comun.cargando')}</p></section>
  }

  if (!post || post.estado !== 'publicado') {
    return (
      <section aria-labelledby="post-heading">
        <h2 id="post-heading">{t('blog.titulo')}</h2>
        <p>{t('blog.noExiste')}</p>
        <p><Link to="/blog">{t('blog.volver')}</Link></p>
      </section>
    )
  }

  return (
    <article aria-labelledby="post-heading">
      <h2 id="post-heading">{post.titulo}</h2>
      <p>{t('blog.publicadoPor', {
        fecha: formatearFecha(post.fechaPublicacion),
        autor: post.autor
      })}</p>

      <figure>
        <img src={`/imagenes/${post.imagen}`} alt={post.imagenAlt} />
        <figcaption>{post.imagenPie}</figcaption>
      </figure>

      {post.contenido.map((parrafo, indice) => (
        <p key={indice}>{parrafo}</p>
      ))}

      <p><Link to="/blog">{t('blog.volver')}</Link></p>
    </article>
  )
}
