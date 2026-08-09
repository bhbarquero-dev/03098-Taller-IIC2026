# Plan de traducción ES / EN — StayBooker 360 (Taller No. 2)

Plan complementario de `taller-2/plan.md`. Cubre únicamente la internacionalización del sitio. Se ejecuta **entrelazado** con la migración de páginas (ver «Orden de trabajo»), no como una fase posterior: traducir una página ya migrada cuesta el doble que traducirla mientras se migra.

---

## 1. Decisiones (09-ago-2026)

1. **Se implementa traducción real a inglés.** Deja de ser un selector decorativo: cambiar el idioma cambia el texto de la interfaz en toda la aplicación, sin recargar la página.
2. **Se elimina el francés.** El selector del header queda con dos opciones: `ES` y `EN`. Esto se aparta de taller-1, que declaraba ES/EN/FR — es un cambio de contenido de un `select`, no de estructura semántica, y queda registrado aquí como decisión explícita para no revertirlo por error (mismo tratamiento que la excepción del 09-ago-2026 que convirtió los enlaces de idioma/moneda en `select`).
3. **Implementación propia, sin librería de i18n.** Ni `react-i18next` ni `formatjs`. Razones: el taller premia el código propio y la demostración de objetos del lenguaje del lado del cliente; el alcance (2 idiomas, sin plurales complejos ni carga diferida) no justifica una dependencia; y una implementación de ~60 líneas es explicable en la video reunión, una librería no.
4. **Se traduce la interfaz, no los datos sembrados.** Nombres de propiedades, descripciones de alojamientos, comentarios de reseñas y textos de posts del blog se quedan en español en ambos idiomas, igual que hacen las plataformas reales con el contenido que publican los usuarios. Todo lo demás — navegación, títulos, etiquetas de formulario, botones, mensajes de error y de éxito, tablas de los paneles, textos institucionales — sí se traduce. Ver §5 para el detalle y la excepción de las páginas institucionales.

---

## 2. Arquitectura

### 2.1 Archivos

```
src/
├── i18n/
│   ├── index.js         # obtenerTexto(), interpolar(), IDIOMAS, IDIOMA_POR_DEFECTO
│   ├── es.js            # diccionario español (idioma fuente)
│   └── en.js            # diccionario inglés
├── context/
│   └── IdiomaContext.jsx  # IdiomaProvider + useIdioma()
└── hooks/
    └── useTituloPagina.js # document.title traducido por página
```

`IdiomaProvider` envuelve la app en `App.jsx`, por fuera de `BrowserRouter` y junto a `SesionProvider` (Fase 0.1 del plan principal).

### 2.2 Forma del diccionario

Objeto plano anidado un nivel: **espacio de nombres . clave**. El espacio de nombres es el componente o el área compartida.

```js
// src/i18n/es.js
export default {
  comun: {
    guardar: 'Guardar',
    cancelar: 'Cancelar',
    volver: 'Volver',
    cargando: 'Cargando…',
    obligatorio: 'Este campo es obligatorio.',
    correoInvalido: 'Ingresa un correo electrónico válido.'
  },
  header: {
    registrate: 'Regístrate',
    iniciarSesion: 'Iniciar sesión',
    cerrarSesion: 'Cerrar sesión',
    perfil: 'Perfil',
    misReservas: 'Mis reservas',
    inicio: 'Inicio',
    explorar: 'Explorar',
    promociones: 'Promociones',
    blog: 'Blog',
    ayuda: 'Ayuda',
    idioma: 'Idioma',
    moneda: 'Moneda',
    saludo: 'Hola, {nombre}'
  },
  catalogo: {
    titulo: 'Catálogo de alojamientos',
    filtros: 'Filtros',
    aplicar: 'Aplicar filtros',
    sinResultados: 'No se encontraron propiedades con esos filtros.'
  }
  // … un espacio de nombres por página
}
```

`en.js` replica **exactamente** la misma estructura de claves. Una clave que exista en `es.js` y falte en `en.js` es un error que se detecta con el verificador de §6.

