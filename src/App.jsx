import { Routes, Route } from "react-router-dom";
import Cabecera from "./components/layout/Cabecera.jsx";
import PieDePagina from "./components/layout/PieDePagina.jsx";
import Inicio from "./vistas/Inicio.jsx";
import Torneos from "./vistas/Torneos.jsx";
import TorneoDetalle from "./vistas/TorneoDetalle.jsx";
import Inscripcion from "./vistas/Inscripcion.jsx";
import Equipo from "./vistas/Equipo.jsx";
import Perfil from "./vistas/Perfil.jsx";
import NoEncontrado from "./vistas/NoEncontrado.jsx";

/**
 * Enrutamiento de cliente (React Router) en reemplazo de los hipervínculos
 * entre páginas .html de EP1. Las rutas lógicas se mantienen: "/" (antes
 * index.html), "/torneos" (torneos.html), "/torneos/:id" (torneo-detalle.html
 * con ?id=), "/inscripcion", "/equipo" y "/perfil".
 */
export default function App() {
  return (
    <div className="app-shell d-flex flex-column min-vh-100">
      <Cabecera />
      <main id="contenido" className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/torneos" element={<Torneos />} />
          <Route path="/torneos/:torneoId" element={<TorneoDetalle />} />
          <Route path="/inscripcion" element={<Inscripcion />} />
          <Route path="/equipo" element={<Equipo />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/perfil/:jugadorId" element={<Perfil />} />
          <Route path="*" element={<NoEncontrado />} />
        </Routes>
      </main>
      <PieDePagina />
    </div>
  );
}
