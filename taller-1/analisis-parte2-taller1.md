# Análisis Parte 2 — Taller No. 1 (StayBooker 360)

**Curso:** 03098 – Programación Web, II Cuatrimestre 2026
**Referencia:** `Taller_No_1-3098-2C-2026.md` (enunciado oficial) + repo `bhbarquero-dev/03098-Taller-IIC2026` (Parte 1 ya completada)

---

## 1. Qué solicita Parte 2 (según rúbrica — 50 pts)

La rúbrica es la guía de esfuerzo, no la narrativa completa del enunciado.

| # | Criterio | Puntos |
|---|---|---|
| 1 | Presenta página principal en HTML5 | 5 |
| 2 | Define el menú de navegación en HTML5 | 5 |
| 3 | Separa adecuadamente la capa de contenido de la capa de presentación | 5 |
| 4 | Desarrolla la página de mantenimiento de perfiles, servicios, pagos, etc. | 10 |
| 5 | Separa la capa de presentación de las páginas secundarias | 5 |
| 6 | Presenta objetos de formularios respetando las etiquetas de sección en HTML5 | 10 |
| 7 | Uso de estructura por secciones (`header`, `footer`, `article`, `section`) en las páginas | 10 |

En sustancia: construir el sitio completo (páginas secundarias, formularios reales, paneles de huésped/anfitrión/administrador) solo con HTML5 semántico — sin CSS, JS, frameworks, ni `div`/`table` de maquetación. Este taller sienta la base para el Taller 2, donde sí se permitirá un framework.

**Video Reunión** (evaluación separada, 15 pts): sesión de 10 min, pantalla compartida + rostro visible, explicar fuentes usadas y pasos seguidos, asociar el desarrollo con los capítulos 6, 9, 10 y 11 del texto guía.

---

## 2. Ambigüedad del criterio 4 ("...etc.")

El criterio de mayor peso individual (10 pts) es ambiguo. Dos lecturas posibles:

- **Lectura A — "Mantenimiento" = gestión/CRUD** (crear, editar, listar, dar de baja):
  - Perfiles (huésped edita datos; anfitrión edita su perfil; admin gestiona usuarios)
  - Servicios/propiedades (anfitrión registra/edita alojamientos y sus servicios)
  - Pagos/transacciones (admin supervisa pagos; reservas con ciclo pendiente/confirmada/cancelada)
  - "Etc" razonable: disponibilidad/calendario, aprobación de anfitriones

- **Lectura B — "Etc" = toda la narrativa** (blog, testimonios, multilingüe, directorio, centro de ayuda incluidos)

Bajo Lectura A, estos elementos de contenido/exhibición (no gestión) ya quedan cubiertos por los criterios 1, 2, 5, 6 y 7 como páginas secundarias normales, sin necesidad de forzarlos dentro del criterio 4.

**❗️ Pendiente:** confirmar con la profesora cuál lectura aplica — mismo patrón que la consulta ya enviada sobre Video Reunión. Mientras se recibe respuesta, se trabaja bajo la hipótesis "mantenimiento = CRUD" (Lectura A) por ser la interpretación literal del término y la más proporcional al peso del criterio.

**Decisión (18-jul-2026):** se confirma seguir bajo Lectura A mientras no haya respuesta de la profesora. El inventario de la sección 6 se construyó sobre esta hipótesis.

---

## 3. Tipos de usuario

El enunciado define **3 tipos de usuario oficiales**: administrador, huésped y anfitrión — "cada uno con estructuras diferenciadas dentro del HTML5".

El **visitante** (no registrado) se menciona en la introducción como quien "explora alojamientos", pero no tiene sección propia en la narrativa detallada ni es contado entre los tipos definidos formalmente. Se excluye como rol independiente para efectos de Parte 2; es simplemente el estado previo al registro como huésped.

---

## 4. Funciones por tipo de usuario (según narrativa)

### General (no ligado a un rol específico)