### 2.3 API pública

```jsx
const { t, idioma, cambiarIdioma, formatearMoneda, formatearFecha } = useIdioma()

t('header.iniciarSesion')                    // → 'Iniciar sesión' | 'Sign in'
t('header.saludo', { nombre: usuario.nombre })  // interpolación de {nombre}
formatearMoneda(85)                          // → '₡85' / '$85' según idioma + moneda
formatearFecha('2026-08-12')                 // → '12 de agosto de 2026' | 'August 12, 2026'
```

Reglas de `t`:
- Si la clave no existe en el idioma activo, cae al español y **avisa por `console.warn`** (no rompe la interfaz ni muestra la clave cruda al usuario).
- La interpolación reemplaza `{marcador}` con búsqueda simple sobre las claves del objeto de parámetros (`String.replace` con `RegExp`). Nada de `dangerouslySetInnerHTML`.
- Si un texto necesita marcado interno (un enlace en medio de una frase), **no** se mete HTML en el diccionario: se parte en dos o tres claves y se compone en JSX.

### 2.4 Persistencia y efectos secundarios

- La elección se guarda en `localStorage` bajo `staybooker_idioma`, con la misma lógica de prefijo que usa `storage.js`.
- Si hay sesión iniciada, `cambiarIdioma` también escribe `preferencias.idioma` del usuario vía `actualizarUsuario` — la entidad `usuarios` ya tiene ese campo sembrado, hoy sin uso real.
- Al iniciar sesión, el idioma del perfil gana sobre el de `localStorage`.
- `cambiarIdioma` actualiza `document.documentElement.lang` (`'es'` / `'en'`). Es manipulación directa del DOM y suma al rubro correspondiente.
- El `select` de `Perfil.jsx` (campo `idioma`, dentro de «Preferencias de reserva») y el del header deben quedar **sincronizados**: ambos leen y escriben el mismo estado del contexto. Hoy el de Perfil guarda una preferencia que nadie lee.

### 2.5 Formato de fechas, números y moneda

Toda fecha o monto visible pasa por las funciones del contexto, nunca por concatenación manual:

```js
const LOCALES = { es: 'es-CR', en: 'en-US' }

formatearFecha(iso)   // Intl.DateTimeFormat(LOCALES[idioma], { dateStyle: 'long' })
formatearMoneda(monto) // Intl.NumberFormat(LOCALES[idioma], { style: 'currency', currency: moneda })
```

La moneda (`CRC`/`USD`) es una preferencia **independiente** del idioma — el selector de moneda del header ya existe y en el plan principal (Fase 3) queda conectado a `Intl.NumberFormat`. Este plan solo agrega que el *locale* de formateo lo aporta el idioma activo. Un usuario puede ver la interfaz en inglés con precios en colones.

---

## 3. Cambios en componentes ya escritos

- [ ] **`Layout.jsx`** — quitar la opción `FR` del `select` de idioma; conectar el `select` a `cambiarIdioma` (hoy es `defaultValue` sin `onChange`); traducir los 4+5 enlaces del nav, el `h2` de las tres secciones del footer, la etiqueta y el botón del boletín, y el aviso de copyright. Los `aria-label` de los dos `select` también se traducen.
- [ ] **`Index.jsx`** — hero, etiquetas del buscador, títulos de sección, nombres de los tipos de alojamiento, banner de anfitrión, textos de las recomendaciones.
- [ ] **`Catalogo.jsx`** — título, etiquetas de los 6 filtros, `legend` «Filtros» y «Servicios», nombres de los 5 servicios (mover `SERVICIOS` a claves de diccionario, conservando el `valor` en español porque es el dato que se guarda), estados vacío y de carga.
- [ ] **`PropiedadDetalle.jsx`** — los 6 `h3` de sección, cabeceras del calendario (Lun…Dom → Mon…Sun), leyenda «Reservado», etiquetas del formulario de consulta, textos de favoritos.
- [ ] **`InicioSesion.jsx`** — `legend`, etiquetas, los 3 mensajes de error, enlaces de pie.
- [ ] **`Perfil.jsx`** — los 2 `legend`, todas las etiquetas, nombres de los accesos a paneles, y sincronización del `select` de idioma con el contexto.
- [ ] **`TarjetaPropiedad.jsx`** — la línea «Capacidad para N huéspedes · Desde $X por noche · ⭐ Y de 5» y el botón «Ver detalles y reservar». El `alt` de la imagen también se traduce (es texto que leen los lectores de pantalla).
- [ ] **`useDataStore.js` / `useSesion`** — el `document.title` (`StayBooker 360 — Hola, X`) pasa por `t`.
- [ ] **`tiposAlojamiento.js`** — separar `valor` (dato, se queda en español: `'casa'`, `'villa'`…) de `nombre` (etiqueta, pasa al diccionario). El mismo criterio aplica a servicios, estados de reserva y estados de propiedad: **el valor almacenado nunca se traduce, solo su etiqueta visible.**

