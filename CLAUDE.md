# CLAUDE.md — Instrucciones generales del repositorio

Contexto para trabajar en cualquiera de los talleres de este curso. Instrucciones específicas de cada taller viven en su propio `README.md` (`taller-1/README.md`, `taller-2/README.md`); esto es lo que aplica a ambos.

## Curso

- **03098 – Programación Web**, Ingeniería Informática, UNED. II Cuatrimestre 2026.
- Estudiante: Bernal Hernández Barquero (bhbarquero@gmail.com).
- Profesora: Daniela Hidalgo Cordero.
- Texto guía: Moreno, D. (2018). *Diseño Web: Interfaces y código cliente*. EUNED.
- Proyecto único para ambos talleres: **StayBooker 360**, plataforma de alojamientos vacacionales (tipo Airbnb/Booking) con tres tipos de usuario: **huésped**, **anfitrión** y **administrador**. Modelo de cuenta única — no hay registro separado por rol; toda cuenta nace huésped y el rol de anfitrión se activa al publicar la primera propiedad (ver `taller-1/analisis-parte2-taller1.md`, sección 7).

## Estructura del repo

```
03098-Taller-IIC2026/
├── CLAUDE.md          # este archivo
├── README.md          # estado general de entregas
├── taller-1/          # CERRADO — no modificar
└── taller-2/          # en desarrollo
```

## Regla dura: `taller-1/` no se toca

`taller-1/` es la base entregada y evaluada de forma independiente. **No se edita, no se refactoriza, no se le agregan archivos** salvo que el usuario lo pida explícitamente. `taller-2/` construye sobre lo que hay ahí (las 34 páginas HTML de `taller-1/parte-2/` son el punto de partida real, pese a que `taller-1/README.md` diga "Parte 2 pendiente" — ese README quedó desactualizado y no se corrige porque implicaría tocar taller-1).

## Reglas de integridad académica (aplican a ambos talleres)

- Nada de plantillas comerciales, prediseños, generadores automáticos de código ni frameworks CSS (Bootstrap, Tailwind, etc.). El diseño visual es 100% original y propio.
- Taller 1: solo HTML5 semántico, cero CSS/JS/frameworks, cero `div`/`table` de maquetación.
- Taller 2: se permite un framework de JavaScript (se usa React + Vite + React Router — ver `taller-2/Taller2-Parte1-StayBooker360.md`), pero el CSS sigue siendo 100% propio, sin frameworks de CSS.
- Cada taller cierra con una video reunión de 10 min con la profesora: pantalla compartida + rostro visible, explicando fuentes y asociando el trabajo con los capítulos del texto guía indicados en el enunciado de cada taller.

## Cómo se documentan las decisiones

Cuando un enunciado de taller es ambiguo (pasa seguido — ver `taller-1/analisis-parte2-taller1.md` como ejemplo de este patrón), la forma de trabajar es:

1. Documentar la ambigüedad explícitamente, con las lecturas posibles.
2. Tomar una decisión razonada y marcarla como provisional hasta confirmar con la profesora, con fecha (`**Decisión (DD-mmm-AAAA):** ...`).
3. Avanzar bajo esa hipótesis en vez de bloquearse.
4. Si la profesora confirma o corrige, actualizar la decisión y seguir.

Dudas pendientes de confirmar con la profesora se marcan con ❗️ en el documento correspondiente para que no se pierdan.

## Convenciones de nomenclatura

- Archivos y rutas en español, minúsculas, con guiones (`admin-alojamiento-editar.html`, `/propiedades/1`).
- Prefijos por rol: `admin-*`, `anfitrion-*`; páginas sin prefijo son generales/huésped.
- Los atributos `name` de los formularios ya anticipan el futuro modelo de datos (`correo`, `clave`, `precio_min`, etc.) — no renombrar sin razón, porque taller-2 depende de esa consistencia para la preparación hacia back-end.

## Dónde está cada cosa

- `taller-1/indicaciones/` y `taller-2/indicaciones/`: enunciados oficiales tal como los entregó la cátedra (PDF + Markdown).
- `taller-1/analisis-parte2-taller1.md`: ejemplo del proceso de análisis de rúbrica + inventario de páginas usado para taller 1; mismo patrón aplica si taller-2 lo necesita.
- `taller-2/Taller2-Parte1-StayBooker360.md`: borrador vivo de la Parte 1 de taller-2 (decisiones de stack, CSS, validación, sesión). Marcado como BORRADOR hasta que el desarrollo de Parte 2 esté suficientemente avanzado como para congelarlo y exportarlo a PDF/docx.

## Control de versiones

Nunca hacer `git commit` (ni `git push`) sin confirmación explícita del usuario en ese momento. Se puede dejar cambios en el working tree o hacer `git add`/`git status`/`git diff` libremente, pero el commit en sí siempre se pregunta antes.

## Al trabajar en taller-2

- No reinventar la arquitectura de información: las 34 páginas y su jerarquía semántica ya están decididas en taller-1. Taller-2 agrega presentación (CSS) y comportamiento (JS/React) por encima, no cambia la estructura.
- Antes de tocar código, revisar si el borrador de Parte 1 (`taller-2/Taller2-Parte1-StayBooker360.md`) ya describe la decisión relevante (paleta, arquitectura CSS, forma de la sesión, etc.) para no contradecirlo sin querer.