| Elemento | Detalle |
|---|---|
| Página principal | Portal institucional: identidad, propuesta de valor, beneficios para huéspedes y anfitriones |
| Encabezado (`header`) | Logo, barra de búsqueda, accesos a registro/login/perfil/reservas |
| Menú principal (`nav`) | Filtros: tipo de propiedad, destino, precio, huéspedes, servicios, experiencias destacadas |
| Catálogo de alojamientos | Explorar propiedades por ubicación, tipo, capacidad, precio, valoración, disponibilidad |
| Detalle de propiedad | Descripción, características, ubicación, costo, disponibilidad, imágenes, acción "reservar" |
| Proceso de reserva | Selección de fechas, cantidad de huéspedes, resumen, continuar/modificar |
| Agenda/disponibilidad (general) | Relación entre períodos de estancia y disponibilidad de propiedades |
| Directorio de alojamientos/anfitriones | Nombre, ubicación, tipo, capacidad, valoración |
| Centro de atención al usuario | FAQ, políticas de uso, condiciones, formulario de contacto |
| Valoraciones y testimonios | Espacio de reseñas de usuarios |
| Promociones/experiencias destacadas | Alojamientos recomendados, ofertas de temporada |
| Blog/noticias | Destinos, recomendaciones de viaje, info de hospedaje |
| Pie de página (`footer`) | Políticas, términos, contacto, redes sociales, suscripción a boletín |
| Navegación multilingüe | ES / EN / FR (estructural) |
| "Publica tu propiedad" | Sección institucional para prospectos a anfitrión + formulario de postulación |

### Huésped

| Acción |
|---|
| Navegar/buscar catálogo por ubicación, tipo, precio, características |
| Ver ficha de alojamiento (descripción, fotos, servicios, capacidad, disponibilidad, valoraciones) |
| Simular reserva (fechas → huéspedes → confirmar solicitud) |
| Ver comprobante/resumen de la reserva |
| Administrar perfil (nombre, correo, contacto, preferencias) |
| Consultar historial y estado de reservas (pendiente/confirmada/finalizada/cancelada) |
| Marcar alojamientos como favoritos |
| Consultar condiciones de uso y políticas de cancelación de cada alojamiento |
| Comunicarse con anfitriones vía formulario de consulta |
| Dejar reseñas y calificar alojamientos |
| Recibir recomendaciones/promociones/destacados |
| Contactar centro de ayuda / plantear reclamos |

### Anfitrión

| Acción |
|---|
| Registrar/editar/organizar propiedades (nombre, descripción, ubicación, tipo, capacidad, servicios, reglas, cancelación, multimedia) |
| Gestionar galería de imágenes y múltiples propiedades |
| Definir políticas por propiedad (mascotas, fumar, horarios, normas de convivencia) |
| Gestionar reservas recibidas: revisar, validar, aceptar/rechazar, actualizar estado |
| Consultar detalle de cada reserva (fechas, huéspedes, observaciones) |
| Gestionar disponibilidad tipo agenda/calendario (bloquear/habilitar fechas) |
| Consultar estadísticas (reservas, ocupación, propiedades más consultadas, valoraciones) |
| Consultar valoraciones/comentarios de huéspedes |
| Responder consultas de huéspedes vía formulario por propiedad |
| Participar en promociones/secciones destacadas |
| Administrar su propio perfil (info básica, contacto, descripción de rol) |
| Acceder a espacio de orientación para anfitriones *(opcional — "podrá contemplar")* |

### Administrador

| Acción |
|---|
| Panel de control central: supervisión general del sitio |
| Crear/editar/actualizar catálogo, agenda, promociones, blog, páginas de soporte |
| Gestionar catálogo global (categorías, tipos, precios, imágenes); autorizar publicaciones de anfitriones |
| Definir/supervisar criterios de búsqueda y filtrado |
| Verificar disponibilidad real y consistencia de fechas; resolver conflictos |
| Gestionar reservas y transacciones/pagos; validar cancelaciones y reembolsos |
| Supervisar todos los formularios del sistema; definir campos y su organización |
| Gestionar afiliación de anfitriones (revisar/aprobar solicitudes, orientar publicación) |
| Moderar contenido (descripciones, imágenes, reseñas): aprobar, editar, retirar |
| Gestionar promociones, contenido institucional, políticas, blog |
| Supervisar accesos por tipo de usuario e integridad de datos |
| Verificar funcionamiento y enlaces del sitio; corregir inconsistencias |
| Generar reportes (reservas, comportamiento, tendencias, incidencias) |
| Coordinar versión multilingüe (ES/EN/FR) |
| Actuar como enlace entre niveles del sistema |

**❗️ Nota sobre el Administrador:** tiene más funciones listadas que los otros dos roles, pero varias son de **supervisión de lo que ya existe**, no acciones con pantalla propia (p. ej. "verificar consistencia de fechas", "velar por la integridad"). Al mapear a páginas HTML habrá que distinguir qué es una pantalla real vs. narrativa de responsabilidad sin artefacto visual — de lo contrario se sobre-construye el panel de admin sin ganancia de puntaje.