---

## 4. Trabajo por página

Para cada una de las 38 páginas: al migrarla (o al revisarla, si ya está migrada), no escribir literales en el JSX. Cada literal nace como clave de `es.js` y su par en `en.js`.

Volumen estimado de claves por bloque, para dimensionar:

| Bloque | Páginas | Claves aprox. | Notas |
|---|---|---|---|
| Compartido (`comun`, `header`, `footer`, `formularios`) | — | ~70 | Se escribe primero; lo reutiliza todo lo demás |
| A — Público / institucional | 8 | ~180 | El grueso: `sobre-nosotros`, `politicas-privacidad` y `terminos-uso` son texto corrido largo |
| B — Catálogo, detalle, reserva | 5 | ~90 | |
| C — Autenticación y cuenta | 5 | ~90 | |
| D — Panel anfitrión | 8 | ~110 | Muchas cabeceras de tabla y etiquetas de estado que se repiten |
| E — Panel administrador | 12 | ~160 | Ídem; reutilizar `comun.estados.*` en vez de duplicar |
| **Total** | **38** | **~700** | |

**Excepción de las páginas institucionales.** `sobre-nosotros`, `politicas-privacidad` y `terminos-uso` son varios párrafos por sección. Meterlos como una clave por párrafo infla el diccionario y lo vuelve ilegible. Para esas tres, una clave por bloque de contenido (`institucional.privacidad.cookies.titulo` y `…cookies.texto`, con el texto completo del bloque) es suficiente. La traducción al inglés de ese contenido es traducción de texto propio, no plantilla comercial — no hay conflicto con las reglas de integridad académica del curso.

**Estados y enumeraciones compartidas** — un solo lugar, `comun.estados`:
`pendiente`, `confirmada`, `finalizada`, `cancelada`, `publicada`, `rechazada`, `inactiva`, `activa`, `suspendida`, `pagado`, `reembolsado`, `borrador`, `respondida`. Se traducen una vez y las usan `MisReservas`, `AnfitrionReservas`, `AdminReservas`, `AdminAlojamientos`, `AdminUsuarios`, `AdminPromociones`, `AdminBlog` y `AdminReservaEditar`.

**Mensajes de validación** — también un solo lugar, `comun.validacion.*`, con interpolación donde haga falta (`'La contraseña debe tener al menos {n} caracteres.'`). Las funciones `validarX(valores)` del patrón C3 del plan principal pasan a devolver **claves**, no textos; el componente las traduce al renderizar. Así la validación queda independiente del idioma.

---

## 5. Qué NO se traduce

- Nombres, descripciones e imágenes de las propiedades sembradas.
- Comentarios y autores de las reseñas.
- Títulos y cuerpo de los posts del blog.
- Nombres y correos de los usuarios demo.
- Los valores almacenados en el data store (`'villa'`, `'confirmada'`, `'wifi'`) — solo su etiqueta.
- Los `name` de los campos de formulario (`correo`, `precio_min`, `contacto_telefono`): son contrato con el futuro back-end y están fijados por taller-1.
- Las rutas de React Router (`/catalogo`, `/mis-reservas`): se quedan en español en ambos idiomas. Rutas localizadas duplicarían el enrutador sin ganar un solo punto de rúbrica.

