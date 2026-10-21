import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// eSports Arena Manager - EP2
// Configuración estándar de Vite + React. No se usa SSR ni backend:
// toda la app sigue siendo estática/simulada, consistente con el alcance de EP2.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
