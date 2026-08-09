import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import {
  obtenerIncidencias,
  obtenerPropiedades,
  obtenerReservas,
  obtenerResenas,
  obtenerUsuario,
  obtenerUsuarios
} from '../utils/dataStore'
import { TIPOS_ALOJAMIENTO, claveTipo } from '../utils/catalogos'

const TIPOS_REPORTE = ['consultados', 'reservas', 'usuarios', 'tendencias', 'incidencias']

export default function AdminReportes() {
  const { t, formatearFecha, formatearMoneda, formatearNumero } = useIdioma()
  useTituloPagina('admin.reportesTitulo')

  const [tipo, setTipo] = useState('consultados')

  function generar(evento) {
    evento.preventDefault()
    setTipo(new FormData(evento.target).get('tipo'))
  }

  /** Cada reporte se calcula en vivo desde el data store, no está escrito a mano. */
  function construirReporte() {
    if (tipo === 'consultados') {
      const filas = obtenerPropiedades({ incluirTodas: true })
        .slice()
        .sort((a, b) => (b.consultasContador || 0) - (a.consultasContador || 0))
      return {
        columnas: [t('comun.propiedad'), t('comun.anfitrion'), t('admin.consultas'), t('admin.reservas'), t('admin.valoracionPromedio')],
        filas: filas.map((propiedad) => [
          propiedad.nombre,
          obtenerUsuario(propiedad.anfitrionId)?.nombre || '—',
          formatearNumero(propiedad.consultasContador || 0),
          formatearNumero(obtenerReservas({ propiedadId: propiedad.id }).length),
          propiedad.valoracion || '—'
        ])
      }
    }

    if (tipo === 'reservas') {
      const filas = obtenerReservas()
      return {
        columnas: [t('comun.propiedad'), t('comun.fechas'), t('comun.estado'), t('admin.estadoPago'), t('admin.monto')],
        filas: filas.map((reserva) => [
          obtenerPropiedades({ incluirTodas: true }).find((p) => p.id === reserva.propiedadId)?.nombre || '—',
          `${formatearFecha(reserva.fechaEntrada, 'medium')} → ${formatearFecha(reserva.fechaSalida, 'medium')}`,
          t(`estados.${reserva.estado}`),
          t(`estados.${reserva.estadoPago}`),
          formatearMoneda(reserva.monto)
        ])
      }
    }

    if (tipo === 'usuarios') {
      const filas = obtenerUsuarios()
      return {
        columnas: [t('comun.nombre'), t('admin.tipoCuenta'), t('admin.reservasRealizadas'), t('admin.resenasEscritas'), t('comun.estado')],
        filas: filas.map((usuario) => [
          usuario.nombre,
          t(usuario.rol === 'administrador'
            ? 'admin.cuentaAdmin'
            : usuario.rol === 'anfitrion' ? 'admin.cuentaAnfitrion' : 'admin.cuentaHuesped'),
          formatearNumero(obtenerReservas({ usuarioId: usuario.id }).length),
          formatearNumero(obtenerResenas({ incluirBloqueadas: true }).filter((r) => r.usuarioId === usuario.id).length),
          t(`estados.${usuario.estado}`)
        ])
      }
    }

    if (tipo === 'tendencias') {
      const propiedades = obtenerPropiedades({ incluirTodas: true })
      return {
        columnas: [t('comun.tipo'), t('admin.totalPropiedadesTipo'), t('admin.reservas'), t('admin.precioPromedio')],
        filas: TIPOS_ALOJAMIENTO.map((tipoAlojamiento) => {
          const delTipo = propiedades.filter((propiedad) => propiedad.tipo === tipoAlojamiento)
          const reservas = delTipo.reduce(
            (total, propiedad) => total + obtenerReservas({ propiedadId: propiedad.id }).length,
            0
          )
          const promedio = delTipo.length > 0
            ? delTipo.reduce((suma, propiedad) => suma + propiedad.precioNoche, 0) / delTipo.length
            : 0
          return [
            t(claveTipo(tipoAlojamiento)),
            formatearNumero(delTipo.length),
            formatearNumero(reservas),
            delTipo.length > 0 ? formatearMoneda(promedio) : '—'
          ]
        }).filter((fila) => fila[1] !== formatearNumero(0))
      }
    }

    const incidencias = obtenerIncidencias()
    return {
      columnas: [t('comun.fecha'), t('admin.entidad'), t('comun.tipo'), t('comun.descripcion')],
      filas: incidencias.map((incidencia) => [
        formatearFecha(incidencia.fecha, 'medium'),
        `${incidencia.entidad} #${incidencia.entidadId}`,
        t(`admin.tipo${incidencia.tipo.charAt(0).toUpperCase()}${incidencia.tipo.slice(1)}`),
        incidencia.descripcion
      ])
    }
  }

  const reporte = construirReporte()

  return (
    <section aria-labelledby="reportes-heading">
      <h2 id="reportes-heading">{t('admin.reportesTitulo')}</h2>

      <form onSubmit={generar}>
        <label htmlFor="reporte-tipo">{t('admin.tipoReporte')}</label>
        <select id="reporte-tipo" name="tipo" defaultValue={tipo}>
          {TIPOS_REPORTE.map((valor) => (
            <option value={valor} key={valor}>
              {t(`admin.reporte${valor.charAt(0).toUpperCase()}${valor.slice(1)}`)}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-primario">{t('admin.generar')}</button>
      </form>

      {reporte.filas.length === 0 ? (
        <p>{t('admin.sinResultados')}</p>
      ) : (
        <table className="tabla-panel">
          <caption>{t(`admin.reporte${tipo.charAt(0).toUpperCase()}${tipo.slice(1)}`)}</caption>
          <thead>
            <tr>
              {reporte.columnas.map((columna) => <th scope="col" key={columna}>{columna}</th>)}
            </tr>
          </thead>
          <tbody>
            {reporte.filas.map((fila, indice) => (
              <tr key={indice}>
                {fila.map((celda, indiceCelda) => <td key={indiceCelda}>{celda}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* window.print es un objeto nativo del navegador: en Taller 1 este botón
          no podía hacer nada porque no se permitía JavaScript. */}
      <p>
        <button type="button" className="btn-secundario" onClick={() => window.print()}>
          {t('admin.imprimir')}
        </button>
      </p>

      <p><Link to="/admin-panel">{t('admin.volverPanel')}</Link></p>
    </section>
  )
}
