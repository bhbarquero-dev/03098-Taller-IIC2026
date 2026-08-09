import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSesion } from '../context/SesionContext'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useDataStore } from '../hooks/useDataStore'
import { MensajeExito } from '../components/MensajeCampo'
import EtiquetaEstado from '../components/EtiquetaEstado'
import { obtenerResenas } from '../utils/dataStore'
import { claveTipo } from '../utils/catalogos'

export default function AnfitrionPropiedades() {
  const { usuario } = useSesion()
  const { t } = useIdioma()
  const location = useLocation()
  useTituloPagina('anfitrion.misPropiedades')

  const [mensaje, setMensaje] = useState(location.state?.mensaje || null)
  const { datos: propiedades } = useDataStore('propiedades', {
    filtros: { incluirTodas: true, anfitrionId: usuario.id }
  })

  const listado = propiedades || []

  return (
    <section aria-labelledby="propiedades-heading">
      <h2 id="propiedades-heading">{t('anfitrion.misPropiedades')}</h2>

      <MensajeExito mensaje={mensaje} alOcultar={() => setMensaje(null)} />

      <p><Link to="/publicar-propiedad">{t('anfitrion.nuevaPropiedad')}</Link></p>

      {listado.length === 0 && <p>{t('anfitrion.sinPropiedades')}</p>}

      {listado.map((propiedad) => {
        const tieneResenas = obtenerResenas({ propiedadId: propiedad.id, incluirBloqueadas: true }).length > 0

        return (
          <article className="tarjeta-panel" key={propiedad.id}>
            <figure>
              <img
                src={`/imagenes/${propiedad.imagenes[0]}`}
                alt={t('tarjeta.alt', { nombre: propiedad.nombre, ubicacion: propiedad.ubicacion })}
              />
              <figcaption>{propiedad.nombre} — {propiedad.ubicacion}</figcaption>
            </figure>

            <h3>{propiedad.nombre}</h3>
            <p>{t('anfitrion.resumenPropiedad', {
              tipo: t(claveTipo(propiedad.tipo)),
              capacidad: propiedad.capacidad,
              valoracion: propiedad.valoracion
            })}</p>
            <p><EtiquetaEstado estado={propiedad.estado} /></p>

            {propiedad.estado === 'rechazada' && propiedad.motivoRechazo && (
              <p>{t('anfitrion.motivoRechazo', { motivo: propiedad.motivoRechazo })}</p>
            )}

            <p className="acciones-fila">
              {propiedad.estado === 'publicada' && (
                <Link className="btn-secundario" to={`/propiedades/${propiedad.id}`}>
                  {t('anfitrion.verDetalle')}
                </Link>
              )}
              <Link className="btn-secundario" to={`/anfitrion-propiedad-editar/${propiedad.id}`}>
                {t('comun.editar')}
              </Link>
              {tieneResenas && (
                <Link className="btn-secundario" to={`/anfitrion-propiedad-resenas/${propiedad.id}`}>
                  {t('anfitrion.verResenas')}
                </Link>
              )}
            </p>
          </article>
        )
      })}
    </section>
  )
}
