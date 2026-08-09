# Plan de trabajo — Taller No. 2 (StayBooker 360)

Plan vivo, sin fechas objetivo — el orden de las tareas es el orden lógico recomendado, no un calendario. Se va marcando conforme se avanza y se actualiza cuando cambian decisiones.

**Cómo usar este documento.** Está escrito para que cualquier persona (o modelo) pueda continuar el trabajo sin contexto previo. Antes de tocar código:

1. Leer `CLAUDE.md` en la raíz del repo (reglas del curso, arquitectura CSS, estructura semántica vinculante, regla dura de no tocar `taller-1/`).
2. Leer `taller-2/indicaciones/Taller No.2-3098-2C-2026.md` (enunciado + rúbrica oficial).
3. Leer la sección «Convenciones de implementación» de este plan — define el patrón exacto que debe repetir cada página — y `taller-2/plan-traduccion.md`, que impone que ningún texto visible se escriba literal en el JSX.
4. Para cada página: abrir el HTML original en `taller-1/parte-2/<archivo>.html` y reproducir su árbol semántico en JSX. **El HTML de taller-1 es la fuente de verdad estructural.**

**Orden de trabajo (decisión 06-ago-2026):** se construye primero la Parte 2 (código); la Parte 1 (documento) se redacta/ajusta a partir de lo que efectivamente se implementó. Cuando el código diverja del borrador de Parte 1, gana el código.

---

## 0. Estado actual (09-ago-2026)

**Parte 2 completa: las 38 páginas están migradas, con CSS propio, validación de formularios, sesión, CRUD sobre el data store e interfaz bilingüe ES/EN.**

| Área | Estado |
|---|---|
| Scaffold Vite + React + React Router | ✅ |
| `Layout` con header/nav/footer compartidos | ✅ |
| CSS: 7 archivos base + 11 por página/área | ✅ |
| Data store por entidad (8 entidades) | ✅ |
| Sesión en contexto (`SesionContext`) | ✅ |
| Idioma y moneda en contexto (`IdiomaContext`) | ✅ |
| Páginas migradas | ✅ 38 de 38 |
| Rutas registradas | ✅ 38 + comodín 404 |
| Formularios con validación | ✅ 25 |
| Diccionarios ES/EN | ✅ 631 claves, sincronizadas |
| `npm run build` | ✅ sin errores |

### Conteo de páginas

El repo decía «34 páginas» en varios lugares. **El conteo real de `taller-1/parte-2/` es 38** (12 `admin-*`, 8 `anfitrion-*`, 18 generales/huésped). Corregido en este plan y en `Taller2-Parte1-StayBooker360.md`.

---

## Decisiones de alcance (09-ago-2026)

Tomadas explícitamente por el usuario; no revertir sin pedirlo.

1. **Bloques D y E (anfitrión/admin) con CRUD real sobre localStorage.** Las tablas se pintan desde el data store y los formularios de edición persisten cambios.
2. **Se agregaron al data store todas las entidades faltantes**: `consultas`, `posts`, `incidencias`, más campos nuevos en `propiedades`, `reservas`, `usuarios`, `promociones` y `resenas`.
3. **La sesión vive en `localStorage`** (no `sessionStorage`): sobrevive al cierre del navegador, simulando un «recordarme» permanente. La sección 4.5 del documento de Parte 1 quedó actualizada.
4. **Ruta del flujo de reserva: `/reserva/:propiedadId`**, coherente con `/propiedades/:id`.
5. **Las acciones que en taller-1 eran enlaces con query string** (`?aceptar=201`, «Bloquear reseña», «Reportar») son `<button type="button">` con handler de React. Sin back-end un enlace con query no puede ejecutar nada, y un botón es lo semánticamente correcto para una acción. Desviación menor respecto a taller-1 (cambia la etiqueta, no la jerarquía).
6. **Traducción real a inglés, sin francés.** Plan detallado en `taller-2/plan-traduccion.md`.
7. **El `<div class="footer-contacto">` del footer se eliminó**: `<address>` volvió a ser hijo directo de `<footer>`, sin el `<h2>Contacto</h2>` que taller-1 no tiene. Verificado a 390px, 640px y 1280px: la cuarta columna se alinea con las otras tres gracias a un `padding-top` que compensa el alto del encabezado ausente.

