# Plan de trabajo — Taller No. 2 (StayBooker 360)

Plan vivo, sin fechas objetivo — el orden de las tareas es el orden lógico recomendado, no un calendario. Se va marcando conforme se avanza y se actualiza cuando cambian decisiones.

**Cómo usar este documento.** Está escrito para que cualquier persona (o modelo) pueda continuar el trabajo sin contexto previo. Antes de tocar código:

1. Leer `CLAUDE.md` en la raíz del repo (reglas del curso, arquitectura CSS, estructura semántica vinculante, regla dura de no tocar `taller-1/`).
2. Leer `taller-2/indicaciones/Taller No.2-3098-2C-2026.md` (enunciado + rúbrica oficial).
3. Leer la sección «Convenciones de implementación» de este plan — define el patrón exacto que debe repetir cada página — y `taller-2/plan-traduccion.md`, que impone que ningún texto visible se escriba literal en el JSX.
4. Para cada página a migrar: abrir el HTML original en `taller-1/parte-2/<archivo>.html` y reproducir su árbol semántico en JSX. **El HTML de taller-1 es la fuente de verdad estructural; este plan solo agrega el qué hacer encima.**

**Orden de trabajo (decisión 06-ago-2026):** se construye primero la Parte 2 (código); la Parte 1 (documento) se redacta/ajusta a partir de lo que efectivamente se implementó, no al revés. Cuando el código diverja del borrador de Parte 1, gana el código y el borrador se actualiza.

---

## 0. Estado actual (verificado 09-ago-2026)

### Hecho

| Área | Estado |
|---|---|
| Scaffold Vite + React + React Router en `taller-2/` | ✅ |
| `Layout.jsx` con header/nav/footer compartidos | ✅ (con 3 desviaciones a corregir, ver Fase 0) |
| CSS base: `variables.css`, `base.css`, `layout.css`, `header.css`, `footer.css`, `formularios.css`, `componentes.css` | ✅ |
| CSS por página: `inicio.css`, `catalogo.css`, `propiedad.css` | ✅ |
| Data store dividido por entidad (`propiedades`, `reservas`, `usuarios`, `resenas`, `promociones`, `semilla`, `storage`) | ✅ parcial (faltan entidades, ver Fase 1) |
| `useDataStore(entidad)` + `useSesion()` | ✅ (`useSesion` tiene un defecto de estado compartido, ver Fase 0) |
| Semilla: 8 propiedades, 3 usuarios, 9 reservas, 16 reseñas, 4 promociones | ✅ |
| Páginas migradas: `Index`, `Catalogo`, `PropiedadDetalle`, `InicioSesion`, `Perfil` | ✅ 5 de 38 |

### Rutas registradas hoy en `App.jsx`

`/`, `/catalogo`, `/propiedades/:id`, `/inicio-sesion`, `/perfil`. **Todo lo demás es un enlace roto**: el `Layout` ya enlaza `/registro`, `/mis-reservas`, `/promociones`, `/blog`, `/ayuda`, `/politicas-privacidad`, `/terminos-uso`, `/sobre-nosotros`; `Perfil` enlaza `/anfitrion-panel` y `/admin-panel`; `Index` enlaza `/publicar-propiedad`; `PropiedadDetalle` enlaza `/reserva?id=X`. Ninguna de esas rutas existe todavía — hoy renderizan un `main` vacío sin aviso.

### Corrección de conteo

El repo dice en varios lugares «34 páginas». **El conteo real de `taller-1/parte-2/` es 38 páginas HTML** (12 `admin-*`, 8 `anfitrion-*`, 18 generales/huésped). Hay que corregir el número en `taller-2/Taller2-Parte1-StayBooker360.md` (aparece 5 veces) y en `CLAUDE.md`. Se usa **38** en todo este plan.

---

## Decisiones de alcance (09-ago-2026)

Tomadas explícitamente por el usuario; no revertir sin pedirlo.

1. **Bloques D y E (anfitrión/admin) se implementan con CRUD real sobre localStorage.** Las tablas se pintan desde el data store y los formularios de edición persisten cambios (aprobar propiedad, cambiar estado de reserva, editar post, etc.). Es lo que sostiene el rubro «Desarrolla la funcionalidad de las páginas» y el discurso de «prototipo listo para back-end».
2. **Se agregan al data store todas las entidades faltantes**: `consultas`, `posts` (blog), `incidencias`, más campos nuevos en `propiedades` y `reservas`. Detalle en Fase 1.
3. **La sesión se queda en `localStorage`** (el código actual gana). Hay que corregir la sección 4.5 del documento de Parte 1, que hoy dice `sessionStorage`, y justificar la elección: la sesión sobrevive al cierre del navegador, simulando un «recordarme» persistente; el punto de conexión con el back-end (reemplazar por token/cookie) no cambia.
4. **Ruta del flujo de reserva: `/reserva/:propiedadId`**, no `/reserva?id=X`. Coherente con `/propiedades/:id`. Hay que actualizar el enlace de `PropiedadDetalle.jsx:209`.
5. **Las acciones que en taller-1 eran enlaces con query string** (`anfitrion-reservas.html?aceptar=201`, «Bloquear reseña», «Reportar») pasan a `<button type="button">` con handler de React. Sin back-end un enlace con query no puede ejecutar nada, y un botón es lo semánticamente correcto para una acción. Desviación menor respecto a taller-1 (cambia la etiqueta, no la jerarquía), registrada aquí igual que la excepción de los `select` de idioma/moneda.
6. **Traducción real a inglés, y se elimina el francés.** El selector de idioma deja de ser decorativo. Plan detallado aparte: **`taller-2/plan-traduccion.md`** — leerlo antes de escribir cualquier página, porque cambia la regla de escritura de todo el JSX (nada de literales en los componentes; todo texto visible nace como clave de diccionario). El selector de moneda sí se conecta a `Intl.NumberFormat` como estaba previsto en la Fase 3.
7. **El `<div className="footer-seccion footer-contacto">` del footer se elimina**: `<address>` vuelve a ser hijo directo de `<footer>`, como en taller-1, y también se elimina el `<h2>Contacto</h2>` que taller-1 no tiene. Condición del usuario: **debe seguir viéndose igual** — el estilo se reescribe con selector `footer address` y `grid-area: contacto`, verificando visualmente las 3 anchuras antes de dar por buena la corrección.

