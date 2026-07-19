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
| `catalogo.html` | Huésped | 1,2,7 | Listado con filtros | Alta |
| `resultados-busqueda.html` | Huésped | 2,7 | Resultado de búsqueda del header | Media |
| `directorio.html` *(nueva)* | General/Huésped | 7 | Listado general de propiedades (nombre, ubicación, tipo, capacidad, valoración) — distinto del catálogo filtrable | Media |
| `propiedad-detalle.html` | Huésped | 1,7 | Ficha + reseñas + acción reservar (incluye `<video>` de recorrido) | Alta |
| `reserva.html` *(nueva)* | Huésped | 6,7 | Selección fechas/huéspedes | Alta |
| `reserva-resumen.html` *(nueva)* | Huésped | 6,7 | Resumen, continuar/modificar | Alta |
| `reserva-confirmacion.html` *(nueva)* | Huésped | 7 | Comprobante | Media |
| `agenda.html` *(nueva)* | General | 7 | Vista general de disponibilidad/reservas (distinta del calendario de gestión del anfitrión) | Media |
| `perfil.html` | Huésped | 4,7 | Datos personales, preferencias, favoritos | Alta |
| `mis-reservas.html` | Huésped | 4,7 | Historial y estado de reservas; formulario para calificar/reseñar reservas ya finalizadas (no en `propiedad-detalle.html`, que solo muestra reseñas de consulta) | Alta |
| `ayuda.html` | General | 7 | FAQ, políticas, contacto | Media |
| `politicas-privacidad.html` / `terminos-uso.html` / `sobre-nosotros.html` | General | 7 | Texto institucional | Baja |
| `blog.html` | General | 7 | Listado de artículos | Baja |
| `promociones.html` *(nueva)* | General | 7 | Alojamientos recomendados, ofertas de temporada | Media |
| `suscripcion.html` | General | 6 | Confirmación boletín | Baja |
| `publicar-propiedad.html` | Huésped → Anfitrión | 4,6,7 | Contenido institucional (beneficios/requisitos/proceso) + formulario completo de propiedad (mismo formulario que `anfitrion-propiedad-nueva.html`) | Alta |
| `anfitrion-panel.html` *(nueva)* | Anfitrión | 7 | Dashboard con accesos | Media |
| `anfitrion-propiedades.html` *(nueva)* | Anfitrión | 4,7 | Listado de propiedades del anfitrión, con enlaces a editar/dar de baja cada una | Alta |
| `anfitrion-propiedad-nueva.html` *(nueva)* | Anfitrión | 4,6,7 | Mismo formulario completo de propiedad que `publicar-propiedad.html`, sin el contenido institucional — se reutiliza para cada propiedad adicional | Alta |
| `anfitrion-reservas.html` *(nueva)* | Anfitrión | 4,6,7 | Gestión de solicitudes recibidas | Alta |
| `anfitrion-disponibilidad.html` *(nueva)* | Anfitrión | 7 | Agenda/calendario de gestión (bloquear/habilitar fechas) | Media |
| `anfitrion-perfil.html` *(nueva)* | Anfitrión | 4,7 | Mantenimiento de perfil | Media |
| `admin-panel.html` *(nueva)* | Admin | 7 | Dashboard general | Media |
| `admin-usuarios.html` *(nueva)* | Admin | 4,7 | Gestión huéspedes/anfitriones, aprobación de afiliación | Alta |
| `admin-alojamientos.html` *(nueva)* | Admin | 4,7 | Catálogo global, moderación de contenido | Alta |
| `admin-reservas.html` *(nueva)* | Admin | 4,6,7 | Supervisión reservas y pagos | Alta |
| `admin-reportes.html` *(nueva)* | Admin | 7 | Reportes | Baja |

Pendiente de decisión aparte: alcance de `index-en.html` / `index-fr.html` (multilingüe) — no es criterio explícito de rúbrica pero sí está en la narrativa (línea 130).

## 6. Verificación contra el enunciado completo (no solo la rúbrica)