---

## Convenciones de implementación

### C1. Anatomía de un componente de página

Archivo en `src/pages/<NombrePagina>.jsx`, export default, PascalCase derivado del HTML original (`anfitrion-propiedades.html` → `AnfitrionPropiedades.jsx`).

- El `main` lo pone `Layout`; la página **nunca** renderiza `<main>`, `<header>` ni `<footer>`.
- Varias `section` hermanas → `<>…</>`, nunca un `div` envolvente.
- Se preservan `aria-label` / `aria-labelledby`, `fieldset`/`legend`, `figure`/`figcaption`, `<article>` de tarjeta y `<address>`.
- Cambios permitidos: `href="x.html"` → `<Link to="/x">`, `class` → `className`, `for` → `htmlFor`, ids únicos por instancia.
- **Sin `div` de maquetación.** Donde hacía falta una rejilla (galería de propiedad, lista de reseñas) se usa `display: inline-block` sobre los propios `figure`/`article`; para que una tabla ancha no rompa la página se usa `display:block; overflow-x:auto` sobre la propia `<table>`.

### C2. Registro de ruta

En `App.jsx`, dentro de `<Route element={<Layout />}>`. URL = nombre del archivo HTML sin extensión (`/anfitrion-propiedades`). Excepciones: `index.html` → `/`, `propiedad-detalle.html` → `/propiedades/:id`, `blog-post.html` → `/blog/:id`, `reserva.html` → `/reserva/:propiedadId`, y los `*-editar` llevan `/:id`.

### C3. Formularios controlados + validación

Patrón centralizado en `src/hooks/useFormulario.js`. Un formulario típico:

```jsx
const { valores, errores, exito, setExito, manejarEnvio, propsCampo } = useFormulario({
  prefijoId: 'registro',
  valoresIniciales: { nombre: '', correo: '' },
  validarValores: (v) => validar({ nombre: requerido(v.nombre), correo: correoValido(v.correo) }),
  alEnviar: (v, { setExito }) => { /* persistir */ setExito(t('...')) }
})
```

- `propsCampo(nombre)` aporta `id`, `name`, `onChange`, `ref`, `className="campo-invalido"` y `aria-describedby`.
- El `<form>` lleva `noValidate` y conserva los atributos HTML5 (`required`, `type`, `min`, `max`, `maxLength`, `accept`, `pattern`) — el rubro pide usar la mayor cantidad de etiquetas HTML5.
- Los `name` se copian tal cual de taller-1 (`correo`, `clave`, `precio_min`, `contacto_telefono`, …): son contrato con el futuro back-end.
- Al enviar con errores se enfoca el primer campo inválido (`ref.current.focus()`).
- Las funciones de `src/utils/validaciones.js` devuelven **claves de i18n**, no textos: `{ clave, params }`.

### C4. Catálogo de validaciones implementadas

Vacío/espacios, formato de correo, correo repetido, longitud y coincidencia de contraseña, teléfono, numérico con rango, capacidad máxima de la propiedad, coherencia de fechas (salida > entrada, entrada ≥ hoy, vigencia fin > inicio), traslape con reservas existentes, extensión de imagen (`.jpg/.jpeg/.png/.webp`) y de video (`.mp4/.webm`), casilla obligatoria, longitud máxima de texto con contador, y tarjeta de crédito (16 dígitos, CVV 3-4, vencimiento MM/AA vigente).

### C5. Mensajes al usuario

`src/components/MensajeCampo.jsx` exporta `MensajeError` (por campo, enlazado con `aria-describedby`) y `MensajeExito` (`role="status"`, desaparece solo a los 4 s). El saludo de bienvenida aparece en el header (`Hola, {nombre}`), en la confirmación de reserva y en `document.title` vía `useTituloPagina`.

### C6. CSS

Un archivo por página o área en `src/styles/`, importado en `App.jsx`. Selectores descendentes específicos, solo tokens de `variables.css`, mobile-first con breakpoints 640px y 1024px dentro de cada archivo.

### C7. Rutas protegidas por rol

`src/components/RutaProtegida.jsx`: sin sesión redirige a `/inicio-sesion` recordando el destino en `location.state`; con sesión pero sin el rol, a `/perfil`. Se usa en las cinco páginas de cuenta, las ocho `anfitrion-*` y las doce `admin-*`.

