import { useEffect } from 'react'
import { useIdioma } from '../context/IdiomaContext'

/**
 * Actualiza `document.title` con el título traducido de la página.
 * Es manipulación directa del DOM fuera del árbol de React.
 */
export function useTituloPagina(clave, parametros) {
  const { t, idioma } = useIdioma()

  useEffect(() => {
    const titulo = clave ? t(clave, parametros) : null
    document.title = titulo ? `StayBooker 360 — ${titulo}` : 'StayBooker 360'
    // Las dependencias son primitivas para no re-disparar en cada render por la
    // identidad del objeto de parámetros.
  }, [clave, idioma, JSON.stringify(parametros)]) // eslint-disable-line react-hooks/exhaustive-deps
}
