import { Link } from 'react-router-dom'

export default function TarjetaPropiedad({ propiedad }) {
  return (
    <article className="tarjeta-propiedad">
      <figure>
        <img src={`/imagenes/${propiedad.imagen}`} alt={`Vista de ${propiedad.nombre} en ${propiedad.ubicacion}`} />
        <figcaption className="sr-only">{propiedad.nombre} — {propiedad.ubicacion}</figcaption>
      </figure>
      <h4>{propiedad.nombre}</h4>
      <p>{propiedad.ubicacion}</p>
      <p>Capacidad para {propiedad.capacidad} huéspedes · Desde ${propiedad.precioNoche} por noche · ⭐ {propiedad.valoracion} de 5</p>
      <Link className="btn-secundario" to={`/propiedades/${propiedad.id}`}>Ver detalles y reservar</Link>
    </article>
  )
}