---

## 5. Inventario de páginas — Parte 2

Base: los 13 archivos que `index.html` (Parte 1) ya promete como enlaces, más las páginas nuevas necesarias para cubrir huésped/anfitrión/administrador y los "espacios" que el enunciado nombra explícitamente en la línea de jerarquía (sección 6 de este documento). Cada fila indica rol, criterio(s) de rúbrica que cubre y prioridad.

| Página | Rol | Criterio(s) | Contenido principal | Prioridad |
|---|---|---|---|---|
| `index.html` | General | 1,2,3,7 | Portal (ya hecho, Parte 1) | — |
| `registro.html` | General | 6,7 | Alta de cuenta | Alta |
| `inicio-sesion.html` | General | 6,7 | Login | Media |
| `catalogo.html` | Huésped | 1,2,7 | Vista única de exploración: destino tanto del enlace "Explorar" del nav como del resultado de la búsqueda del header (`index.html`); `aside` con filtro detallado (tipo, precio, capacidad, ubicación, servicios) + `section` con listado de propiedades en tarjetas | Alta |
| `propiedad-detalle.html` | Huésped | 1,7 | Ficha + reseñas + acción reservar (incluye `<video>` de recorrido) | Alta |
| `reserva.html` *(nueva)* | Huésped | 6,7 | Selección fechas/huéspedes | Alta |
| `reserva-resumen.html` *(nueva)* | Huésped | 6,7 | Resumen, continuar/modificar | Alta |
| `reserva-confirmacion.html` *(nueva)* | Huésped | 7 | Comprobante | Media |
| ~~`agenda.html`~~ | — | — | Descartada (decisión 19-jul-2026): resuelto el pendiente de la sección 8. La línea 104-106 ("agenda **o** disponibilidad") quedó cubierta dentro de `propiedad-detalle.html`, en la subsección "Costo y disponibilidad" (tabla de períodos no disponibles, con `<time>`). No se agrega el enlace "Agenda" al nav | — |
| `perfil.html` | Huésped | 4,7 | Datos personales, preferencias, favoritos | Alta |
| `mis-reservas.html` | Huésped | 4,7 | Historial y estado de reservas; formulario para calificar/reseñar reservas ya finalizadas (no en `propiedad-detalle.html`, que solo muestra reseñas de consulta) | Alta |
| `ayuda.html` | General | 7 | FAQ, políticas, contacto | Media |
| `politicas-privacidad.html` / `terminos-uso.html` | General | 7 | Texto institucional (contenido inventado, solo las páginas están nombradas en línea 128) | Baja |
| `sobre-nosotros.html` | General | 7 | Texto institucional 100% inventado (quiénes somos, misión, visión, historia, cobertura) — no está mencionada en el enunciado ni siquiera en línea 128; se mantiene por decisión explícita del usuario | Baja |
| `blog.html` | General | 7 | Listado de artículos | Baja |
| `blog-post.html` *(nueva)* | General | 7 | Página de post individual del blog (no pedida por el enunciado, decisión propia del proyecto) | Baja |
| `promociones.html` *(nueva)* | General | 7 | Alojamientos recomendados, ofertas de temporada | Media |
| ~~`suscripcion.html`~~ | — | — | Descartada (decisión 19-jul-2026): el formulario de boletín en el footer se queda solo como formulario, sin página de confirmación propia | — |
| `publicar-propiedad.html` | Huésped → Anfitrión | 4,6,7 | Contenido institucional (beneficios/requisitos/proceso) + formulario completo de propiedad (mismo formulario que `anfitrion-propiedad-nueva.html`) | Alta |
| `anfitrion-panel.html` *(nueva)* | Anfitrión | 7 | Dashboard: resumen (línea 212) + accesos a propiedades/reservas/perfil (línea 226). Es el destino del enlace "Panel de anfitrión" en `perfil.html` (antes apuntaba directo a `anfitrion-propiedades.html`) | Media |
| `anfitrion-propiedades.html` *(nueva)* | Anfitrión | 4,7 | Listado de propiedades del anfitrión, con enlaces a editar/dar de baja cada una | Alta |
| `anfitrion-propiedad-editar.html` *(nueva, renombrada 19-jul-2026)* | Anfitrión | 4,6,7 | Mismo formulario completo de propiedad que `publicar-propiedad.html`, sin el contenido institucional, precargado con los datos existentes + fieldset de Estado (Publicada/Inactiva editable; Pendiente/Rechazada informativo) + fieldset de Participación en promociones. Uso: editar una propiedad existente desde `anfitrion-propiedades.html`. Toda alta de propiedad nueva pasa por `publicar-propiedad.html`. Incluye además la sección "Disponibilidad" (línea 210): selector de mes/año + tabla-calendario + formulario de bloquear/habilitar fechas, absorbiendo lo que era `anfitrion-disponibilidad.html` | Alta |
| `anfitrion-reservas.html` *(nueva)* | Anfitrión | 4,6,7 | Gestión de solicitudes recibidas | Alta |
| `anfitrion-consultas.html` *(nueva)* | Anfitrión | 4,7 | Tabla de consultas recibidas de huéspedes (línea 216: "el anfitrión... podrá responder consultas"): asunto, propiedad, huésped, fecha, estado (Pendiente/Respondida), solo enlace "Responder" por fila | Media |
| `anfitrion-consulta-responder.html` *(nueva)* | Anfitrión | 4,6,7 | Detalle completo de la consulta (lectura) + formulario de respuesta | Media |
| ~~`anfitrion-disponibilidad.html`~~ | — | — | Descartada (decisión 19-jul-2026): se integró directamente en `anfitrion-propiedad-editar.html` (sección "Disponibilidad": selector de mes/año + tabla-calendario + formulario de bloquear/habilitar), igual que se hizo del lado del huésped en `propiedad-detalle.html`. Ya no es una página aparte | — |
| ~~`anfitrion-perfil.html`~~ | — | — | Descartada (decisión 19-jul-2026): por el modelo de cuenta única, línea 220 ya queda cubierta por la sección "Datos personales" de `perfil.html`. Se agrega ahí un enlace "Ver mis propiedades" → `anfitrion-propiedades.html` como puerta de entrada al panel de anfitrión | — |
| `admin-panel.html` *(nueva)* | Admin | 7 | Dashboard: resumen (línea 166) + accesos a usuarios/alojamientos/reservas/reportes (línea 172, "secciones de control, formularios, listados y reportes"). Entra desde `perfil.html` (enlace "Panel de administración"), igual que el de anfitrión — la lógica de qué panel mostrar según tipo de cuenta queda para cuando se implemente lógica real en el sitio | Media |
| `admin-usuarios.html` *(nueva)* | Admin | 4,7 | Tabla de cuentas registradas (línea 140/150): nombre, correo, tipo de cuenta (Huésped / Huésped y anfitrión), estado, y solo enlace "Editar" por fila — suspender/eliminar vive dentro de `admin-usuario-editar.html`, no en el listado | Alta |
| `admin-usuario-editar.html` *(nueva)* | Admin | 4,6,7 | Detalle/edición de una cuenta: datos personales, tipo de cuenta (informativo), estado (Activa/Suspendida editable), formulario de restablecer contraseña, formulario aparte para eliminar cuenta, y sección "Reportar incidencia" (formulario + tabla de incidencias de esta cuenta) | Alta |
| `admin-alojamientos.html` *(nueva)* | Admin | 4,7 | Tabla del catálogo global (línea 144): propiedad, anfitrión, tipo, estado (Pendiente/Publicada/Rechazada/Inactiva), solo enlace "Editar" por fila — resuelve la bandeja de aprobación pendiente de la sección 7 | Alta |
| `admin-alojamiento-editar.html` *(nueva)* | Admin | 4,6,7 | Datos de la propiedad (lectura) + formulario de aprobar/rechazar publicación con motivo (línea 144) + tabla de reseñas de la propiedad con selector de orden (valoración/recientes/antiguas) y enlace "Bloquear reseña" por cada una (línea 154: moderar valoraciones de usuarios) + sección "Reportar incidencia" (formulario + tabla de incidencias de este alojamiento) | Alta |
| `admin-reservas.html` *(nueva)* | Admin | 4,7 | Tabla de reservas registradas (línea 148): propiedad, anfitrión, huésped, fechas, estado de reserva, estado de pago; formulario de filtro por anfitrión; solo enlace "Editar" por fila — la decisión de reembolso vive en `admin-reserva-editar.html` | Alta |
| `admin-reserva-editar.html` *(nueva)* | Admin | 4,6,7 | Datos de la reserva (lectura, incluye monto — no editable, decisión explícita del usuario) + formulario de estado de pago + sección "Validar cancelación" (motivo dado por quien cancela, decisión del admin con su propio motivo) + sección "Validar reembolso" (decisión, monto a reembolsar, motivo) + sección "Reportar incidencia" (formulario + tabla de incidencias de esta reserva), acorde a línea 148 ("validar cancelaciones, modificaciones y reembolsos") | Alta |
| `admin-promociones.html` *(nueva)* | Admin | 4,7 | Tabla de promociones registradas (línea 156): título, estado (Activa/Inactiva/Finalizada), solo enlace "Editar" por fila | Media |
| `admin-promocion-editar.html` *(nueva)* | Admin | 4,6,7 | Formulario de edición (título, descripción, beneficio, vigencia, estado) + tabla de propiedades participantes (línea 156: "gestiona las promociones... definiendo ofertas, temporadas") | Media |
| `admin-blog.html` *(nueva)* | Admin | 4,7 | Tabla de posts del blog (línea 142: "crea, edita y actualiza... el blog institucional"): título, autor, fecha de publicación, estado (Publicado/Borrador), solo enlace "Editar" por fila | Media |
| `admin-blog-post-editar.html` *(nueva)* | Admin | 4,6,7 | Formulario de edición del post (título, autor, fecha, imagen, contenido, estado) | Media |
| `admin-reportes.html` *(nueva)* | Admin | 6,7 | Página de solo lectura/consolidación (línea 166): formulario de filtro por tipo de reporte (alojamientos más consultados/reservas del período/comportamiento de usuarios/tendencias/incidencias registradas) + tabla con el resultado de uno de los reportes posibles (ejemplo construido: alojamientos más consultados) + botón "Imprimir reporte" sin función (decisión explícita del usuario: sin JS no puede funcionar, se deja como elemento visual). El registro de incidencias ocurre en el editar de cada entidad (usuarios/alojamientos/reservas); esta pantalla las consolida como uno de los tipos de reporte disponibles | Media |

