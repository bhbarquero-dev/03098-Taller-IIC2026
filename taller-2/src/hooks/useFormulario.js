import { useCallback, useRef, useState } from 'react'
import { primerCampoConError } from '../utils/validaciones'

/**
 * Estado, validación y foco de un formulario controlado.
 *
 * Centraliza el patrón que repiten los ~25 formularios del sitio:
 * valores controlados, errores por campo, mensaje de éxito, y foco automático
 * al primer campo inválido al enviar (manipulación directa del DOM vía refs).
 *
 * `validarValores` recibe los valores y devuelve un objeto de errores con la
 * forma `{ campo: { clave, params } }` (ver src/utils/validaciones.js).
 */
export function useFormulario({ valoresIniciales, validarValores, alEnviar, prefijoId = 'campo' }) {
  const [valores, setValores] = useState(valoresIniciales)
  const [errores, setErrores] = useState({})
  const [exito, setExito] = useState(null)
  const referencias = useRef({})

  const asignarValor = useCallback((nombre, valor) => {
    setValores((anteriores) => ({ ...anteriores, [nombre]: valor }))
  }, [])

  const manejarCambio = useCallback((evento) => {
    const { name, type, value, checked, files, multiple, options } = evento.target

    let nuevoValor = value
    if (type === 'checkbox') nuevoValor = checked
    else if (type === 'file') nuevoValor = files
    else if (multiple && options) {
      nuevoValor = Array.from(options).filter(o => o.selected).map(o => o.value)
    }

    setValores((anteriores) => ({ ...anteriores, [name]: nuevoValor }))
    // El error del campo desaparece en cuanto el usuario lo corrige.
    setErrores((anteriores) => {
      if (!anteriores[name]) return anteriores
      const { [name]: descartado, ...resto } = anteriores
      return resto
    })
  }, [])

  /** Alterna un valor dentro de un campo de selección múltiple (checkbox group). */
  const alternarEnLista = useCallback((nombre, valor) => {
    setValores((anteriores) => {
      const lista = anteriores[nombre] || []
      return {
        ...anteriores,
        [nombre]: lista.includes(valor)
          ? lista.filter((elemento) => elemento !== valor)
          : [...lista, valor]
      }
    })
  }, [])

  const manejarEnvio = useCallback(async (evento) => {
    evento.preventDefault()
    setExito(null)

    const erroresEncontrados = validarValores ? validarValores(valores) : {}
    setErrores(erroresEncontrados)

    const campoFallido = primerCampoConError(erroresEncontrados)
    if (campoFallido) {
      referencias.current[campoFallido]?.focus()
      return
    }

    const resultado = await alEnviar?.(valores, { setExito, setValores, setErrores })
    return resultado
  }, [valores, validarValores, alEnviar])

  const reiniciar = useCallback((nuevosValores = valoresIniciales) => {
    setValores(nuevosValores)
    setErrores({})
  }, [valoresIniciales])

  /**
   * Props comunes de un campo: id, name, valor controlado, referencia para el
   * foco, clase de estado inválido y enlace accesible con su mensaje de error.
   */
  const propsCampo = useCallback((nombre, extra = {}) => {
    const id = `${prefijoId}-${nombre}`
    const tieneError = !!errores[nombre]
    return {
      id,
      name: nombre,
      onChange: manejarCambio,
      ref: (nodo) => { referencias.current[nombre] = nodo },
      className: tieneError ? 'campo-invalido' : undefined,
      'aria-describedby': tieneError ? `${id}-error` : undefined,
      ...extra
    }
  }, [errores, manejarCambio, prefijoId])

  return {
    valores,
    errores,
    exito,
    setExito,
    setValores,
    setErrores,
    asignarValor,
    alternarEnLista,
    manejarCambio,
    manejarEnvio,
    propsCampo,
    reiniciar,
    prefijoId
  }
}
