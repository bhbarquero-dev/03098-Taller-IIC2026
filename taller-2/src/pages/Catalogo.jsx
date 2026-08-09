import { Fragment, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDataStore } from '../hooks/useDataStore'
import TarjetaPropiedad from '../components/TarjetaPropiedad'
import { TIPOS_ALOJAMIENTO } from '../utils/tiposAlojamiento'

const SERVICIOS = [
  { valor: 'wifi', nombre: 'WiFi' },
  { valor: 'piscina', nombre: 'Piscina' },
  { valor: 'parqueo', nombre: 'Parqueo' },
  { valor: 'mascotas', nombre: 'Admite mascotas' },
  { valor: 'cocina', nombre: 'Cocina equipada' }
]

export default function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { datos: propiedades, cargando, cargar } = useDataStore('propiedades')

  useEffect(() => {
    cargar({
      destino: searchParams.get('destino') || undefined,
      tipo: searchParams.get('tipo') || undefined,
      precioMin: searchParams.get('precio_min') || undefined,
      precioMax: searchParams.get('precio_max') || undefined,
      capacidad: searchParams.get('capacidad') || undefined,
      valoracionMin: searchParams.get('valoracion_min') || undefined,
      servicios: searchParams.getAll('servicios')
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString(), cargar])

  function aplicarFiltros(evento) {
    evento.preventDefault()
    const campos = new FormData(evento.target)
    const parametros = new URLSearchParams()
    for (const [clave, valor] of campos.entries()) {
      if (valor) parametros.append(clave, valor)
    }
    setSearchParams(parametros)
  }

  const resultados = propiedades || []
  const serviciosActivos = searchParams.getAll('servicios')

  return (
    <>
      <h2>Catálogo de alojamientos</h2>

      <aside className="filtro-aside" aria-labelledby="filtro-heading">
        <h3 id="filtro-heading">Filtrar resultados</h3>

        <form onSubmit={aplicarFiltros}>
          <fieldset>
            <legend>Filtros</legend>

            <label htmlFor="filtro-tipo">Tipo de alojamiento</label>
            <select id="filtro-tipo" name="tipo" defaultValue={searchParams.get('tipo') || ''}>
              <option value="">Cualquiera</option>
              {TIPOS_ALOJAMIENTO.map(tipo => (
                <option value={tipo.valor} key={tipo.valor}>{tipo.nombre}</option>
              ))}
            </select>

            <label htmlFor="filtro-precio-min">Precio mínimo por noche</label>
            <input type="number" id="filtro-precio-min" name="precio_min" min="0" defaultValue={searchParams.get('precio_min') || ''} />

            <label htmlFor="filtro-precio-max">Precio máximo por noche</label>
            <input type="number" id="filtro-precio-max" name="precio_max" min="0" defaultValue={searchParams.get('precio_max') || ''} />

            <label htmlFor="filtro-capacidad">Capacidad de huéspedes</label>
            <input type="number" id="filtro-capacidad" name="capacidad" min="1" defaultValue={searchParams.get('capacidad') || ''} />

            <label htmlFor="filtro-destino">Ubicación o destino</label>
            <input type="text" id="filtro-destino" name="destino" placeholder="Ciudad o región" defaultValue={searchParams.get('destino') || ''} />

            <label htmlFor="filtro-valoracion">Valoración mínima</label>
            <select id="filtro-valoracion" name="valoracion_min" defaultValue={searchParams.get('valoracion_min') || ''}>
              <option value="">Cualquiera</option>
              <option value="4">4 o más</option>
              <option value="4.5">4.5 o más</option>
              <option value="5">5</option>
            </select>

            <fieldset>
              <legend>Servicios</legend>

              {SERVICIOS.map(servicio => (
                <Fragment key={servicio.valor}>
                  <input
                    type="checkbox"
                    id={`filtro-${servicio.valor}`}
                    name="servicios"
                    value={servicio.valor}
                    defaultChecked={serviciosActivos.includes(servicio.valor)}
                  />
                  <label htmlFor={`filtro-${servicio.valor}`}>{servicio.nombre}</label>
                </Fragment>
              ))}
            </fieldset>

            <button type="submit" className="btn-primario">Aplicar filtros</button>
          </fieldset>
        </form>
      </aside>

      <section className="resultados-lista" aria-labelledby="resultados-heading">
        <h3 id="resultados-heading">Resultados</h3>

        {cargando && <p>Cargando propiedades...</p>}

        {!cargando && resultados.length === 0 && (
          <p>No se encontraron propiedades con esos filtros.</p>
        )}

        {resultados.map(propiedad => (
          <TarjetaPropiedad propiedad={propiedad} key={propiedad.id} />
        ))}
      </section>
    </>
  )
}
