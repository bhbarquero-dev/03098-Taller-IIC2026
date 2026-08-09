import { Link } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'

export default function TarjetaPropiedad({ propiedad }) {
  const { t, formatearMoneda } = useIdioma()

  return (
    <article className="tarjeta-propiedad">
      <figure>
        <img
          src={`/imagenes/${propiedad.imagenes[0]}`}
          alt={t('tarjeta.alt', { nombre: propiedad.nombre, ubicacion: propiedad.ubicacion })}
        />
        <figcaption className="sr-only">{propiedad.nombre} — {propiedad.ubicacion}</figcaption>
      </figure>
      <h4>{propiedad.nombre}</h4>
      <p>{propiedad.ubicacion}</p>
      <p>{t('tarjeta.resumen', {
        capacidad: propiedad.capacidad,
        precio: formatearMoneda(propiedad.precioNoche),
        valoracion: propiedad.valoracion
      })}</p>
      <Link className="btn-secundario" to={`/propiedades/${propiedad.id}`}>
        {t('tarjeta.verDetalles')}
      </Link>
    </article>
  )
}
