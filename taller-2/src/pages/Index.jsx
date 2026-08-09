import { Link, useNavigate } from 'react-router-dom'
import { useDataStore } from '../hooks/useDataStore'
import TarjetaPropiedad from '../components/TarjetaPropiedad'

const TIPOS_ALOJAMIENTO = [
  { valor: 'casa', nombre: 'Casa', descripcion: 'Espacios completos ideales para familias y grupos.' },
  { valor: 'apartamento', nombre: 'Apartamento', descripcion: 'Opciones compactas en zonas urbanas, ideales para estadías cortas.' },
  { valor: 'villa', nombre: 'Villa', descripcion: 'Propiedades amplias con servicios exclusivos.' },
  { valor: 'cabaña', nombre: 'Cabaña', descripcion: 'Alojamientos rústicos en entornos naturales.' },
  { valor: 'glamping', nombre: 'Glamping', descripcion: 'Experiencias de camping con comodidades de hotel.' }
]

export default function Index() {
  const navigate = useNavigate()
  const { datos: propiedades } = useDataStore('propiedades')
  const { datos: promociones } = useDataStore('promociones')

  const destacadas = (propiedades || []).slice(0, 4)
  const recomendadas = (propiedades || []).slice(4, 8)

  function buscar(evento) {
    evento.preventDefault()
    const campos = new FormData(evento.target)
    const parametros = new URLSearchParams()
    for (const [clave, valor] of campos.entries()) {
      if (valor) parametros.set(clave, valor)
    }
    navigate(`/catalogo?${parametros.toString()}`)
  }

  return (
    <>
      <section aria-labelledby="hero-heading">
        <h2 id="hero-heading">Encuentra tu próximo hospedaje</h2>
        <p>Explora casas, apartamentos, villas, cabañas y glampings alrededor del mundo. StayBooker 360 conecta a
        huéspedes que buscan hospedaje temporal con anfitriones que desean promocionar sus propiedades, todo dentro
        de una misma plataforma digital.</p>

        <form className="formulario-busqueda" onSubmit={buscar}>
          <fieldset>
            <legend>Buscar alojamiento</legend>

            <label htmlFor="busqueda-destino">Destino</label>
            <input type="text" id="busqueda-destino" name="destino" placeholder="Ciudad, región o propiedad" />

            <label htmlFor="busqueda-entrada">Fecha de entrada</label>
            <input type="date" id="busqueda-entrada" name="entrada" />

            <label htmlFor="busqueda-salida">Fecha de salida</label>
            <input type="date" id="busqueda-salida" name="salida" />

            <label htmlFor="busqueda-huespedes">Huéspedes</label>
            <input type="number" id="busqueda-huespedes" name="huespedes" min="1" />

            <button type="submit">Buscar</button>
          </fieldset>
        </form>
      </section>

      <section className="destacados" aria-labelledby="destacados-heading">
        <h2 id="destacados-heading">Alojamientos destacados</h2>

        <h3>Propiedades</h3>

        {destacadas.map(propiedad => (
          <TarjetaPropiedad propiedad={propiedad} key={propiedad.id} />
        ))}

        <h3>Promociones</h3>

        {(promociones || []).map(promocion => (
          <article className="tarjeta-promocion" key={promocion.id}>
            <p className="tarjeta-promocion-badge">{promocion.descuento > 0 ? `-${promocion.descuento}%` : 'Nueva'}</p>
            <h4>{promocion.titulo}</h4>
            <p>{promocion.descripcion}</p>
          </article>
        ))}
      </section>

      <section className="tipos-lista" aria-labelledby="tipos-heading">
        <h2 id="tipos-heading">Tipos de alojamiento</h2>
        {TIPOS_ALOJAMIENTO.map(tipo => (
          <article className="tarjeta-tipo" key={tipo.valor}>
            <h3><Link to={`/catalogo?tipo=${tipo.valor}`}>{tipo.nombre}</Link></h3>
            <p>{tipo.descripcion}</p>
          </article>
        ))}
      </section>

      <section className="banner-anfitrion" aria-labelledby="anfitrion-heading">
        <h2 id="anfitrion-heading">¿Tienes una propiedad? Publícala en StayBooker 360</h2>
        <p>Conoce los beneficios, requisitos y el proceso de afiliación para convertirte en anfitrión dentro de la
        plataforma.</p>
        <Link className="btn-primario" to="/publicar-propiedad">Publica tu propiedad</Link>
      </section>

      <section className="recomendaciones" aria-labelledby="recos-heading">
        <h2 id="recos-heading">Recomendado para ti</h2>

        {recomendadas.map(propiedad => (
          <TarjetaPropiedad propiedad={propiedad} key={propiedad.id} />
        ))}
      </section>
    </>
  )
}