**Decisión (19-jul-2026):** cerrado. El multilingüe (línea 130/168) se queda solo como los enlaces estructurales ES/EN/FR ya presentes en el header (`?lang=en`/`?lang=fr`, sin contenido traducido real) — no se construirán versiones completas `index-en.html`/`index-fr.html` ni equivalentes. No es criterio explícito de la rúbrica.

**Decisión (19-jul-2026):** cerrado. El espacio de orientación para anfitriones (línea 222) no se construye — el propio enunciado lo marca como opcional ("el sistema podrá contemplar").

## 6. Verificación contra el enunciado completo (no solo la rúbrica)

Relectura del `.md` de indicaciones línea por línea para confirmar que el inventario de la sección 5 cubre los "espacios" que el enunciado nombra explícitamente (línea 84: "...administración del sistema, atención al usuario, directorio, promociones, agenda y políticas institucionales"):

- **`directorio.html` y `promociones.html`**: se habían descartado en una primera pasada por considerarlos "narrativos sin criterio propio". Corrección: el enunciado los nombra explícitamente como espacios obligatorios del sitio (línea 84) y cada uno tiene párrafo propio (líneas 108 y 124). `promociones.html` se agrega al inventario como página propia.
- **Fusión catálogo/directorio (decisión 19-jul-2026):** el enunciado describe catálogo (línea 100) y directorio (línea 108) en párrafos separados, pero al releerlos no hay un caso de uso distinto entre ambos — las dos descripciones apuntan al mismo listado de propiedades con criterios de búsqueda/filtrado. En vez de forzar una distinción artificial, se fusionan en una sola página, `catalogo.html`, que además absorbe el destino de la búsqueda del formulario de `index.html` (eliminando también la necesidad de `resultados-busqueda.html`, que hubiera sido una tercera página redundante con la misma función). `catalogo.html` queda con un `aside` de filtro detallado (tipo, precio, capacidad, ubicación, servicios) y un `section` con las tarjetas de resultado. Nota: sin CSS, `aside` y `section` se apilan verticalmente en el orden del documento (filtro primero, resultados después) en lugar de verse en columnas — la maquetación en columnas reales es tarea del Taller 2.
- **Agenda (líneas 104–106):** se había agregado `agenda.html` como vista general, separada del calendario de gestión del anfitrión (línea 210). Corrección (19-jul-2026): al releerlo, el propio enunciado llama a esto "agenda **o** disponibilidad" — la misma redundancia de nombres que catálogo/directorio. Se resuelve integrando la disponibilidad de cada propiedad directamente en `propiedad-detalle.html`, que es donde el huésped realmente la necesita, en vez de una página general aparte. Representación final: un selector de mes/año (`select`, fuera de la tabla) + una tabla-calendario de un solo mes (agosto 2026 por defecto, Lun a Dom, celdas con `<time>` y las fechas ocupadas marcadas como "— Reservado").
- **Multimedia (línea 132)**: el sitio debe incorporar "texto, imágenes, videos, formularios" directamente en HTML5. Ninguna página tenía planeado un `<video>`; se anota en `propiedad-detalle.html` (video de recorrido de la propiedad).
- **Resto de la lista de la línea 84** (inicio, exploración, detalle, reservas, cuentas de usuario, área de anfitrión, administración, atención al usuario, políticas institucionales): cubiertos por `index.html`, `catalogo.html`, `propiedad-detalle.html`, el flujo de reserva, `perfil.html`/`mis-reservas.html`, las páginas `anfitrion-*`, las páginas `admin-*`, `ayuda.html` y `politicas-privacidad.html`/`terminos-uso.html` respectivamente.
- Encabezado, menú principal, footer, formularios, tres perfiles diferenciados, "Publica tu propiedad": ya cubiertos, sin cambios.

