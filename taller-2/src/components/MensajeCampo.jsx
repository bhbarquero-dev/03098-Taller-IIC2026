import { useEffect, useState } from 'react'
import { useIdioma } from '../context/IdiomaContext'

/**
 * Mensaje de error de un campo. Se enlaza con el input mediante
 * `aria-describedby` (ver `propsCampo` de useFormulario).
 */
export function MensajeError({ error, id }) {
  const { t } = useIdioma()
  if (!error) return null
  return <p id={id} className="mensaje-error">{t(error.clave, error.params)}</p>
}

/**
 * Mensaje de éxito de una operación. Desaparece solo a los 4 segundos.
 * `role="status"` hace que los lectores de pantalla lo anuncien sin robar el
 * foco al usuario.
 */
export function MensajeExito({ mensaje, alOcultar, duracion = 4000 }) {
  const [visible, setVisible] = useState(!!mensaje)

  useEffect(() => {
    setVisible(!!mensaje)
    if (!mensaje) return

    const temporizador = setTimeout(() => {
      setVisible(false)
      alOcultar?.()
    }, duracion)

    return () => clearTimeout(temporizador)
  }, [mensaje, duracion, alOcultar])

  if (!mensaje || !visible) return null
  return <p className="mensaje-exito" role="status">{mensaje}</p>
}