---

## Convenciones de implementación (obligatorias)

Cualquier página nueva debe seguir estos patrones. Existen ya en el código; usarlos como referencia literal.

### C1. Anatomía de un componente de página

Archivo en `src/pages/<NombrePagina>.jsx`, export default, nombre en PascalCase derivado del HTML original (`anfitrion-propiedades.html` → `AnfitrionPropiedades.jsx`).

```jsx
import { useState } from 'react'
import { useDataStore } from '../hooks/useDataStore'

export default function NombrePagina() {
  const { datos, cargando } = useDataStore('entidad')

  return (
    <section aria-labelledby="algo-heading">
      <h2 id="algo-heading">Título tal cual el de taller-1</h2>
      {/* mismo árbol semántico que taller-1/parte-2/archivo.html */}
    </section>
  )
}
```

Reglas:
- El `main` lo pone `Layout`; la página **nunca** renderiza `<main>`, `<header>` ni `<footer>`.
- Si el HTML original tiene varias `section` hermanas dentro de `main`, la página devuelve un `<>…</>` con esas secciones — no se envuelve en un `div`.
- Se preservan todos los `aria-label` / `aria-labelledby`, los `fieldset`/`legend`, los `figure`/`figcaption`, los `<article>` de tarjeta y los `<address>`.
- Cambios permitidos: `href="x.html"` → `<Link to="/x">`, `id` duplicados si el componente se repite, `class` → `className`, `for` → `htmlFor`.

### C2. Registro de ruta

En `App.jsx`, dentro de `<Route element={<Layout />}>`. Convención de URL: **igual al nombre del archivo HTML sin extensión, con guiones** (`/anfitrion-propiedades`, `/admin-usuario-editar`). Excepciones ya establecidas: `index.html` → `/`, `propiedad-detalle.html` → `/propiedades/:id`. Para los `*-editar`, el id va como parámetro de ruta: `/admin-usuario-editar/:id`, `/anfitrion-propiedad-editar/:id`, etc.

### C3. Formularios controlados + validación

Patrón canónico ya implementado en `src/pages/InicioSesion.jsx` (leerlo antes de escribir cualquier formulario). Resumen:

- Estado `valores` (objeto) + estado `errores` (objeto) + un `useRef` por campo validable.
- Los `name` de los inputs **se copian tal cual de taller-1** (`correo`, `clave`, `precio_min`, `contacto_telefono`, …). No renombrar: la consistencia con el futuro modelo de datos es un argumento del documento de Parte 1.
- El `<form>` lleva `noValidate` y `onSubmit={manejarEnvio}`; la validación nativa HTML5 (`required`, `type="email"`, `min`, `max`, `pattern`, `accept`) se mantiene igualmente en los atributos porque el rubro pide «utilizar la mayor cantidad de etiquetas HTML5».
- `manejarEnvio` hace `evento.preventDefault()`, calcula errores con una función pura `validarX(valores)` definida arriba del componente, y si hay errores enfoca el primer campo fallido con `ref.current?.focus()` y retorna.
- Campo con error: `className="campo-invalido"` + `aria-describedby` apuntando al `<p className="mensaje-error">` con id `<campo>-error`.
- Éxito: `<p className="mensaje-exito">` (clase ya definida en `formularios.css`).

### C4. Catálogo de validaciones a aplicar

Cada formulario toma de esta lista lo que le aplique:

| Validación | Dónde aplica |
|---|---|
| Campo vacío / solo espacios (`.trim()`) | Todos los campos obligatorios |
| Formato de correo (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) | `correo`, `contacto_correo`, boletín del footer |
| Longitud mínima de contraseña (8) y coincidencia `clave` = `clave_confirmar` | `registro`, restablecer contraseña en `admin-usuario-editar` |
| Teléfono: solo dígitos, espacios, `+` y `-`, mínimo 8 dígitos | `registro`, `perfil`, `publicar-propiedad`, `admin-usuario-editar` |
| Numérico con rango (`capacidad` ≥ 1, `precioNoche` > 0, `huespedes` ≥ 1 y ≤ capacidad de la propiedad) | `reserva`, `publicar-propiedad`, `anfitrion-propiedad-editar`, filtros |
| Coherencia de fechas: `salida` > `entrada`, `entrada` ≥ hoy, `vigencia_fin` > `vigencia_inicio` | `reserva`, buscador de `Index`, `admin-promocion-editar`, bloqueo de fechas |
| Disponibilidad: rango pedido no traslapa reservas existentes de esa propiedad | `reserva` |
| Extensión de archivo: solo `.jpg`, `.jpeg`, `.png`, `.webp` (validar `input.files` + atributo `accept`) | `imagenes` en `publicar-propiedad`, `anfitrion-propiedad-editar`, `admin-blog-post-editar` |
| Extensión de video: solo `.mp4`, `.webm` | `video` en `publicar-propiedad`, `anfitrion-propiedad-editar` |
| Checkbox obligatorio | `terminos` en `registro` |
| Longitud máxima de texto largo (500 chars) + contador visible | `descripcion`, `mensaje`, `respuesta`, `comentario` |
| Tarjeta: `pago_numero` 16 dígitos, `pago_cvv` 3-4 dígitos, `pago_vencimiento` `MM/AA` no vencida | `reserva` |

### C5. Mensajes al usuario

Tres tipos, todos del lado del cliente:
- **Error por campo**: `<p className="mensaje-error">` bajo el campo.
- **Éxito de operación**: `<p className="mensaje-exito">` al inicio del formulario o de la sección, con `role="status"` para lectores de pantalla.
- **Saludo de bienvenida**: en `Layout` o en la página de destino tras login, tomado de `usuario.nombre` (`Hola, {nombre}`), más `document.title` dinámico que ya hace `useSesion`.

Los mensajes de éxito deben desaparecer solos (`setTimeout` de 4 s dentro de un `useEffect` con limpieza) — así se cubre «Establece los estilos para los mensajes de información dirigidos al usuario» con algo visible en la demo.

### C6. CSS

