# Plan de trabajo — Taller No. 2 (StayBooker 360)

Plan vivo, sin fechas objetivo — el orden de las tareas es el orden lógico recomendado, no un calendario. Se va marcando conforme se avanza y se actualiza cuando cambian decisiones. Ver `CLAUDE.md` (raíz del repo) para las reglas generales del curso, y `taller-2/Taller2-Parte1-StayBooker360.md` para el borrador actual de Parte 1.

**Orden de trabajo (decisión 06-ago-2026):** se construye primero la Parte 2 (código); la Parte 1 (documento) se redacta/ajusta a partir de lo que efectivamente se implementó, no al revés. El borrador actual de Parte 1 es un punto de partida, no la fuente de verdad — cuando el código diverja de lo que dice el borrador, gana el código y el borrador se actualiza para reflejarlo.

---

## Parte 2 — Sitio funcional

### 0. Scaffold del proyecto

- [x] Crear proyecto Vite + React + React Router en `taller-2/`.
- [x] Estructura de hojas de estilo: `variables.css`, `base.css`, `layout.css`, `header.css`, `footer.css`, `formularios.css` (en `src/styles/`, sin subdir).
- [x] Componente `Layout` compartido (header + nav + footer + `Outlet`) con estructura semántica de Taller 1.
- [x] Configurar rutas base de React Router (parcial: rutas stub para Index, Catalogo; falta migración de 32 páginas restantes).

### 1. Sesión y paso de datos

- [x] Implementar `useDataStore` hook para acceso reactivo a datos (localStorage, TODO API).
- [x] Implementar `useSesion` hook (sessionStorage + localStorage con clave 'staybooker_usuario').
- [x] Inicializar datos de ejemplo con `inicializarDatosEjemplo()` en App.jsx.
- [x] Confirmar que cubre: persistencia de sesión entre vistas, `document.title` dinámico, manejo de login/logout.
- Nota: completado 06-ago-2026. Backend listo para reemplazar localStorage por API según TODO en dataStore.js.

### 2. CSS base (afecta a todo el sitio)

- [x] `variables.css` — paleta, tipografía, espaciado, radios, transiciones (definidas 06-ago-2026).
- [x] `base.css` — reset ligero y tipografía base.
- [x] `layout.css` — Grid 3 áreas (header/main/footer), body como grid-container con grid-template-areas.
- [x] `header.css` — header + nav con selectores descendentes (`header nav`, `header nav ul`, `header nav a`); h1-h6 centralizados; legend para formularios.
- [x] `footer.css` — 4 columnas Grid en desktop, 2 en tablet, 1 móvil; `.footer-seccion` clase base (flex), específicas (`footer-compania`, `footer-redes`, `footer-boletin`, `footer-contacto`) solo definen grid-area.
- [x] `formularios.css` — campo flex, inputs/selects/textareas, variantes de botón (primario/secundario/peligro/éxito).
- **Decisión (06-ago-2026):** descendant selectors + base classes pattern (ej. `.footer-seccion` + `.footer-compania`). No responsive.css separado — media queries inline en cada archivo. Breakpoints 640px (tablet) y 1024px (desktop), mobile-first.
- **Decisión (09-ago-2026):** CSS por página además de los 6 archivos base — `componentes.css` (componentes reutilizables en 2+ páginas, ej. `.tarjeta-propiedad`) + un archivo por página con estilos propios (`inicio.css`, `catalogo.css`, `propiedad.css`, ...). Evita que `layout.css` se vuelva cajón de sastre conforme se migran más bloques. Detalle en `CLAUDE.md` sección "Arquitectura CSS".

### 2b. Arquitectura de datos (abstraction layer, listo para reemplazar con API)

- [x] `src/utils/dataStore.js` — funciones para propiedades, reservas, usuarios, reseñas, promociones. Todas usan localStorage hoy, TODO comments indican reemplazo por API en Parte 2.
- [x] `src/hooks/useDataStore.js` — hook reactivo que expone { datos, cargando, error, cargar, crear, actualizar, eliminar }. Abstracto respecto a dónde vienen los datos.
- [x] Sesión en `useSesion()` hook: sessionStorage + localStorage ('staybooker_usuario'), actualiza `document.title`, accesible vía Context si se necesita.
- **Notas**: estructura permite migración limpia a backend — cambiar localStorage por fetch() en dataStore.js, no tocar hooks ni componentes. Datos de ejemplo llenan localStorage en `App.jsx` mount.

### 3. Migración por bloques funcionales

Cada bloque: migrar HTML semántico de taller-1 → JSX, aplicar/refinar CSS, integrar sesión y validación. Revisar y probar cada bloque contra taller-1 antes de pasar al siguiente. Estructura de archivos: `src/pages/` para rutas de primer nivel, `src/components/` para reutilizables.

- [ ] **Bloque A — Público / institucional**: `index`, `sobre-nosotros`, `ayuda`, `politicas-privacidad`, `terminos-uso`, `blog`, `blog-post`, `promociones`.
  - Status: `Index.jsx` migrado (hero+buscador, destacados con cards, tipos de alojamiento, banner anfitrión, recomendaciones) — 09-ago-2026. Resto de páginas del bloque siguen como stubs/pendientes.
