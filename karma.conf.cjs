// Configuración de Karma para eSports Arena Manager (EP2)
// Stack exigido por el Caso: karma + karma-jasmine + jasmine-core +
// karma-chrome-launcher + karma-webpack + babel-loader (preset-react) + karma-coverage.
const path = require("path");

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "webpack"],

    // Todas las pruebas viven junto al código que prueban, como *.spec.js / *.spec.jsx
    files: ["src/test-setup.js", "src/**/*.spec.js", "src/**/*.spec.jsx"],

    preprocessors: {
      "src/test-setup.js": ["webpack"],
      "src/**/*.spec.js": ["webpack"],
      "src/**/*.spec.jsx": ["webpack"],
    },

    webpack: {
      mode: "development",
      resolve: {
        extensions: [".js", ".jsx"],
      },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                configFile: path.resolve(__dirname, "babel.config.cjs"),
              },
            },
          },
        ],
      },
      devtool: "inline-source-map",
    },

    webpackMiddleware: {
      stats: "errors-only",
    },

    reporters: ["spec", "coverage"],

    coverageReporter: {
      dir: "coverage/",
      reporters: [
        { type: "html", subdir: "html" },
        { type: "text-summary" },
        { type: "json-summary", subdir: "." },
      ],
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,

    browsers: ["ChromeHeadlessCI"],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox", "--disable-gpu"],
      },
    },

    singleRun: true,
    concurrency: Infinity,
  });
};