---

## Fase 0 — Correcciones de base ✅

- [x] **0.1 `useSesion` compartido.** Movido a `src/context/SesionContext.jsx`; antes cada componente tenía su propio `useState` y el header no se enteraba del inicio de sesión. `useSesion` se reexporta desde `hooks/useDataStore.js` para no romper los imports previos.
- [x] **0.2 Cerrar sesión** en el header (y el saludo del usuario junto a él).
- [x] **0.3 Footer sin `div` de contacto**, con `footer address` como área del grid.
- [x] **0.4 Enlaces internos del footer** convertidos a `<Link>`; los externos llevan `rel="noopener noreferrer"`.
- [x] **0.5 Formulario del boletín** con validación de correo y mensaje de éxito, presente en las 38 vistas.
- [x] **0.6 `onmouseover` / `onmouseout`** en `src/hooks/useEfectoMenu.js`: `useRef` sobre el `<nav>`, `addEventListener` nativo sobre cada enlace, alterna la clase `enlace-activo` y limpia los escuchadores al desmontar.
- [x] **0.7 Ruta comodín 404** (`NoEncontrada.jsx`).
- [x] **0.8 `RutaProtegida`** aplicada a las 25 rutas privadas.
- [ ] **0.9 Fuentes.** `variables.css` declara Poppins e Inter, pero no se cargan: el sitio corre con el respaldo del sistema. Pendiente decidir entre (a) descargar los `.woff2` a `public/fuentes/` y declarar `@font-face` en `base.css`, o (b) quitar ambas del documento de Parte 1 y de las variables. **Es lo único de la Fase 0 que queda abierto.**

Correcciones adicionales encontradas al probar en el navegador:

- [x] Desbordamiento horizontal en móvil: `body` es un grid y su columna crecía con el contenido de las tablas del panel. Resuelto con `grid-template-columns: minmax(0, 1fr)` en `base.css`.
- [x] Header desbordado con sesión iniciada (saludo + 4 enlaces de usuario + 5 de navegación + 2 selectores): `flex-wrap` en `header nav` y selectores compactos.

---

## Fase 1 — Data store ✅

### Entidades

`propiedades`, `reservas`, `usuarios`, `resenas`, `promociones`, **`consultas`**, **`posts`**, **`incidencias`** — un módulo por entidad en `src/utils/dataStore/`, todos re-exportados por `index.js`. Cada función lleva su comentario `// TODO: reemplazar con fetch …`.

### Campos nuevos

- **propiedades**: `anfitrionId`, `estado` (pendiente/publicada/rechazada/inactiva), `motivoRechazo`, `fechasBloqueadas[]`, `promocionId`, `consultasContador`, `politicaCancelacion`, `mascotas`, `fumar`, `horaEntrada`, `horaSalida`, `contactoCorreo`, `contactoTelefono`, `video`. `obtenerPropiedades()` filtra a `publicada` salvo que se pida `{ incluirTodas: true }`.
- **reservas**: `estado` con cuatro valores, `estadoPago`, `monto`, `anfitrionId`, `motivoCancelacion`, `decisionCancelacion`, `decisionReembolso`, `montoReembolso`, `motivoReembolso`. Funciones nuevas: `aceptarReserva`, `rechazarReserva`, `finalizarReserva`, `hayTraslape`.
- **usuarios**: `estado` (activa/suspendida), `obtenerUsuarioPorCorreo`, `eliminarUsuario`, `promoverAAnfitrion`.
- **promociones**: CRUD completo, `vigenciaInicio`, `vigenciaFin`, `estado`, `beneficio`, `propiedadesParticipantes[]`.
- **resenas**: `respuestaAnfitrion`, `fechaRespuesta`, `bloqueada`, `reservaId`, `usuarioId`, `actualizarResena`.

### Semilla

8 propiedades (una pendiente de aprobación y una rechazada, para que la bandeja del admin tenga contenido), 4 usuarios, 10 reservas cubriendo los 4 estados y los 3 estados de pago, 16 reseñas (una bloqueada, una con respuesta del anfitrión), 5 promociones, 3 posts, 4 consultas, 3 incidencias.

