# Plan de trabajo — Taller No. 2 (StayBooker 360)

Plan vivo, sin fechas objetivo — el orden de las tareas es el orden lógico recomendado, no un calendario. Se va marcando conforme se avanza y se actualiza cuando cambian decisiones. Ver `CLAUDE.md` (raíz del repo) para las reglas generales del curso, y `taller-2/Taller2-Parte1-StayBooker360.md` para el borrador actual de Parte 1.

**Orden de trabajo (decisión 06-ago-2026):** se construye primero la Parte 2 (código); la Parte 1 (documento) se redacta/ajusta a partir de lo que efectivamente se implementó, no al revés. El borrador actual de Parte 1 es un punto de partida, no la fuente de verdad — cuando el código diverja de lo que dice el borrador, gana el código y el borrador se actualiza para reflejarlo.

---

## Parte 2 — Sitio funcional

### 0. Scaffold del proyecto

- [ ] Crear `taller-2/parte-2/` como proyecto Vite + React + React Router.
- [ ] Estructura de hojas de estilo: `variables.css`, `base.css`, `layout.css`, `componentes/header-nav.css`, `componentes/formularios.css`, `componentes/botones.css`, `componentes/tarjetas.css`, `responsive.css`.
- [ ] Componente `Layout` compartido (header + nav + footer + `Outlet`).
- [ ] Configurar rutas base de React Router, una por cada una de las 34 páginas de `taller-1/parte-2/`.

### 1. Sesión y paso de datos (antes de migrar páginas que dependen de ella)

- [ ] Implementar `useSesion` (Context + `sessionStorage`) según el patrón documentado en Parte 1.
- [ ] Confirmar que cubre: saludo de bienvenida, `document.title` dinámico, persistencia entre las 34 vistas dentro de la misma pestaña.
- Nota: se hace temprano a propósito — login, panel y saludo dependen de esto, y evita retocar componentes después.

### 2. CSS base (afecta a todo el sitio)

- [ ] `variables.css` — paleta, tipografía, espaciado, radios, transiciones (valores ya definidos en Parte 1, sección 3.2).
- [ ] `base.css` — reset ligero y tipografía base.
- [ ] `layout.css` — CSS Grid como sistema general de layout de página (header/main/footer, paneles con contenido + aside, formularios en columnas), con `repeat(auto-fit, minmax(...))` para las cuadrículas que se adapten sin depender de breakpoints fijos. Flexbox queda reservado para alineación 1D dentro de componentes puntuales: `nav` (enlaces en fila), filas de botones, campos de formulario en línea.
  - Decisión (06-ago-2026): mobile-first con Grid como base — en vez de fijar cuántas columnas van a cada breakpoint, se deja que el navegador calcule cuántas caben (`auto-fit`/`minmax`), y se ajustan breakpoints solo donde haga falta un cambio de comportamiento más allá de columnas (ej. header pasa de apilado a fila).

### 3. Migración por bloques funcionales

Cada bloque = una tarea: migrar HTML→JSX, aplicar CSS del bloque, agregar validaciones de sus formularios, e integrar sesión donde aplique. Revisar y probar cada bloque antes de pasar al siguiente.

- [ ] **Bloque A — Público / institucional**: `index`, `sobre-nosotros`, `ayuda`, `politicas-privacidad`, `terminos-uso`, `blog`, `blog-post`, `promociones`.
- [ ] **Bloque B — Catálogo, detalle y reserva**: `catalogo`, `propiedad-detalle`, `reserva`, `reserva-resumen`, `reserva-confirmacion`.
- [ ] **Bloque C — Autenticación y cuenta**: `registro`, `inicio-sesion`, `perfil`, `mis-reservas`, `publicar-propiedad`.
- [ ] **Bloque D — Panel anfitrión**: `anfitrion-panel`, `anfitrion-propiedades`, `anfitrion-propiedad-editar`, `anfitrion-reservas`, `anfitrion-consultas`, `anfitrion-consulta-responder`, `anfitrion-propiedad-resenas`, `anfitrion-resena-responder`.
- [ ] **Bloque E — Panel administrador**: `admin-panel`, `admin-usuarios`, `admin-usuario-editar`, `admin-alojamientos`, `admin-alojamiento-editar`, `admin-reservas`, `admin-reserva-editar`, `admin-promociones`, `admin-promocion-editar`, `admin-blog`, `admin-blog-post-editar`, `admin-reportes`.

### 4. Interactividad transversal

- [ ] Efectos de menú de navegación (`onmouseover`/`onmouseout` vía `addEventListener`, ya prototipado en Parte 1).
- [ ] Estados/efectos de botones de formularios.
- [ ] Mensajes del lado del cliente (`.mensaje-error`, `.mensaje-exito`) consistentes en todos los formularios.

### 5. Responsividad

- [ ] Verificar los dos breakpoints definidos (640px, 1024px) en cada bloque ya migrado.
- [ ] Revisión final de responsividad end-to-end sobre las 34 vistas.

### 6. Verificación final

- [ ] Probar las 34 rutas navegables desde el menú/enlaces internos.
- [ ] Probar validación de cada formulario (campos vacíos, formato de correo, longitud de contraseña, fechas de reserva, extensión de archivos donde aplique).
- [ ] Confirmar que la sesión persiste correctamente entre páginas dentro de la misma pestaña.
- [ ] Validar HTML/JSX resultante (sin `div`/`table` de maquetación heredados de más, consistencia de etiquetas semánticas).

---

## Parte 1 — Documento de propuesta (se redacta a partir de la Parte 2 ya construida)

- [ ] Actualizar la sección 3 (CSS) del borrador para reflejar Grid como sistema general de layout, no solo para cuadrículas de tarjetas — ver decisión en "2. CSS base" arriba.
- [ ] Reemplazar la nota ⚠️ abierta sobre React y el rubro "Realiza manipulación de objetos del DOM" por la decisión ya tomada: se mantiene React, garantizando manipulación directa del DOM en varios puntos explícitos (no solo el menú de navegación).
  - Decisión (06-ago-2026): seguir con la mitigación documentada — refs + `addEventListener` nativo en el menú, y ampliar a 1-2 puntos más (foco en campo con error de un formulario, actualización de `document.title`) para que quede robusto en la exposición oral.
- [ ] Completar datos de portada (profesor, grupo, cédula, centro universitario) — mismo pendiente que quedó abierto en Taller 1.
- [ ] Revisar el documento completo contra el código real de Parte 2 (paleta, arquitectura CSS, forma de la sesión, bloques efectivamente construidos) y corregir cualquier divergencia.
- [ ] Congelar el documento y convertir a `.docx`/PDF cuando Parte 2 esté terminada.

---

## Pendientes / dudas abiertas ❗️

- ~~¿React satisface el rubro "Realiza manipulación de objetos del DOM"?~~ Resuelto (06-ago-2026): se sigue con React + mitigación documentada (ver Parte 1 abajo). No confirmado con la profesora todavía — mencionar explícitamente en la video reunión.
- (Agregar aquí cualquier otra ambigüedad que surja durante la migración de páginas o la construcción de formularios, siguiendo el mismo patrón de `taller-1/analisis-parte2-taller1.md`: describir la duda, decidir con fecha, marcar con ❗️ hasta confirmar.)