Relectura del `.md` de indicaciones línea por línea para confirmar que el inventario de la sección 5 cubre los "espacios" que el enunciado nombra explícitamente (línea 84: "...administración del sistema, atención al usuario, directorio, promociones, agenda y políticas institucionales"):

- **`directorio.html` y `promociones.html`**: se habían descartado en una primera pasada por considerarlos "narrativos sin criterio propio". Corrección: el enunciado los nombra explícitamente como espacios obligatorios del sitio (línea 84) y cada uno tiene párrafo propio (líneas 108 y 124). Se agregan al inventario.
- **`agenda.html`**: el enunciado distingue la agenda *general* del sistema (líneas 104–106, relación entre disponibilidad y reservas) del calendario de *gestión* que administra el anfitrión (línea 210). Son espacios distintos nombrados por separado; se agrega `agenda.html` como vista general, separada de `anfitrion-disponibilidad.html`.
- **Multimedia (línea 132)**: el sitio debe incorporar "texto, imágenes, videos, formularios" directamente en HTML5. Ninguna página tenía planeado un `<video>`; se anota en `propiedad-detalle.html` (video de recorrido de la propiedad).
- **Resto de la lista de la línea 84** (inicio, exploración, detalle, reservas, cuentas de usuario, área de anfitrión, administración, atención al usuario, políticas institucionales): cubiertos por `index.html`, `catalogo.html`, `propiedad-detalle.html`, el flujo de reserva, `perfil.html`/`mis-reservas.html`, las páginas `anfitrion-*`, las páginas `admin-*`, `ayuda.html` y `politicas-privacidad.html`/`terminos-uso.html` respectivamente.
- Encabezado, menú principal, footer, formularios, tres perfiles diferenciados, "Publica tu propiedad": ya cubiertos, sin cambios.

## 7. Modelo de cuenta única (huésped = anfitrión potencial)

**Decisión (18-jul-2026):** no hay dos tipos de registro. `registro.html` es único; toda cuenta nace como huésped. El rol de anfitrión no se solicita ni se aprueba como persona — se activa automáticamente cuando esa cuenta crea su primera propiedad. Una misma persona es huésped y anfitrión a la vez (no son cuentas separadas). Por eso `publicar-propiedad.html` y `anfitrion-propiedad-nueva.html` comparten el mismo formulario completo de propiedad; la única diferencia es que `publicar-propiedad.html` además incluye el contenido institucional (beneficios/requisitos/proceso) porque es la puerta pública de entrada.

**❗️ Pendiente (aplazado a propósito):** el enunciado sí dice que el administrador "autoriza la publicación de propiedades" (línea 144). Falta decidir si cada propiedad nace en estado "pendiente de aprobación" hasta revisión del admin (similar al estado pendiente/confirmada/cancelada de las reservas) o si la publicación es inmediata. Esto afecta el diseño de `anfitrion-propiedades.html` (¿muestra estado por propiedad?) y `admin-alojamientos.html` (¿tiene bandeja de aprobación?). Se resuelve más adelante, al construir esas páginas.

## 8. Pendientes / próximos pasos

1. Confirmar con la profesora la interpretación del criterio 4 ("mantenimiento de perfiles, servicios, pagos, etc.") — se avanza bajo Lectura A mientras tanto.
2. Definir alcance real del multilingüe (¿3 versiones completas o stub?) antes de que el volumen de páginas se triplique.
3. Diseñar el patrón de `header`/`nav`/`footer` reutilizable para todas las páginas secundarias, a partir del ya usado en `index.html`.
4. Construir las páginas del inventario (sección 5) por bloques, en orden de prioridad.
5. Revisar continuidad con `index.html` / `arquitectura-home.md` de Parte 1 para mantener nomenclatura y jerarquía de secciones consistente entre Parte 1 y Parte 2.
6. Validar el HTML final (W3C validator), confirmar ausencia de `div`/`table` de maquetación y de `style`/`link rel="stylesheet"`/`script`.
7. Resolver el estado de aprobación de propiedades (sección 7) antes de construir `anfitrion-propiedades.html` y `admin-alojamientos.html`.