- [ ] **Bloque B — Catálogo, detalle y reserva**: `catalogo`, `propiedad-detalle`, `reserva`, `reserva-resumen`, `reserva-confirmacion`.
  - Status: `Catalogo.jsx` y `PropiedadDetalle.jsx` migrados (ruta `/propiedades/:id` registrada) — 09-ago-2026. `PropiedadDetalle` incluye galería (`propiedad.imagenes[]`, nuevo campo — antes era `imagen` singular), calendario de disponibilidad calculado contra `reservas` (sembradas para propiedad id 1), reseñas (`resenas.js`, ahora con datos de ejemplo sembrados), favoritos con persistencia real vía `actualizarUsuario`, y form de consulta (solo UI, sin entidad "consultas" en el data store). Falta `reserva`, `reserva-resumen`, `reserva-confirmacion` — el botón "Reservar esta propiedad" apunta a `/reserva?id=X`, ruta aún no registrada.
- [ ] **Bloque C — Autenticación y cuenta**: `registro`, `inicio-sesion`, `perfil`, `mis-reservas`, `publicar-propiedad`.
- [ ] **Bloque D — Panel anfitrión**: `anfitrion-panel`, `anfitrion-propiedades`, `anfitrion-propiedad-editar`, `anfitrion-reservas`, `anfitrion-consultas`, `anfitrion-consulta-responder`, `anfitrion-propiedad-resenas`, `anfitrion-resena-responder`.
- [ ] **Bloque E — Panel administrador**: `admin-panel`, `admin-usuarios`, `admin-usuario-editar`, `admin-alojamientos`, `admin-alojamiento-editar`, `admin-reservas`, `admin-reserva-editar`, `admin-promociones`, `admin-promocion-editar`, `admin-blog`, `admin-blog-post-editar`, `admin-reportes`.

### 4. Interactividad transversal

- [ ] Validación de formularios (cliente, antes de persistir): campos vacíos, formato de correo, longitud de contraseña, fechas, archivos.
- [ ] Mensajes de éxito/error en cada formulario (`.mensaje-error`, `.mensaje-exito` con animación de aparición/desaparición).
- [ ] Efectos hover/active en navegación y botones (ya presentes en CSS, probar en contexto real).
- [ ] Focus management: foco a campo con error al submitear un formulario inválido.

### 5. Responsividad

- [ ] Verificar los dos breakpoints (640px, 1024px) en cada página ya migrada: header apilado→fila, footer 1→2→4 columnas, formularios adaptan ancho.
- [ ] Probar en navegadores: mobile (375px), tablet (640px), desktop (1024px+).
- [ ] Ajustar media queries según necesidad mientras se migran bloques.

### 6. Verificación final

- [ ] Probar las 34 rutas navegables desde menú/enlaces internos (sin hardcoding de URLs en componentes, todo vía React Router).
- [ ] Validación de cada formulario: campos requeridos, formato, rango, tipo de dato.
- [ ] Sesión persiste entre vistas en misma pestaña; logout borra sesión.
- [ ] HTML semántico preservado de taller-1 (sin `div` o `table` de maquetación, estructura `<header>/<nav>/<main>/<footer>` intacta, roles ARIA donde corresponda).

---

## Parte 1 — Documento de propuesta (se redacta a partir de la Parte 2 ya construida)

Estado: **BORRADOR VIVO** (`taller-2/Taller2-Parte1-StayBooker360.md`). Se actualiza conforme avanza Parte 2; se congela cuando Parte 2 esté completa.

- [x] Sección 2 — Stack: Vite + React + React Router + localStorage (TODO: API).
- [x] Sección 3 — CSS: 6 archivos, descendant selectors, base classes, Grid/Flexbox, 640px/1024px breakpoints. Actualizado 06-ago-2026.
- [x] Sección 4 — Sesión: `useSesion` hook, sessionStorage, document.title dinámico. Completado 06-ago-2026.
- [ ] Sección 5 — Bloques migrables: actualizar conforme se complete cada bloque funcional (A-E).
- [ ] **Antes de congelar:** completar portada (profesor, grupo, cédula, centro), revisar paleta/tipografía/espaciado contra variables.css, contrastar estructura de Layout contra taller-1/parte-2 HTML real.
- [ ] **Congelar y exportar** a PDF/DOCX cuando Parte 2 esté 100% completa (todas rutas, validación, responsividad OK).

---

## Pendientes / dudas abiertas ❗️

- ~~¿React satisface el rubro "Realiza manipulación de objetos del DOM"?~~ Resuelto (06-ago-2026): se mantiene React; manipulación directa vía `addEventListener` en menú, focus en error de formulario, `document.title`. Será tema de la video reunión de exposición (confirmar con profesora si es suficiente).
- ~~Estructura de carpetas~~ Resuelto (06-ago-2026): proyecto Vite en raíz de `taller-2/`, no en subcarpeta `parte-2/`. `src/` plano sin carpeta `componentes/` o `responsive.css` separado.
- (Agregar ambigüedades que surjan durante migración de bloques 3-6, siguiendo patrón de `taller-1/analisis-parte2-taller1.md`: describir duda, decidir con fecha, marcar ❗️ hasta confirmar.)
