import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDataStore } from '../hooks/useDataStore'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useFormulario } from '../hooks/useFormulario'
import { MensajeError } from '../components/MensajeCampo'
import { hayTraslape } from '../utils/dataStore'
import { contarNoches } from '../utils/calendario'
import {
  fechaNoPasada,
  fechaPosterior,
  numeroEnRango,
  requerido,
  tarjetaCvvValido,
  tarjetaNumeroValido,
  tarjetaVencimientoValido,
  validar
} from '../utils/validaciones'

export default function Reserva() {
  const { propiedadId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { t, formatearMoneda } = useIdioma()

  const { datos: propiedad, cargando } = useDataStore('propiedad', { id: propiedadId })

  useTituloPagina('reserva.estadiaLeyenda')

  // Al volver desde el resumen con "Modificar", los valores vuelven precargados.
  const previos = location.state?.reserva

  const formulario = useFormulario({
    prefijoId: 'reserva',
    valoresIniciales: {
      entrada: previos?.entrada || '',
      salida: previos?.salida || '',
      huespedes: previos?.huespedes || '',
      pago_nombre: previos?.pagoNombre || '',
      pago_numero: '',
      pago_vencimiento: '',
      pago_cvv: ''
    },
    validarValores: (valores) => validar({
      entrada: fechaNoPasada(valores.entrada),
      salida: fechaPosterior(valores.entrada, valores.salida) ||
        (hayTraslape(Number(propiedadId), valores.entrada, valores.salida)
          ? { clave: 'validacion.fechasOcupadas' }
          : null),
      huespedes: numeroEnRango(valores.huespedes, { min: 1, max: propiedad?.capacidad }) ||
        (Number(valores.huespedes) > (propiedad?.capacidad || 0)
          ? { clave: 'validacion.capacidadExcedida', params: { n: propiedad?.capacidad } }
          : null),
      pago_nombre: requerido(valores.pago_nombre),
      pago_numero: tarjetaNumeroValido(valores.pago_numero),
      pago_vencimiento: tarjetaVencimientoValido(valores.pago_vencimiento),
      pago_cvv: tarjetaCvvValido(valores.pago_cvv)
    }),
    alEnviar: (valores) => {
      // El paso de datos entre vistas se hace del lado del cliente, con el
      // estado de navegación de React Router: nada viaja a un servidor.
      navigate('/reserva-resumen', {
        state: {
          reserva: {
            propiedadId: Number(propiedadId),
            entrada: valores.entrada,
            salida: valores.salida,
            huespedes: Number(valores.huespedes),
            pagoNombre: valores.pago_nombre,
            ultimosDigitos: String(valores.pago_numero).replace(/\D/g, '').slice(-4),
            noches: contarNoches(valores.entrada, valores.salida)
          }
        }
      })
    }
  })

  const { valores, errores, manejarEnvio, propsCampo } = formulario

  if (cargando) {
    return <section><p>{t('comun.cargando')}</p></section>
  }

  if (!propiedad) {
    return (
      <section aria-labelledby="reserva-heading">
        <h2 id="reserva-heading">{t('propiedad.noExiste')}</h2>
        <p><Link to="/catalogo">{t('propiedad.volverCatalogo')}</Link></p>
      </section>
    )
  }

  return (
    <section aria-labelledby="reserva-heading">
      <h2 id="reserva-heading">{t('reserva.titulo', { nombre: propiedad.nombre })}</h2>

      <figure>
        <img
          src={`/imagenes/${propiedad.imagenes[0]}`}
          alt={t('tarjeta.alt', { nombre: propiedad.nombre, ubicacion: propiedad.ubicacion })}
        />
        <figcaption>{t('reserva.pie', {
          nombre: propiedad.nombre,
          ubicacion: propiedad.ubicacion,
          precio: formatearMoneda(propiedad.precioNoche)
        })}</figcaption>
      </figure>

      <form onSubmit={manejarEnvio} noValidate>
        <fieldset>
          <legend>{t('reserva.estadiaLeyenda')}</legend>

          <label htmlFor="reserva-entrada">{t('reserva.entrada')}</label>
          <input type="date" {...propsCampo('entrada')} value={valores.entrada} required />
          <MensajeError error={errores.entrada} id="reserva-entrada-error" />

          <label htmlFor="reserva-salida">{t('reserva.salida')}</label>
          <input type="date" {...propsCampo('salida')} value={valores.salida} required />
          <MensajeError error={errores.salida} id="reserva-salida-error" />

          <label htmlFor="reserva-huespedes">{t('reserva.huespedes')}</label>
          <input
            type="number"
            {...propsCampo('huespedes')}
            value={valores.huespedes}
            min="1"
            max={propiedad.capacidad}
            required
          />
          <MensajeError error={errores.huespedes} id="reserva-huespedes-error" />
        </fieldset>

        <fieldset>
          <legend>{t('reserva.pagoLeyenda')}</legend>

          <label htmlFor="reserva-pago_nombre">{t('reserva.pagoNombre')}</label>
          <input type="text" {...propsCampo('pago_nombre')} value={valores.pago_nombre} required />
          <MensajeError error={errores.pago_nombre} id="reserva-pago_nombre-error" />

          <label htmlFor="reserva-pago_numero">{t('reserva.pagoNumero')}</label>
          <input
            type="text"
            {...propsCampo('pago_numero')}
            value={valores.pago_numero}
            inputMode="numeric"
            maxLength={19}
            required
          />
          <MensajeError error={errores.pago_numero} id="reserva-pago_numero-error" />

          <label htmlFor="reserva-pago_vencimiento">{t('reserva.pagoVencimiento')}</label>
          <input
            type="text"
            {...propsCampo('pago_vencimiento')}
            value={valores.pago_vencimiento}
            placeholder="MM/AA"
            maxLength={5}
            required
          />
          <MensajeError error={errores.pago_vencimiento} id="reserva-pago_vencimiento-error" />

          <label htmlFor="reserva-pago_cvv">{t('reserva.pagoCvv')}</label>
          <input
            type="text"
            {...propsCampo('pago_cvv')}
            value={valores.pago_cvv}
            inputMode="numeric"
            maxLength={4}
            required
          />
          <MensajeError error={errores.pago_cvv} id="reserva-pago_cvv-error" />
        </fieldset>

        <button type="submit" className="btn-primario">{t('reserva.continuar')}</button>
      </form>
    </section>
  )
}