## 7. Modelo de cuenta única (huésped = anfitrión potencial)

**Decisión (18-jul-2026):** no hay dos tipos de registro. `registro.html` es único; toda cuenta nace como huésped. El rol de anfitrión no se solicita ni se aprueba como persona — se activa automáticamente cuando esa cuenta crea su primera propiedad. Una misma persona es huésped y anfitrión a la vez (no son cuentas separadas). Por eso `publicar-propiedad.html` y `anfitrion-propiedad-nueva.html` comparten el mismo formulario completo de propiedad; la única diferencia es que `publicar-propiedad.html` además incluye el contenido institucional (beneficios/requisitos/proceso) porque es la puerta pública de entrada.

**Decisión (19-jul-2026):** resuelto. La línea 144 confirma que el administrador "autoriza la publicación de propiedades", así que cada propiedad sí nace en estado "pendiente de aprobación". Se define un ciclo de 4 estados por propiedad: **Pendiente de aprobación** (recién creada, no visible en `catalogo.html`) → **Publicada** (aprobada por el admin, visible y reservable) → **Rechazada** (el admin no aprobó, con motivo) o **Inactiva** (el propio anfitrión la desactivó desde la edición; deja de listarse en `catalogo.html` pero las reservas ya existentes sobre ella no se ven afectadas). El cambio de estado no se maneja como acción aparte en el listado (`anfitrion-propiedades.html`): la opción de desactivar/reactivar vive dentro de editar la propiedad (`anfitrion-propiedad-nueva.html`), no como un enlace suelto en la tarjeta del listado. Esto queda pendiente de construir cuando se aborde `admin-alojamientos.html` (bandeja de aprobación) y la edición dentro de `anfitrion-propiedad-nueva.html`.

