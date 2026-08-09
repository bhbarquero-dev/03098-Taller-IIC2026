import { useIdioma } from '../context/IdiomaContext'

/**
 * Estado de una entidad (reserva, propiedad, cuenta, pago, post) con su color.
 * El valor almacenado se queda en español; solo se traduce la etiqueta visible.
 */
export default function EtiquetaEstado({ estado }) {
  const { t } = useIdioma()
  if (!estado) return null

  return (
    <span className={`etiqueta-estado estado-${estado}`}>
      {t(`estados.${estado}`)}
    </span>
  )
}