- Un archivo por página con estilos propios, en `src/styles/<pagina>.css`, importado en `App.jsx` (ver la lista de imports actual).
- Nada de estilos de página en `layout.css`.
- Componentes usados en 2+ páginas → `componentes.css`.
- Selectores descendentes específicos (`header nav a`, `footer address p`), nunca selectores globales de etiqueta para algo contextual.
- Mobile-first, breakpoints 640px y 1024px, media queries dentro del propio archivo.
- Solo variables de `variables.css` para color/espaciado/radio/transición; si hace falta un token nuevo, se agrega ahí, no se escribe el valor suelto.

### C7. Rutas protegidas por rol

Componente nuevo `src/components/RutaProtegida.jsx`:

```jsx
export default function RutaProtegida({ roles, children }) {
  const { usuario } = useSesion()
  if (!usuario) return <Navigate to="/inicio-sesion" replace />
  if (roles && !roles.includes(usuario.rol)) return <Navigate to="/perfil" replace />
  return children
}
```

Se usa para envolver las páginas `anfitrion-*` (`roles={['anfitrion','administrador']}`), las `admin-*` (`roles={['administrador']}`) y las de cuenta (`mis-reservas`, `perfil`, `publicar-propiedad`: solo sesión iniciada). `Perfil.jsx` ya hace la redirección a mano; migrarlo a este componente.

---

## Fase 0 — Correcciones de base (bloqueante, hacer primero)

Estos defectos afectan a todas las páginas siguientes; arreglarlos antes de migrar nada más.

- [ ] **0.1 `useSesion` no comparte estado entre componentes.** Hoy cada llamada a `useSesion()` crea su propio `useState`, así que al iniciar sesión en `InicioSesion` el `Layout` (ya montado) no se entera y el header sigue mostrando «Regístrate / Iniciar sesión». Solución: crear `src/context/SesionContext.jsx` con un `SesionProvider` que envuelva el `BrowserRouter` en `App.jsx`, mover ahí la lógica actual de `useSesion` y dejar `useSesion()` como `useContext(SesionContext)`. Firma pública idéntica (`usuario`, `iniciarSesion`, `cerrarSesion`, `actualizarPerfil`, `estaAutenticado`) para no tocar los consumidores. Esto además es lo que el documento de Parte 1 ya afirma («expuestas a toda la aplicación con un contexto de React»).
- [ ] **0.2 Falta `cerrarSesion` en la interfaz.** Agregar en `Layout` (dentro del primer `ul` del nav, como `<li><button type="button">Cerrar sesión</button></li>` cuando hay sesión) y/o en `Perfil`. Sin esto no se puede demostrar el ciclo de sesión en la video reunión.
- [ ] **0.3 Footer: quitar el `div` y el `h2` de contacto.** `<address>` pasa a ser hijo directo de `<footer>` (ver decisión 4). Ajustar `footer.css`: la regla de `grid-area` pasa a `footer address`, y las propiedades de `.footer-seccion` que necesite el bloque se replican en ese selector. Verificar a 375px, 640px y 1024px que se ve igual que antes.
- [ ] **0.4 Enlaces del footer usan `<a href>`.** Cambiar a `<Link to="…">` los internos (`/politicas-privacidad`, `/terminos-uso`, `/ayuda`, `/sobre-nosotros`); los de redes sociales siguen siendo `<a href>` externos (agregarles `rel="noopener noreferrer"`).
- [ ] **0.5 Formulario del boletín sin comportamiento.** Darle `onSubmit` con validación de correo y `mensaje-exito` («Te suscribiste con el correo X»). Es el formulario que aparece en las 38 vistas: es la demo más barata del rubro de mensajes al cliente.
- [ ] **0.6 Efecto `onmouseover` / `onmouseout` del menú.** El enunciado lo pide **por nombre**. Implementar el hook `useEfectoMenu(refNav)` que ya está escrito en el documento de Parte 1 (sección 4.3): `useRef` sobre el `<nav>` del header, `addEventListener('mouseover'|'mouseout')` sobre cada `<a>`, alternando la clase `enlace-activo`, con limpieza en el retorno del `useEffect`. Colocarlo en `src/hooks/useEfectoMenu.js` y usarlo en `Layout`. Complementa (no sustituye) el `:hover` de CSS.
- [ ] **0.7 Ruta comodín 404.** `<Route path="*" element={<NoEncontrada />} />` con `src/pages/NoEncontrada.jsx` (h2, explicación, `Link` a `/`). Evita el `main` en blanco de hoy.
- [ ] **0.8 `RutaProtegida`** según C7, y migrar `Perfil.jsx` a usarla.
- [ ] **0.9 Fuentes.** `variables.css` declara Poppins e Inter pero no se cargan en ninguna parte; hoy el sitio cae al fallback `system-ui`. Decidir: descargar los `.woff2` a `public/fuentes/` y declarar `@font-face` en `base.css` (preferible: sin dependencia de red, y el documento de Parte 1 afirma que se usan), o quitar las fuentes del documento. **No** enlazar Google Fonts si se quiere evitar dependencia externa en la demo.

---

## Fase 1 — Ampliación del data store

Todo módulo nuevo sigue el patrón de los existentes: import de `leer`/`guardar` desde `./storage`, funciones con comentario `// TODO: reemplazar con fetch …`, y export desde `index.js`.

### 1.1 Entidades nuevas

- [ ] **`src/utils/dataStore/consultas.js`** — `obtenerConsultas({ anfitrionId, propiedadId, estado })`, `obtenerConsulta(id)`, `crearConsulta(datos)`, `responderConsulta(id, respuesta)`.
  Forma: `{ id, propiedadId, anfitrionId, huespedNombre, huespedCorreo, asunto, mensaje, fecha, estado: 'pendiente'|'respondida', respuesta, fechaRespuesta }`.
  Consumidores: `PropiedadDetalle` (formulario de consulta, hoy solo UI), `AnfitrionConsultas`, `AnfitrionConsultaResponder`.
- [ ] **`src/utils/dataStore/posts.js`** — `obtenerPosts({ estado })`, `obtenerPost(id)`, `crearPost`, `actualizarPost`, `eliminarPost`.
  Forma: `{ id, titulo, autor, fechaPublicacion, imagen, extracto, contenido, estado: 'publicado'|'borrador' }`.
  Consumidores: `Blog`, `BlogPost`, `AdminBlog`, `AdminBlogPostEditar`.
