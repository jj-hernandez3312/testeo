// Habilita el modo "act" de React en el entorno de pruebas (Karma + Chrome headless),
// requerido por React 18 para que `act()` de react-dom/test-utils funcione sin advertencias.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
