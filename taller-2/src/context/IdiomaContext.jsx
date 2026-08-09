import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { IDIOMAS, IDIOMA_POR_DEFECTO, LOCALES, traducir } from '../i18n'
import { useSesion } from './SesionContext'

/**
 * Idioma y moneda de la interfaz.
 *
 * Son dos preferencias independientes: se puede ver la interfaz en inglés con
 * precios en colones. El idioma aporta el locale de formateo de `Intl`.
 *
 * Persisten en localStorage y, si hay sesión iniciada, también en las
 * preferencias del usuario — que es por donde viajarían al back-end.
 */

const CLAVE_IDIOMA = 'staybooker_idioma'
const CLAVE_MONEDA = 'staybooker_moneda'
const MONEDA_POR_DEFECTO = 'crc'

const IdiomaContext = createContext(null)

const CODIGOS_VALIDOS = IDIOMAS.map((idioma) => idioma.codigo)

function leerPreferencia(clave, valorPorDefecto, validos) {
  const guardado = localStorage.getItem(clave)
  return guardado && validos.includes(guardado) ? guardado : valorPorDefecto
}

export function IdiomaProvider({ children }) {
  const { usuario, actualizarPerfil } = useSesion()

  const [idioma, setIdioma] = useState(() => (
    leerPreferencia(CLAVE_IDIOMA, IDIOMA_POR_DEFECTO, CODIGOS_VALIDOS)
  ))
  const [moneda, setMoneda] = useState(() => (
    leerPreferencia(CLAVE_MONEDA, MONEDA_POR_DEFECTO, ['crc', 'usd'])
  ))

  // Al iniciar sesión, las preferencias del perfil ganan sobre las del navegador.
  useEffect(() => {
    if (!usuario?.preferencias) return
    const { idioma: idiomaPerfil, moneda: monedaPerfil } = usuario.preferencias
    if (idiomaPerfil && CODIGOS_VALIDOS.includes(idiomaPerfil)) setIdioma(idiomaPerfil)
    if (monedaPerfil && ['crc', 'usd'].includes(monedaPerfil)) setMoneda(monedaPerfil)
  }, [usuario?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Manipulación directa del DOM: el atributo lang del documento debe reflejar
  // el idioma activo para lectores de pantalla y para el propio navegador.
  useEffect(() => {
    document.documentElement.lang = idioma
  }, [idioma])

  const guardarPreferencia = useCallback((campo, valor, claveStorage, aplicar) => {
    aplicar(valor)
    localStorage.setItem(claveStorage, valor)
    if (usuario) {
      actualizarPerfil({ preferencias: { ...usuario.preferencias, [campo]: valor } })
    }
  }, [usuario, actualizarPerfil])

  const cambiarIdioma = useCallback((nuevo) => {
    if (!CODIGOS_VALIDOS.includes(nuevo)) return
    guardarPreferencia('idioma', nuevo, CLAVE_IDIOMA, setIdioma)
  }, [guardarPreferencia])

  const cambiarMoneda = useCallback((nueva) => {
    if (!['crc', 'usd'].includes(nueva)) return
    guardarPreferencia('moneda', nueva, CLAVE_MONEDA, setMoneda)
  }, [guardarPreferencia])

  const valor = useMemo(() => {
    const locale = LOCALES[idioma]

    const t = (ruta, parametros) => traducir(idioma, ruta, parametros)

    const formatearMoneda = (monto) => new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: moneda.toUpperCase(),
      maximumFractionDigits: 0
    }).format(Number(monto) || 0)

    const formatearFecha = (iso, estilo = 'long') => {
      if (!iso) return ''
      // 'YYYY-MM-DD' se interpreta como UTC; se fuerza hora local para que no
      // se corra un día hacia atrás en zonas con desfase negativo (Costa Rica).
      const fecha = typeof iso === 'string' && iso.length === 10
        ? new Date(`${iso}T00:00:00`)
        : new Date(iso)
      if (Number.isNaN(fecha.getTime())) return ''
      return new Intl.DateTimeFormat(locale, { dateStyle: estilo }).format(fecha)
    }

    const formatearNumero = (numero) => new Intl.NumberFormat(locale).format(numero)

    return {
      idioma,
      moneda,
      locale,
      idiomas: IDIOMAS,
      cambiarIdioma,
      cambiarMoneda,
      t,
      formatearMoneda,
      formatearFecha,
      formatearNumero
    }
  }, [idioma, moneda, cambiarIdioma, cambiarMoneda])

  return <IdiomaContext.Provider value={valor}>{children}</IdiomaContext.Provider>
}

export function useIdioma() {
  const contexto = useContext(IdiomaContext)
  if (!contexto) {
    throw new Error('useIdioma debe usarse dentro de <IdiomaProvider>')
  }
  return contexto
}
