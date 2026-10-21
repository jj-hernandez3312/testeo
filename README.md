# eSports Arena Manager — Frontend (EP2: migración a React)

Proyecto semestral de **Desarrollo FullStack II (DSY1104)**. EP2 migra la base
construida en EP1 (HTML5 + CSS3 + JavaScript vanilla) a **React 18** con
**Bootstrap 5**, enrutamiento de cliente con **React Router** y pruebas
unitarias con **Jasmine + Karma**. El alcance funcional de las seis vistas no
cambia respecto a EP1: lo que cambia es la implementación.

## Integrantes

- Nicolás Molina
- Sebastián Cabrera
- José Hernández

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- Un navegador Chrome o Chromium instalado (lo usa Karma para correr las pruebas)

## Instalación

```bash
npm install
```

## Ejecución en desarrollo

```bash
npm run dev
```

Levanta el servidor de Vite en `http://localhost:5173`.

## Build de producción

```bash
npm run build
npm run preview   # sirve dist/ en http://localhost:4173 para revisarlo
```

## Pruebas unitarias

```bash
# Karma necesita saber dónde está el binario de Chrome/Chromium si no lo
# detecta automáticamente en tu sistema:
CHROME_BIN=/ruta/a/chrome npm test

# Modo observador mientras desarrollas nuevas pruebas:
npm run test:watch
```

La suite corre 19 pruebas con Jasmine (las 10 obligatorias del caso más 9
adicionales de casos borde) y genera un reporte de cobertura en `coverage/`
(`coverage/html/index.html` para el detalle línea por línea). El detalle de
qué cubre cada prueba y los porcentajes de cobertura por archivo están en
`Documento_Cobertura_Testing_EP2.docx`.

## Estructura de carpetas

```
eam-frontend-react/
├── index.html
├── vite.config.js          # configuración de Vite + plugin de React
├── karma.conf.cjs          # configuración de Karma (karma-jasmine + karma-webpack)
├── babel.config.cjs        # Babel usado solo por karma-webpack (no por Vite)
├── src/
│   ├── main.jsx             # punto de entrada: monta <App /> con BrowserRouter
│   ├── App.jsx               # define las rutas con React Router
│   ├── index.css             # paleta "Táctico rojo" sobre variables de Bootstrap 5
│   ├── test-setup.js          # habilita el modo act() de React 18 para las pruebas
│   ├── datos/
│   │   └── eamData.js         # datos simulados (equivalente a js/data.js de EP1)
│   ├── servicios/             # capa de "servicios simulados": en EP3 se
│   │   │                      # reemplaza cada función por un fetch a la API
│   │   ├── torneosService.js
│   │   ├── equiposService.js
│   │   └── inscripcionesService.js
│   ├── utils/
│   │   ├── reglas.js           # lógica de negocio pura (equivalente a utils.js de EP1)
│   │   └── reglas.spec.js      # pruebas 1-6 del listado obligatorio
│   ├── components/
│   │   ├── layout/             # Cabecera, PieDePagina (comunes a las 6 vistas)
│   │   ├── torneos/            # TarjetaTorneo, TablaRanking, LlaveTorneo, ListaPartidas (+ specs)
│   │   ├── equipo/             # FormularioInscripcion (+ spec)
│   │   └── EstadoVacio.jsx
│   └── vistas/                 # las 6 vistas obligatorias + página 404
│       ├── Inicio.jsx
│       ├── Torneos.jsx
│       ├── TorneoDetalle.jsx
│       ├── Inscripcion.jsx
│       ├── Equipo.jsx
│       ├── Perfil.jsx
│       └── NoEncontrado.jsx
└── Documento_Cobertura_Testing_EP2.docx
```

## Rutas de la aplicación

| Ruta | Vista | Equivalente en EP1 |
| --- | --- | --- |
| `/` | Inicio | `index.html` |
| `/torneos` | Listado de torneos | `torneos.html` |
| `/torneos/:torneoId` | Detalle de torneo | `torneo-detalle.html?id=` |
| `/inscripcion` | Inscripción a torneo | `inscripcion.html` |
| `/equipo` | Gestión de equipo | `equipo.html` |
| `/perfil` y `/perfil/:jugadorId` | Perfil de jugador | `perfil.html` |

## Qué cambió respecto a EP1

- **Componentes en vez de funciones que manipulan el DOM**: `TarjetaTorneo`,
  `TablaRanking`, `LlaveTorneo` y `FormularioInscripcion` reciben datos por
  props y manejan su propio estado con `useState`/`useEffect`.
- **Enrutamiento de cliente**: React Router reemplaza los `<a href="...">`
  entre páginas `.html`; las rutas lógicas son las mismas.
- **Formularios controlados**: la validación vive en `reglas.js` (funciones
  puras) y los componentes solo la invocan; los mensajes de error personalizados
  se mantienen.
- **Bootstrap 5** para la grilla y los componentes de interfaz, con la paleta
  "Táctico rojo" de EP1 declarada como variables CSS que sobrescriben las de
  Bootstrap (`src/index.css`), verificado en 360px, 768px y 1280px.
- **Pruebas unitarias** con Jasmine + Karma, incluyendo dobles de prueba
  (`jasmine.createSpy`) para aislar componentes de sus manejadores.

## Próximos pasos (EP3)

En EP3 la capa `src/servicios/` deja de leer `src/datos/eamData.js` en memoria
y pasa a hacer llamadas HTTP contra el API Gateway del ecosistema de
microservicios, con autenticación JWT y control de acceso por rol.
