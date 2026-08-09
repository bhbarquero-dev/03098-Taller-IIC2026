import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useDataStore } from '../hooks/useDataStore'
import { useFormulario } from '../hooks/useFormulario'
import { MensajeError, MensajeExito } from '../components/MensajeCampo'
import { actualizarPost } from '../utils/dataStore'
import { ESTADOS_POST } from '../utils/dataStore/posts'
import { imagenesValidas, requerido, validar } from '../utils/validaciones'

export default function AdminBlogPostEditar() {
  const { id } = useParams()
  const { t } = useIdioma()
  useTituloPagina('admin.blogTitulo')

  const { datos: post, cargar } = useDataStore('post', { id })

  const formulario = useFormulario({
    prefijoId: 'post',
    valoresIniciales: {
      titulo: '', autor: '', fecha_publicacion: '', imagen: null, contenido: '', estado: 'borrador'
    },
    validarValores: (v) => validar({
      titulo: requerido(v.titulo),
      autor: requerido(v.autor),
      fecha_publicacion: requerido(v.fecha_publicacion),
      imagen: imagenesValidas(v.imagen),
      contenido: requerido(v.contenido)
    }),
    alEnviar: (v, { setExito }) => {
      actualizarPost(id, {
        titulo: v.titulo.trim(),
        autor: v.autor.trim(),
        fechaPublicacion: v.fecha_publicacion,
        // Sin back-end el archivo no se sube: se registra su nombre.
        imagen: v.imagen && v.imagen.length > 0 ? v.imagen[0].name : post.imagen,
        // Un párrafo por línea, igual que se muestra en la página del blog.
        contenido: v.contenido.split('\n').map((linea) => linea.trim()).filter(Boolean),
        estado: v.estado
      })
      cargar()
      setExito(t('admin.postExito'))
    }
  })

  useEffect(() => {
    if (!post) return
    formulario.setValores({
      titulo: post.titulo || '',
      autor: post.autor || '',
      fecha_publicacion: post.fechaPublicacion || '',
      imagen: null,
      contenido: (post.contenido || []).join('\n'),
      estado: post.estado || 'borrador'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?.id])

  if (!post) {
    return (
      <section aria-labelledby="post-heading">
        <h2 id="post-heading">{t('admin.blogTitulo')}</h2>
        <p>{t('comun.sinDatos')}</p>
        <p><Link to="/admin-blog">{t('comun.volver')}</Link></p>
      </section>
    )
  }

  const { valores, errores, exito, setExito, manejarEnvio, propsCampo } = formulario

  return (
    <section aria-labelledby="post-heading">
      <h2 id="post-heading">{t('admin.postTitulo', { titulo: post.titulo })}</h2>

      <form className="panel-formulario" onSubmit={manejarEnvio} noValidate>
        <fieldset>
          <legend>{t('admin.datosPost')}</legend>

          <label htmlFor="post-titulo">{t('comun.titulo')}</label>
          <input type="text" {...propsCampo('titulo')} value={valores.titulo} required />
          <MensajeError error={errores.titulo} id="post-titulo-error" />

          <label htmlFor="post-autor">{t('admin.autor')}</label>
          <input type="text" {...propsCampo('autor')} value={valores.autor} required />
          <MensajeError error={errores.autor} id="post-autor-error" />

          <label htmlFor="post-fecha_publicacion">{t('admin.fechaPublicacion')}</label>
          <input type="date" {...propsCampo('fecha_publicacion')} value={valores.fecha_publicacion} required />
          <MensajeError error={errores.fecha_publicacion} id="post-fecha_publicacion-error" />

          <label htmlFor="post-imagen">{t('admin.imagen')}</label>
          <input type="file" {...propsCampo('imagen')} accept=".jpg,.jpeg,.png,.webp" />
          <p className="ayuda-campo">{t('formPropiedad.ayudaImagenes')}</p>
          <MensajeError error={errores.imagen} id="post-imagen-error" />

          <label htmlFor="post-contenido">{t('admin.contenido')}</label>
          <textarea {...propsCampo('contenido')} value={valores.contenido} rows="10" required />
          <p className="ayuda-campo">{t('admin.contenidoAyuda')}</p>
          <MensajeError error={errores.contenido} id="post-contenido-error" />

          <label htmlFor="post-estado">{t('comun.estado')}</label>
          <select {...propsCampo('estado')} value={valores.estado}>
            {ESTADOS_POST.map((estado) => (
              <option value={estado} key={estado}>{t(`estados.${estado}`)}</option>
            ))}
          </select>

          <MensajeExito mensaje={exito} alOcultar={() => setExito(null)} />

          <button type="submit" className="btn-primario">{t('comun.guardar')}</button>
        </fieldset>
      </form>

      <p><Link to="/admin-blog">{t('admin.blogTitulo')}</Link></p>
    </section>
  )
}