- [ ] **`src/utils/dataStore/incidencias.js`** — `obtenerIncidencias({ entidad, entidadId })`, `crearIncidencia(datos)`.
  Forma: `{ id, entidad: 'usuario'|'alojamiento'|'reserva', entidadId, tipo, descripcion, fecha }`.
  Consumidores: los tres `admin-*-editar` (sección «Reportar incidencia») y `AdminReportes` (tipo de reporte «incidencias registradas»).

### 1.2 Campos nuevos en entidades existentes

- [ ] **`propiedades`**: `anfitrionId` (hoy solo lo tiene la propiedad 2 — poblar todas), `estado: 'pendiente'|'publicada'|'rechazada'|'inactiva'` (ciclo definido en `taller-1/analisis-parte2-taller1.md` §7), `motivoRechazo`, `fechasBloqueadas: ['2026-08-20', …]`, `promocionId`, y los campos del formulario completo que hoy no están: `politicaCancelacion`, `mascotas`, `fumar`, `horaEntrada`, `horaSalida`, `contactoCorreo`, `contactoTelefono`, `video`, `consultasContador` (para el reporte de «alojamientos más consultados»).
  `obtenerPropiedades()` debe filtrar por defecto a `estado === 'publicada'` para el catálogo público, con opción `{ incluirTodas: true }` para los paneles.
- [ ] **`reservas`**: `estado` amplía a `'pendiente'|'confirmada'|'finalizada'|'cancelada'`, más `estadoPago: 'pendiente'|'pagado'|'reembolsado'`, `monto`, `motivoCancelacion`, `decisionCancelacion`, `decisionReembolso`, `montoReembolso`, `motivoReembolso`, `anfitrionId`.
  Funciones nuevas: `aceptarReserva(id)`, `rechazarReserva(id)`, `finalizarReserva(id)`, `hayTraslape(propiedadId, entrada, salida)`.
- [ ] **`usuarios`**: `estado: 'activa'|'suspendida'`; `favoritos` ya existe.
- [ ] **`promociones`**: `vigenciaInicio`, `vigenciaFin`, `estado: 'activa'|'inactiva'|'finalizada'`, `beneficio`, `propiedadesParticipantes: [ids]`. Agregar `crearPromocion`, `actualizarPromocion`, `eliminarPromocion` (hoy el módulo es solo de lectura).
- [ ] **`resenas`**: `respuestaAnfitrion`, `fechaRespuesta`, `bloqueada: boolean`, `reservaId`, `usuarioId`. Agregar `actualizarResena(id, datos)`.

### 1.3 Semilla

- [ ] Ampliar `semilla.js` con los campos nuevos y sembrar: 3-4 consultas (2 pendientes), 3 posts de blog (con los títulos reales de `blog.html`), 2 incidencias, reservas en los 4 estados y con los 3 estados de pago, al menos una propiedad `pendiente` y una `rechazada` para que la bandeja de aprobación de admin tenga qué mostrar.
- [ ] **Versionar la semilla.** Como `sembrarSiVacio` no reescribe datos ya guardados, quien ya abrió el sitio no verá los campos nuevos. Agregar una clave `staybooker_version_datos`; si no coincide con la constante del código, llamar `limpiarTodo()` y resembrar. Sin esto la migración va a dar bugs fantasma.
- [ ] Botón/enlace de «Reiniciar datos de ejemplo» en algún lugar discreto (pie de `Perfil` o `AdminPanel`) que llame `limpiarTodo()` + `inicializarDatosEjemplo()` — útil para la demo en la video reunión.

### 1.4 `useDataStore`

- [ ] Agregar los `case` de las entidades nuevas (`consultas`, `consulta`, `posts`, `post`, `incidencias`, `promocion`) en `cargar`, `crear`, `actualizar` y `eliminar`.
- [ ] Corregir la heurística de recarga en `crear`: hoy hace `if (entidad.endsWith('a') || entidad === 'usuario')`, que es frágil (`resena` recarga, `post` no). Reemplazar por una recarga incondicional tras crear.

---

## Fase 2 — Migración de páginas por bloques

38 páginas; 5 hechas, 33 pendientes. Cada línea indica: **archivo fuente → componente → ruta → CSS → datos → interactividad**. Marcar la casilla solo cuando la página se vea bien en los 3 anchos y sus formularios validen.

### Bloque A — Público / institucional (8 páginas, 1 hecha)

- [x] `index.html` → `Index.jsx` → `/` → `inicio.css`. Hecho 09-ago-2026 (hero + buscador, destacados, tipos de alojamiento, banner anfitrión, recomendaciones).
  - Pendiente menor: el buscador debe validar fechas (`salida` > `entrada`, `entrada` ≥ hoy) antes de navegar a `/catalogo?…`.
- [ ] `sobre-nosotros.html` → `SobreNosotros.jsx` → `/sobre-nosotros` → `institucional.css` (compartido con las 3 siguientes). Contenido estático: `h3` Quiénes somos / Misión / Visión / Nuestra historia / Cobertura. Sin datos, sin formulario.
- [ ] `politicas-privacidad.html` → `PoliticasPrivacidad.jsx` → `/politicas-privacidad` → `institucional.css`. 6 `h3`, contenido estático.
- [ ] `terminos-uso.html` → `TerminosUso.jsx` → `/terminos-uso` → `institucional.css`. 9 `h3`, contenido estático.
- [ ] `ayuda.html` → `Ayuda.jsx` → `/ayuda` → `ayuda.css`. FAQ + políticas + formulario de contacto (`legend` «Escríbenos», campos `nombre`, `correo`, `asunto`, `mensaje`). Validar: los 4 obligatorios, formato de correo, `mensaje` máx. 500 con contador. Éxito: `mensaje-exito` + limpiar el formulario. FAQ como `<details>`/`<summary>` **solo si taller-1 ya los usa** — verificar el HTML antes; si usa `dl`/`dt`/`dd`, se respeta eso.
- [ ] `blog.html` → `Blog.jsx` → `/blog` → `blog.css`. Listado desde `useDataStore('posts')` filtrando `estado === 'publicado'`; cada artículo es un `<article>` con `figure`/`figcaption` y `Link` a `/blog/:id`.
- [ ] `blog-post.html` → `BlogPost.jsx` → `/blog/:id` → `blog.css`. Post individual vía `useParams`; si el id no existe, mensaje + `Link` a `/blog`.
- [ ] `promociones.html` → `Promociones.jsx` → `/promociones` → `promociones.css`. 5 promociones desde `useDataStore('promociones')`, filtrando `estado === 'activa'`; mostrar vigencia con `<time>`; enlace a `/catalogo` filtrado por las propiedades participantes.