**Versionado:** `staybooker_version_datos` (hoy `3`). Si no coincide con la constante del código, se limpia el storage y se vuelve a sembrar. Ojo: limpiar también borra la sesión activa, así que subir la versión cierra la sesión del usuario.

Botón «Reiniciar datos de ejemplo» al pie de `Perfil` para la demostración.

---

## Fase 2 — Migración de las 38 páginas ✅

### Bloque A — Público / institucional (8)

- [x] `index.html` → `Index.jsx` → `/` → `inicio.css`. Buscador con validación de fechas antes de navegar al catálogo.
- [x] `sobre-nosotros.html` → `SobreNosotros.jsx` → `/sobre-nosotros` → `institucional.css`.
- [x] `politicas-privacidad.html` → `PoliticasPrivacidad.jsx` → `/politicas-privacidad`.
- [x] `terminos-uso.html` → `TerminosUso.jsx` → `/terminos-uso`.
- [x] `ayuda.html` → `Ayuda.jsx` → `/ayuda`. FAQ con `<details>`/`<summary>` nativos + formulario de contacto validado con contador de caracteres.
- [x] `blog.html` → `Blog.jsx` → `/blog`. Listado desde `posts` filtrando `publicado`.
- [x] `blog-post.html` → `BlogPost.jsx` → `/blog/:id`.
- [x] `promociones.html` → `Promociones.jsx` → `/promociones`. Vigencias con `<time>` y enlace al catálogo filtrado por promoción.

### Bloque B — Catálogo, detalle y reserva (5)

- [x] `catalogo.html` → `Catalogo.jsx` → `/catalogo` → `catalogo.css`. Filtros sincronizados con la query string; solo lista propiedades publicadas.
- [x] `propiedad-detalle.html` → `PropiedadDetalle.jsx` → `/propiedades/:id` → `propiedad.css`. Galería, `<video>`, condiciones de uso, política de cancelación, calendario que distingue días reservados de días bloqueados por el anfitrión, reseñas ordenables, favoritos persistidos y formulario de consulta que **crea una consulta real** para el panel del anfitrión. Cada visita incrementa `consultasContador`, insumo del reporte de alojamientos más consultados.
- [x] `reserva.html` → `Reserva.jsx` → `/reserva/:propiedadId` → `reserva.css`. Valida fechas, capacidad, traslape con reservas existentes y los cuatro campos de tarjeta; pasa los datos a la vista siguiente con `location.state`.
- [x] `reserva-resumen.html` → `ReservaResumen.jsx` → `/reserva-resumen`. Calcula noches, total y descuento de promoción; «Modificar» devuelve al formulario con los valores cargados; «Confirmar» crea la reserva.
- [x] `reserva-confirmacion.html` → `ReservaConfirmacion.jsx` → `/reserva-confirmacion`. Comprobante con número `SB360-000000` y saludo al usuario.

### Bloque C — Autenticación y cuenta (5)

- [x] `registro.html` → `Registro.jsx` → `/registro` → `cuenta.css`. Valida correo repetido, contraseña de 8+, coincidencia y aceptación de términos; inicia sesión automáticamente.
- [x] `inicio-sesion.html` → `InicioSesion.jsx` → `/inicio-sesion`. Distingue credenciales inválidas de cuenta suspendida, vuelve al destino que el usuario intentaba abrir, y muestra las credenciales de demostración.
- [x] `perfil.html` → `Perfil.jsx` → `/perfil` → `perfil.css`. Datos personales, preferencias (el selector de idioma y el de moneda ahora sí afectan a toda la aplicación), favoritos y accesos a los paneles según rol.
- [x] `mis-reservas.html` → `MisReservas.jsx` → `/mis-reservas`. Próximas e historial, cancelación con confirmación en la propia página (sin `window.confirm`) y formulario de reseña para las estancias finalizadas.
- [x] `publicar-propiedad.html` → `PublicarPropiedad.jsx` → `/publicar-propiedad` → `propiedad-formulario.css`. Contenido institucional + `FormularioPropiedad` (los tres `fieldset` compartidos con la edición). Al publicar, la propiedad nace `pendiente` y la cuenta pasa de huésped a anfitrión.

### Bloque D — Panel de anfitrión (8)

Todas con `RutaProtegida roles={['anfitrion','administrador']}` y CSS compartido `panel.css`.