Conviene decirlo en voz alta en la video reunión: es una decisión de alcance razonada, no un olvido.

---

## 6. Verificación

- [ ] **Verificador de paridad de claves.** Script `taller-2/scripts/verificar-i18n.js` que importa ambos diccionarios, los aplana a rutas (`header.saludo`) y reporta: claves en `es` que faltan en `en`, claves en `en` que no existen en `es`, y marcadores de interpolación que no coinciden entre ambos (`{nombre}` presente en uno y no en el otro). Ejecutable con `node` y agregado como script de `package.json` (`npm run i18n:check`).
- [ ] **Cazador de literales sueltos.** Revisión con `grep` sobre `src/pages/` y `src/components/` buscando texto entre `>` y `<` con letras acentuadas o palabras en español, para detectar lo que se quedó sin traducir. No es infalible, pero atrapa la mayoría.
- [ ] Recorrer las 38 vistas en inglés y confirmar: cero texto en español fuera de lo listado en §5, cero claves crudas visibles, cero `console.warn` de clave faltante.
- [ ] Confirmar que **cambiar el idioma no pierde estado**: filtros aplicados en el catálogo, formulario a medio llenar, paso del flujo de reserva.
- [ ] Confirmar que el idioma persiste al recargar y que, con sesión iniciada, se recupera de las preferencias del usuario.
- [ ] Comprobar `document.documentElement.lang` en el inspector, en ambos idiomas.
- [ ] Revisar que el inglés no rompa el diseño: varias etiquetas en inglés son más cortas, pero «Reservas recibidas» → «Received bookings» y algunos botones crecen. Verificar a 375px los botones y las cabeceras de tabla de los paneles.

---

## 7. Orden de trabajo

Encaja así con las fases del plan principal:

1. **Antes de la Fase 0** — nada. La i18n depende de que exista `SesionProvider` (Fase 0.1), porque el idioma se guarda también en las preferencias del usuario.
2. **Al cerrar la Fase 0** — construir `src/i18n/` con los espacios de nombres `comun`, `header`, `footer` y `validacion`, más `IdiomaContext`, y traducir `Layout`. Con eso el selector ya funciona de verdad en las 38 vistas y el avance es visible desde el primer día.
3. **Fase 0.b** — retraducir las 5 páginas ya migradas (`Index`, `Catalogo`, `PropiedadDetalle`, `InicioSesion`, `Perfil`). Es deuda que solo crece.
4. **Fase 2, bloques A-E** — cada página se migra **ya traducida**. Una página no se marca como hecha en `plan.md` si tiene literales en el JSX.
5. **Fase 5 (verificación final)** — ejecutar §6 completo.

---

## 8. Impacto en el documento de Parte 1

- [ ] Agregar una subsección (4.6 o 5.x) sobre internacionalización: decisión de dos idiomas, implementación propia con contexto de React, diccionarios como módulos, `Intl` para fechas y moneda, y persistencia de la preferencia en el perfil del usuario — que es, otra vez, un punto de conexión limpio con el futuro back-end (la preferencia viajaría en el registro del usuario).
- [ ] Corregir toda mención a «ES / EN / FR»: ahora son dos idiomas.
- [ ] El documento hoy hereda de taller-1 la frase de que el multilingüe es «solo estructural». Ya no lo es: reescribirla.

---

## 9. Riesgos

- **El diccionario se desincroniza.** Mitigado por `npm run i18n:check`; correrlo antes de cada cierre de bloque, no solo al final.
- **Traducir al final.** Es el riesgo caro: retraducir 38 páginas ya escritas con literales cuesta mucho más que escribirlas con claves desde el inicio. Por eso la regla del punto 7.4.
- **Sobre-ingeniería.** No hace falta carga diferida de diccionarios, ni detección automática por `navigator.language`, ni plurales con reglas CLDR. Dos objetos importados estáticamente y una función `t` de 15 líneas cubren todo el alcance.