### Bloque B — Catálogo, detalle y reserva (5 páginas, 2 hechas)

- [x] `catalogo.html` → `Catalogo.jsx` → `/catalogo` → `catalogo.css`. Hecho 09-ago-2026 (filtros sincronizados con la query string).
  - Pendientes menores: filtrar solo propiedades `publicada` una vez exista el campo `estado`; validar que `precio_min` ≤ `precio_max` antes de aplicar.
- [x] `propiedad-detalle.html` → `PropiedadDetalle.jsx` → `/propiedades/:id` → `propiedad.css`. Hecho 09-ago-2026 (galería, calendario de disponibilidad, reseñas, favoritos persistidos, formulario de consulta solo-UI).
  - Pendientes: conectar el formulario de consulta a `crearConsulta` (Fase 1.1); incrementar `consultasContador` de la propiedad al enviar; incluir el `<video>` de recorrido que taller-1 tiene y verificar que sobrevivió a la migración.
- [ ] `reserva.html` → `Reserva.jsx` → `/reserva/:propiedadId` (**actualizar el enlace de `PropiedadDetalle.jsx:209`, que hoy apunta a `/reserva?id=${propiedad.id}`**) → `reserva.css`. Dos `fieldset`: «Detalles de la estadía» (`entrada`, `salida`, `huespedes`) y «Método de pago» (`pago_nombre`, `pago_numero`, `pago_vencimiento`, `pago_cvv`). Validaciones: todas las de fechas y tarjeta de C4, más `huespedes` ≤ capacidad y no traslape con reservas existentes (`hayTraslape`). Al validar OK: `navigate('/reserva-resumen', { state: { … } })` — **el paso de datos entre vistas con `location.state` es un punto explícito del documento de Parte 1, usarlo aquí**.
- [ ] `reserva-resumen.html` → `ReservaResumen.jsx` → `/reserva-resumen` → `reserva.css`. Lee `location.state`; si no hay state (entrada directa a la URL), redirige a `/catalogo`. Muestra propiedad, fechas, noches, huéspedes y total calculado (`noches × precioNoche`, con descuento si hay promoción aplicable). Botones «Modificar» (vuelve a `/reserva` con el state) y «Confirmar reserva» → llama `crearReserva({ …, estado: 'pendiente', estadoPago: 'pendiente' })` y navega a `/reserva-confirmacion` con el id creado.
- [ ] `reserva-confirmacion.html` → `ReservaConfirmacion.jsx` → `/reserva-confirmacion` → `reserva.css`. Comprobante desde el id recibido; `mensaje-exito` con el saludo del usuario en sesión; `Link` a `/mis-reservas`.

### Bloque C — Autenticación y cuenta (5 páginas, 2 hechas)

- [ ] `registro.html` → `Registro.jsx` → `/registro` → `cuenta.css`. `fieldset` «Datos de la cuenta»: `nombre`, `correo`, `telefono`, `clave`, `clave_confirmar`, `terminos`. Validaciones: obligatorios, correo, teléfono, clave ≥ 8 y coincidencia, `terminos` marcado, **correo no repetido** (consultar `obtenerUsuarios()`). Al éxito: `crearUsuario` → `iniciarSesion` automático → `navigate('/perfil')` con `mensaje-exito`.
- [x] `inicio-sesion.html` → `InicioSesion.jsx` → `/inicio-sesion` → (usa `formularios.css`). Hecho. Es la referencia del patrón C3.
  - Pendiente menor: mostrar las credenciales de demo (`huesped@ejemplo.com` / `123`, etc.) en un `<aside>` o `<p>` — necesario para la video reunión, y hoy no hay forma de saberlas desde la interfaz.
- [x] `perfil.html` → `Perfil.jsx` → `/perfil` → falta `perfil.css` (sus estilos hoy no tienen archivo propio; crear uno y mover ahí lo que aplique). Hecho 09-ago-2026 (información básica, preferencias, favoritos, accesos a paneles).
  - Pendientes: migrar la redirección manual a `RutaProtegida`; validar teléfono y correo al guardar; `mensaje-exito` al guardar preferencias.
- [ ] `mis-reservas.html` → `MisReservas.jsx` → `/mis-reservas` → `cuenta.css`. Reservas del usuario en sesión (`obtenerReservas({ usuarioId })`), agrupadas por estado, cada una `<article>` con `<time>`. Acciones: «Cancelar reserva» (`cancelarReserva`, con confirmación y solo si el estado lo permite) y, para las finalizadas, el `fieldset` «Dejar reseña de esta estancia» (`calificacion` 1-5, `comentario`) → `crearResena({ propiedadId, reservaId, usuarioId, … })`; una vez enviada, el formulario se sustituye por la reseña ya publicada.
- [ ] `publicar-propiedad.html` → `PublicarPropiedad.jsx` → `/publicar-propiedad` → `propiedad-formulario.css` (compartido con `AnfitrionPropiedadEditar`). Contenido institucional (`h3` Beneficios / Requisitos / Proceso) + el formulario completo de propiedad: `fieldset` «Datos generales» (`nombre`, `tipo`, `ubicacion`, `capacidad`, `descripcion`), «Servicios y políticas» (`servicios[]`, `mascotas`, `fumar`, `hora_entrada`, `hora_salida`, `politica_cancelacion`), «Contacto y multimedia» (`contacto_correo`, `contacto_telefono`, `imagenes`, `video`). Validaciones: todas las de C4 que apliquen, incluidas extensiones de archivo. Al éxito: `crearPropiedad({ …, estado: 'pendiente', anfitrionId: usuario.id })`, promover al usuario a rol `anfitrion` si era `huesped` (modelo de cuenta única, `analisis-parte2-taller1.md` §7), y navegar a `/anfitrion-propiedades` con mensaje de «pendiente de aprobación».
  - **Extraer el formulario a `src/components/FormularioPropiedad.jsx`** con props `{ valores, onSubmit, modoEdicion }` para que `AnfitrionPropiedadEditar` lo reutilice sin duplicar 3 `fieldset`.