- [x] `anfitrion-panel` — resumen calculado en vivo (propiedades, reservas, consultas sin responder, valoración promedio) + accesos.
- [x] `anfitrion-propiedades` — tarjetas con estado, motivo de rechazo y enlaces a detalle, edición y reseñas.
- [x] `anfitrion-propiedad-editar/:id` — `FormularioPropiedad` precargado + promoción + estado (editable solo si ya fue aprobada) + calendario y bloqueo/habilitación de rangos de fechas.
- [x] `anfitrion-reservas` — solicitudes pendientes (aceptar/rechazar), confirmadas (marcar finalizada) e historial.
- [x] `anfitrion-consultas` — tabla con estado y enlace a responder.
- [x] `anfitrion-consulta-responder/:id` — detalle en lectura + respuesta que cambia el estado a respondida.
- [x] `anfitrion-propiedad-resenas/:id` — tabla de reseñas con responder y reportar (crea una incidencia).
- [x] `anfitrion-resena-responder/:id` — detalle + respuesta guardada en la reseña.

### Bloque E — Panel de administración (12)

Todas con `RutaProtegida roles={['administrador']}`.

- [x] `admin-panel` — cinco contadores globales + seis accesos.
- [x] `admin-usuarios` / `admin-usuario-editar/:id` — datos, tipo de cuenta (informativo), estado, restablecer contraseña, eliminar cuenta con confirmación, e incidencias.
- [x] `admin-alojamientos` / `admin-alojamiento-editar/:id` — bandeja de aprobación; decisión aprobar/rechazar con motivo obligatorio al rechazar, moderación de reseñas (bloquear/habilitar, lo bloqueado desaparece del sitio público) e incidencias.
- [x] `admin-reservas` / `admin-reserva-editar/:id` — filtro por anfitrión; estado de pago, validación de cancelación, validación de reembolso (monto acotado al de la reserva) e incidencias. El monto de la reserva es informativo, no editable.
- [x] `admin-promociones` / `admin-promocion-editar/:id` — datos con validación de vigencia + tabla de propiedades participantes.
- [x] `admin-blog` / `admin-blog-post-editar/:id` — un párrafo por línea; lo que se publique aparece en `/blog`.
- [x] `admin-reportes` — cinco reportes **calculados desde el data store** (alojamientos más consultados, reservas del período, comportamiento de usuarios, tendencias por tipo, incidencias) y botón que llama `window.print()`.

Componentes reutilizables creados: `TarjetaPropiedad`, `FormularioPropiedad`, `SeccionIncidencias`, `EtiquetaEstado`, `MensajeError`/`MensajeExito`, `RutaProtegida`.

---

## Fase 3 — Interactividad transversal ✅

- [x] Validación en los 25 formularios (C3/C4).
- [x] Mensajes de error por campo y de éxito con desaparición automática.
- [x] Hover/active en navegación y botones, más la clase `enlace-activo` de los escuchadores nativos.
- [x] Foco al primer campo inválido al enviar.
- [x] Confirmación en la propia página para acciones destructivas (cancelar reserva, eliminar cuenta), sin `window.confirm`.
- [x] Objetos nativos usados y explicables en la video reunión: `Date` (noches, estados), `Intl.NumberFormat` (moneda CRC/USD), `Intl.DateTimeFormat` (fechas y nombres de meses y días del calendario), `Array` (`filter`/`map`/`reduce`/`sort` en filtros y reportes), `RegExp` (validaciones e interpolación de textos), `FormData` y `URLSearchParams`, `localStorage`, `window.print`, `classList`, `document.title`, `document.documentElement.lang`.
- [x] Selector de moneda conectado: cambia los precios en toda la aplicación y se guarda en las preferencias del usuario.

## Fase 4 — Responsividad ✅

- [x] Verificado a 390px, 485px, 640px, 1121px y 1280px.
- [x] Header apilado → fila con wrap; footer 1 → 2 → 4 columnas; `aside` de filtros; galería y calendario; tablas de panel con desplazamiento propio en pantallas angostas.
- [x] Sin desplazamiento horizontal de la página en ningún ancho probado.

## Fase 5 — Verificación ✅

