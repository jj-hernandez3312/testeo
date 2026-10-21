// Configuración de Babel usada por babel-loader dentro de karma-webpack
// (no por Vite, que usa su propio transform en modo desarrollo/build).
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { browsers: ["last 2 Chrome versions"] } }],
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
  // Instrumenta el código fuente (no las pruebas) para que karma-coverage
  // pueda reportar el porcentaje de cobertura por archivo.
  plugins: [
    [
      "istanbul",
      {
        exclude: ["**/*.spec.js", "**/*.spec.jsx", "**/test-setup.js"],
      },
    ],
  ],
};