### Bloque D — Panel anfitrión (8 páginas, 0 hechas)

Todas envueltas en `RutaProtegida roles={['anfitrion','administrador']}`. Filtran por `anfitrionId === usuario.id`. CSS compartido `panel.css` (tablas, tarjetas de panel, botones de acción) + `anfitrion.css` para lo específico.

- [ ] `anfitrion-panel.html` → `AnfitrionPanel.jsx` → `/anfitrion-panel`. Dos `section`: «Resumen» (contadores calculados en vivo: nº propiedades, reservas pendientes, consultas sin responder, valoración promedio) y «Accesos» (`Link` a las 3 pantallas).
- [ ] `anfitrion-propiedades.html` → `AnfitrionPropiedades.jsx` → `/anfitrion-propiedades`. Un `<article>` por propiedad con `h3` = nombre, estado y enlaces «Editar» → `/anfitrion-propiedad-editar/:id` y «Ver reseñas» → `/anfitrion-propiedad-resenas/:id` (este último solo si la propiedad tiene reseñas).
- [ ] `anfitrion-propiedad-editar.html` → `AnfitrionPropiedadEditar.jsx` → `/anfitrion-propiedad-editar/:id`. Reutiliza `FormularioPropiedad` precargado, más tres bloques propios: `fieldset` «Participación en promociones» (`promocion`), `fieldset` «Estado de la propiedad» (Publicada/Inactiva editables; Pendiente/Rechazada informativos), y la sección de disponibilidad: `select` de mes/año + tabla-calendario (`th` Lun…Dom) + `fieldset` «Bloquear o habilitar fechas» (`fecha_inicio`, `fecha_fin`, `accion`) que escribe en `propiedad.fechasBloqueadas`. El calendario debe pintar tanto fechas reservadas como bloqueadas, con marcas distintas.
- [ ] `anfitrion-reservas.html` → `AnfitrionReservas.jsx` → `/anfitrion-reservas`. Tres `section`: «Solicitudes pendientes» (acciones Aceptar/Rechazar → `aceptarReserva`/`rechazarReserva`), «Reservas confirmadas» (acción «Marcar como finalizada» → `finalizarReserva`), «Historial» (solo lectura). En taller-1 las acciones son `<a href="?aceptar=201">`; en React pasan a `<button type="button">` con handler — es un cambio de atributo, no de estructura, pero **anotar la desviación** en este plan cuando se haga.
- [ ] `anfitrion-consultas.html` → `AnfitrionConsultas.jsx` → `/anfitrion-consultas`. Tabla: Asunto / Propiedad / Huésped / Fecha / Estado / Acciones, con enlace «Responder» → `/anfitrion-consulta-responder/:id`.
- [ ] `anfitrion-consulta-responder.html` → `AnfitrionConsultaResponder.jsx` → `/anfitrion-consulta-responder/:id`. `h3` «Detalle de la consulta» (lectura) + `fieldset` «Tu respuesta» (`respuesta`, obligatorio, máx. 500). Al enviar: `responderConsulta` → estado `respondida` → `mensaje-exito` → volver a la lista.
- [ ] `anfitrion-propiedad-resenas.html` → `AnfitrionPropiedadResenas.jsx` → `/anfitrion-propiedad-resenas/:id`. `h2` «Reseñas — {nombre propiedad}» + tabla Huésped / Reseña / Valoración / Acciones («Responder» → `/anfitrion-resena-responder/:id`, «Reportar»).
- [ ] `anfitrion-resena-responder.html` → `AnfitrionResenaResponder.jsx` → `/anfitrion-resena-responder/:id`. Detalle + `fieldset` «Tu respuesta» → `actualizarResena(id, { respuestaAnfitrion, fechaRespuesta })`.

### Bloque E — Panel administrador (12 páginas, 0 hechas)

Todas envueltas en `RutaProtegida roles={['administrador']}`. CSS compartido `panel.css` + `admin.css`.