- [x] `npm run build` sin errores (111 módulos).
- [x] `npm run i18n:check`: 631 claves en cada diccionario, sincronizadas.
- [x] Sin `<a href="/…">` internos: toda la navegación interna usa `Link`/`NavLink`.
- [x] Sin consola con errores en las vistas probadas.
- [x] Flujos probados en el navegador: inicio de sesión con los tres roles, cambio de idioma ES↔EN en caliente, panel de administración con datos reales, ficha de propiedad completa, y reserva de punta a punta (formulario → resumen → confirmación → aparece en «Mis reservas»).
- [ ] Recorrido manual de las 38 vistas en ambos idiomas antes de la entrega (queda como repaso final; las vistas representativas de cada bloque ya se revisaron).

---

## Parte 1 — Documento de propuesta

Estado: **BORRADOR ACTUALIZADO** (`taller-2/Taller2-Parte1-StayBooker360.md`), sincronizado con el código el 09-ago-2026.

- [x] Conteo de páginas corregido a 38.
- [x] Sección 3.1 con la lista real de hojas de estilo.
- [x] Sección 4.5 con `localStorage` y el contexto de sesión real.
- [x] Fragmento de `Layout` reemplazado por el código real.
- [x] Sección 5 con el inventario por bloques A–E.
- [x] Sección 4.2 con el catálogo completo de validaciones.
- [x] JSON de ejemplo de `propiedad` con los campos reales.
- [x] Sección nueva sobre rutas protegidas por rol.
- [x] Sección nueva sobre internacionalización.
- [ ] Completar portada: grupo, cédula, centro universitario.
- [ ] Resolver el punto 0.9 (fuentes) y ajustar la sección 3.2 en consecuencia.
- [ ] Congelar y exportar a PDF.

---

## Mapa rúbrica → dónde se cumple

| Rubro (Parte 2) | Dónde se demuestra | Estado |
|---|---|---|
| Presenta la página principal | `Index.jsx` + `inicio.css` | ✅ |
| Separa las hojas de estilo | 18 archivos en `src/styles/` | ✅ |
| Capa de presentación para todas las páginas | 38 de 38 | ✅ |
| Estilos para objetos de formularios | `formularios.css` | ✅ |
| Estilos para mensajes al usuario | `.mensaje-error` / `.mensaje-exito` / `.confirmacion` | ✅ |
| Formularios validados del lado del cliente | 25 formularios | ✅ |
| Manipulación de objetos del DOM | `useEfectoMenu` (mouseover/mouseout nativos), `focus()`, `classList`, `document.title`, `documentElement.lang` | ✅ |
| Objetos del lenguaje del lado del cliente | `Date`, `Intl.*`, `RegExp`, `Array`, `FormData`, `URLSearchParams`, `localStorage`, `window.print` | ✅ |
| Desarrolla la funcionalidad de las páginas | Data store, CRUD en ambos paneles, flujo de reserva, sesión, i18n | ✅ |

---

## Pendientes / dudas abiertas ❗️

- ❗️ **Fuentes Poppins/Inter** (punto 0.9): decidir si se descargan a `public/fuentes/` o se quitan de la propuesta.
- ❗️ **Video de recorrido.** El marcado `<video>` está implementado en `PropiedadDetalle`, pero ninguna propiedad sembrada trae video: apuntaba a `/videos/recorrido-villa.mp4`, un archivo que no existe, y el reproductor se veía vacío. Para reactivarlo basta con dejar un `.mp4` en `taller-2/public/videos/` y volver a poner el campo `video` en la semilla.
- ❗️ **Archivos subidos en formularios.** Sin back-end no hay dónde guardarlos: de las imágenes y videos elegidos solo se registra el nombre del archivo, y la ficha cae a una imagen de ejemplo si no había ninguna. Es el punto exacto donde entraría la subida real.
- ❗️ **Reseñas y descripciones de propiedades no se traducen** (contenido de usuario). Decisión documentada en `plan-traduccion.md` §5; conviene decirlo en voz alta en la video reunión.
- ~~¿React satisface «manipulación de objetos del DOM»?~~ Cubierto con `addEventListener` nativo, `focus()`, `classList`, `document.title` y `documentElement.lang`. Confirmar con la profesora.
- ~~Ruta del flujo de reserva~~ / ~~enlaces convertidos en botones~~ / ~~idioma ES/EN/FR~~ — resueltos (decisiones 4, 5 y 6).