## 8. Pendientes / próximos pasos

1. Confirmar con la profesora la interpretación del criterio 4 ("mantenimiento de perfiles, servicios, pagos, etc.") — se avanza bajo Lectura A mientras tanto.
2. ~~Definir alcance real del multilingüe (¿3 versiones completas o stub?) antes de que el volumen de páginas se triplique.~~ Resuelto (19-jul-2026): se queda solo como stub estructural, sin versiones traducidas.
3. Diseñar el patrón de `header`/`nav`/`footer` reutilizable para todas las páginas secundarias, a partir del ya usado en `index.html`.
4. Construir las páginas del inventario (sección 5) por bloques, en orden de prioridad.
5. Revisar continuidad con `index.html` / `arquitectura-home.md` de Parte 1 para mantener nomenclatura y jerarquía de secciones consistente entre Parte 1 y Parte 2.
6. Validar el HTML final (W3C validator), confirmar ausencia de `div`/`table` de maquetación y de `style`/`link rel="stylesheet"`/`script`.
7. Resolver el estado de aprobación de propiedades (sección 7) antes de construir `anfitrion-propiedades.html` y `admin-alojamientos.html`.
8. ~~Pendiente: revisar de nuevo el tema de la agenda.~~ Resuelto (19-jul-2026): `agenda.html` se descarta; la disponibilidad general (línea 104–106) se representa dentro de `propiedad-detalle.html` (tabla de fechas no disponibles con `<time>`), separada de `anfitrion-disponibilidad.html` (gestión editable por propiedad, línea 210).