- [ ] `admin-panel.html` → `AdminPanel.jsx` → `/admin-panel`. `section` «Resumen» (contadores globales: usuarios, alojamientos por estado, reservas, incidencias abiertas) + `section` «Accesos» (6 enlaces).
- [ ] `admin-usuarios.html` → `AdminUsuarios.jsx` → `/admin-usuarios`. Tabla Nombre / Correo / Tipo de cuenta / Estado / Acciones («Editar» → `/admin-usuario-editar/:id`). El «tipo de cuenta» se deriva del rol: `huesped` → «Huésped»; `anfitrion` → «Huésped y anfitrión».
- [ ] `admin-usuario-editar.html` → `AdminUsuarioEditar.jsx` → `/admin-usuario-editar/:id`. Seis `fieldset`: «Datos de la cuenta» (`nombre`, `correo`, `telefono` — editables), «Tipo de cuenta» (informativo), «Estado de la cuenta» (`estado` Activa/Suspendida → `actualizarUsuario`), «Restablecer contraseña» (clave nueva + confirmación, validación de 8 caracteres), «Eliminar cuenta» (formulario aparte con confirmación explícita), «Nueva incidencia» (`tipo_incidencia`, `descripcion` → `crearIncidencia`) + tabla de incidencias de esa cuenta (Fecha / Tipo / Descripción).
- [ ] `admin-alojamientos.html` → `AdminAlojamientos.jsx` → `/admin-alojamientos`. Tabla Propiedad / Anfitrión / Tipo / Estado / Acciones. Es la bandeja de aprobación: usar `obtenerPropiedades({ incluirTodas: true })`.
- [ ] `admin-alojamiento-editar.html` → `AdminAlojamientoEditar.jsx` → `/admin-alojamiento-editar/:id`. `h3` «Datos de la propiedad» (lectura) + `fieldset` «Decisión» (`decision` aprobar/rechazar + `motivo` obligatorio si rechaza → `actualizarPropiedad({ estado, motivoRechazo })`) + tabla de reseñas con `select` de `orden` (valoración / recientes / antiguas, ordenamiento real en cliente) y acción «Bloquear reseña» (`actualizarResena(id, { bloqueada: true })`; las bloqueadas dejan de aparecer en `PropiedadDetalle`) + `fieldset` «Nueva incidencia» + tabla de incidencias.
- [ ] `admin-reservas.html` → `AdminReservas.jsx` → `/admin-reservas`. Tabla Propiedad / Anfitrión / Huésped / Fechas / Estado de reserva / Estado de pago / Acciones, más el formulario de filtro por `anfitrion` (filtrado real sobre los datos).
- [ ] `admin-reserva-editar.html` → `AdminReservaEditar.jsx` → `/admin-reserva-editar/:id`. `h3` «Datos de la reserva» (lectura, monto **no editable** — decisión explícita de taller-1) + `fieldset` «Estado de pago» (`estado_pago`) + sección «Validar cancelación» (`decision_cancelacion`, `motivo_cancelacion`) + sección «Validar reembolso» (`decision_reembolso`, `monto_reembolso` ≤ monto de la reserva, `motivo_reembolso`) + `fieldset` «Nueva incidencia» + tabla de incidencias. Todo persiste vía `actualizarReserva`.
- [ ] `admin-promociones.html` → `AdminPromociones.jsx` → `/admin-promociones`. Tabla Título / Vigencia desde / Vigencia hasta / Estado / Acciones.
- [ ] `admin-promocion-editar.html` → `AdminPromocionEditar.jsx` → `/admin-promocion-editar/:id`. `fieldset` «Datos de la promoción» (`titulo`, `descripcion`, `beneficio`, `vigencia_inicio`, `vigencia_fin`, `estado`) con validación de fechas coherentes + tabla de propiedades participantes (Propiedad / Anfitrión).
- [ ] `admin-blog.html` → `AdminBlog.jsx` → `/admin-blog`. Tabla Título / Autor / Fecha de publicación / Estado / Acciones.
- [ ] `admin-blog-post-editar.html` → `AdminBlogPostEditar.jsx` → `/admin-blog-post-editar/:id`. `fieldset` «Datos del post» (`titulo`, `autor`, `fecha_publicacion`, `imagen`, `contenido`, `estado`), validación de extensión de imagen y de contenido no vacío. Persiste con `actualizarPost`; lo que se publique debe aparecer en `/blog`.
- [ ] `admin-reportes.html` → `AdminReportes.jsx` → `/admin-reportes`. Formulario de filtro por `tipo` de reporte (alojamientos más consultados / reservas del período / comportamiento de usuarios / tendencias / incidencias registradas) + tabla con el resultado **calculado desde el data store** (no quemado): p. ej. «alojamientos más consultados» ordena por `consultasContador`; «incidencias registradas» lista `obtenerIncidencias()`. El botón «Imprimir reporte», que en taller-1 no hacía nada por falta de JS, ahora sí puede llamar `window.print()` — es una demostración barata de «objetos del lenguaje del lado del cliente».

---

## Fase 3 — Interactividad transversal

- [ ] Validación en todos los formularios según C3/C4. Inventario de formularios a cubrir: boletín (footer, en las 38 vistas), buscador de Index, filtros de Catálogo, consulta de PropiedadDetalle, reserva (2 fieldset), registro, inicio de sesión, perfil (2 fieldset), reseña en Mis reservas, contacto de Ayuda, propiedad (3 fieldset ×2 páginas), disponibilidad, respuesta a consulta, respuesta a reseña, y los 12 formularios del panel admin. **Total ≈ 25 formularios.**
- [ ] Mensajes de éxito/error consistentes (C5) con desaparición automática.
- [ ] Efectos hover/active en navegación y botones — ya en CSS; verificar en contexto real y que conviven con el `enlace-activo` de `useEfectoMenu`.
- [ ] Focus management: foco al primer campo inválido al enviar (ya en `InicioSesion`, replicar).
- [ ] Confirmación antes de acciones destructivas (cancelar reserva, eliminar cuenta, eliminar propiedad): estado local que muestra un bloque «¿Seguro?» con dos botones. **No usar `window.confirm`** — se ve fuera de lugar y no se puede estilizar.
- [ ] Objetos nativos del lenguaje que conviene usar y luego mencionar en la video reunión (rubro «Utiliza objetos del lenguaje del lado del cliente»): `Date` (cálculo de noches y estados de reserva), `Intl.NumberFormat` (formato de moneda CRC/USD según la preferencia del usuario), `Intl.DateTimeFormat` (fechas en español), `Array` (`filter`/`map`/`reduce`/`sort` en filtros y reportes), `RegExp` (validaciones), `FormData` y `URLSearchParams` (ya usados en `Catalogo`), `localStorage` (data store y sesión), `window.print`.
- [ ] Selector de **moneda** del header: conectarlo a `Intl.NumberFormat` para que los precios cambien en toda la app, guardando la elección en las preferencias del usuario. El *locale* de formateo lo aporta el idioma activo; moneda e idioma son preferencias independientes.
- [ ] Selector de **idioma**: traducción real ES/EN — trabajo completo en `plan-traduccion.md`. Regla que afecta a todas las fases: **ninguna página se marca como hecha si tiene literales de texto en el JSX**; todo texto visible sale del diccionario.

## Fase 4 — Responsividad

- [ ] Verificar los dos breakpoints (640px, 1024px) en cada página migrada.
- [ ] Anchos de prueba obligatorios: 375px (móvil), 640px (tableta), 1024px y 1440px (escritorio).
- [ ] Puntos críticos: header (apilado → fila), footer (1 → 2 → 4 columnas), `aside` de filtros del catálogo (arriba → columna lateral), **tablas de los paneles admin/anfitrión** — necesitan `overflow-x: auto` en un contenedor o cambio de disposición en móvil; es lo que más fácil rompe el ancho de página.
- [ ] Galería de `PropiedadDetalle` y calendario de disponibilidad en 375px.

## Fase 5 — Verificación final

- [ ] Las 38 rutas navegan desde el menú o desde enlaces internos, sin URL escritas a mano.
- [ ] Ningún `<a href>` interno sobreviviente (busca `href="/` en `src/`): todo enlace interno es `Link`/`NavLink`.
- [ ] Los 25 formularios validan y muestran mensajes.
- [ ] Sesión: login → header cambia → navegación entre vistas conserva la sesión → logout la borra. Probar con los 3 usuarios demo (huésped, anfitrión, administrador) y comprobar que cada rol ve solo sus paneles.
- [ ] Estructura semántica preservada: comparar el DOM renderizado contra el HTML de taller-1 página por página (inspector del navegador). Sin `div` de maquetación nuevos, sin `table` usada para maquetar (las tablas de datos sí son legítimas y vienen de taller-1).
- [ ] `npm run build` sin errores ni warnings de React (revisar consola: keys duplicadas, `useEffect` en loop).
- [ ] Revisar la consola del navegador en las 38 vistas: cero errores.
- [ ] Contraste de color accesible en los pares texto/fondo de `variables.css`.
- [ ] Verificación de traducción completa: `npm run i18n:check` sin faltantes y recorrido de las 38 vistas en inglés (checklist §6 de `plan-traduccion.md`).

---

## Parte 1 — Documento de propuesta

Estado: **BORRADOR VIVO** (`taller-2/Taller2-Parte1-StayBooker360.md`). Se congela cuando Parte 2 esté completa.

Correcciones **ya identificadas** que hay que aplicar antes de congelar (el borrador describe cosas que el código no hace, o al revés):

- [ ] **«34 páginas» → «38 páginas»** (aparece 5 veces: secciones 1, 2.1, 2.1 párrafo 2, 3.1, 4.1 y 6).
- [ ] **Sección 3.1 — lista de hojas de estilo obsoleta.** Menciona `componentes/header-nav.css`, `componentes/formularios.css`, `componentes/botones.css`, `componentes/tarjetas.css` y `responsive.css`, ninguno de los cuales existe. La estructura real es plana en `src/styles/`: `variables`, `base`, `layout`, `header`, `footer`, `formularios`, `componentes` + un archivo por página. Reescribir con la lista real y explicar la decisión (media queries dentro de cada archivo, no en uno transversal).
- [ ] **Sección 4.5 — sesión.** Dice `sessionStorage`; el código usa `localStorage` y así se queda (decisión 3). Actualizar el fragmento de código y el texto, y agregar la justificación de por qué persiste entre sesiones del navegador.
- [ ] **Sección 2.1 — el fragmento de `Layout`** está simplificado y no coincide con el real (le faltan el segundo `ul` de usuario, los dos `select`, el footer completo). Reemplazarlo por el código real ya escrito.
- [ ] **Sección 3.2 — tipografía.** Solo es cierta si se resuelve el punto 0.9 (las fuentes hoy no se cargan). Ajustar el texto a lo que efectivamente quede.
- [ ] **Sección 5 — bloques migrables**: reescribir con el inventario real de 38 páginas por bloque A-E y su estado.
- [ ] **Sección 4.2** debería listar el catálogo de validaciones de C4 de este plan (es más completo que el actual y coincide con lo implementado).
- [ ] **Sección 5 — forma de los datos**: actualizar el JSON de ejemplo de `propiedad` con los campos reales tras la Fase 1.2 (`estado`, `anfitrionId`, `imagenes[]`, `fechasBloqueadas`, …).
- [ ] Agregar una sección sobre **rutas protegidas por rol** (`RutaProtegida`) — es exactamente el tipo de preparación para back-end que pide el rubro 4 de Parte 1, y hoy no se menciona.
- [ ] **Internacionalización**: agregar la subsección descrita en §8 de `plan-traduccion.md` y corregir toda mención a «ES / EN / FR» y a que el multilingüe es «solo estructural» — ya no lo es.
- [ ] Completar portada: profesora, grupo, cédula, centro universitario.
- [ ] Congelar y exportar a PDF cuando Parte 2 esté completa.

---

## Mapa rúbrica → dónde se cumple

Tabla de control para la entrega y para la video reunión. Cada rubro de Parte 2 vale 5 pts.

| Rubro (Parte 2) | Dónde se demuestra | Estado |
|---|---|---|
| Presenta la página principal | `Index.jsx` + `inicio.css` | ✅ |
| Separa las hojas de estilo | 7 archivos base + 1 por página en `src/styles/`, importados en `App.jsx` | ✅ |
| Capa de presentación para **todas** las páginas | Bloques A-E, 38 páginas | 5/38 |
| Estilos para objetos de formularios | `formularios.css` (campos, focus, `campo-invalido`, variantes de botón) | ✅ |
| Estilos para mensajes al usuario | `.mensaje-error` / `.mensaje-exito` (C5) | parcial — falta uso sistemático |
| Formularios validados del lado del cliente | C3/C4, ≈25 formularios | 2/25 |
| Manipulación de objetos del DOM | `useEfectoMenu` (`addEventListener` mouseover/mouseout), `focus()` en campo inválido, `classList` de estado, `document.title` | pendiente (0.6) |
| Objetos del lenguaje del lado del cliente | `Date`, `Intl.*`, `RegExp`, `Array`, `FormData`, `URLSearchParams`, `localStorage`, `window.print` (Fase 3) | parcial |
| Desarrolla la funcionalidad de las páginas | Data store + CRUD real en paneles + flujo de reserva + sesión | parcial |

Requisitos del enunciado que son fáciles de perder de vista: **`onmouseover`/`onmouseout` mencionados por nombre** (0.6), **saludo de bienvenida** (C5), **validación de extensiones de archivo** (C4), **paso de información de una página a otra por código cliente** (`location.state` en el flujo de reserva), **sesión activa con función y variables** (`SesionContext`).

---

## Pendientes / dudas abiertas ❗️

- ~~¿React satisface el rubro «Realiza manipulación de objetos del DOM»?~~ Resuelto (06-ago-2026): se mantiene React y se agrega manipulación directa vía `addEventListener`, `focus()` y `document.title`. Confirmar con la profesora en la video reunión.
- ~~Estructura de carpetas~~ Resuelto (06-ago-2026): proyecto Vite en la raíz de `taller-2/`.
- ~~Ruta del flujo de reserva~~ Resuelto (09-ago-2026): `/reserva/:propiedadId` (decisión 4).
- ~~Enlaces con query string convertidos en botones~~ Resuelto (09-ago-2026): se usan `<button type="button">` (decisión 5).
- ~~Idioma ES/EN/FR~~ Resuelto (09-ago-2026): traducción real ES/EN, sin francés (decisión 6). Ver `plan-traduccion.md`.
- (Agregar aquí las ambigüedades que surjan durante la migración, siguiendo el patrón de `taller-1/analisis-parte2-taller1.md`: describir la duda, decidir con fecha, marcar ❗️ hasta confirmar.)
