/**
 * Pie de página común. El año se calcula con useState/useEffect en vez del
 * manipulado directo del DOM que usaba comun.js en EP1.
 */
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";

export default function PieDePagina() {
  const [anio, setAnio] = useState(() => new Date().getFullYear());

  useEffect(() => {
    setAnio(new Date().getFullYear());
  }, []);

  return (
    <footer className="pie-pagina">
      <Container className="d-flex flex-column flex-sm-row justify-content-between gap-2 py-3">
        <span>© {anio} eSports Arena Manager. Proyecto académico DSY1104.</span>
        <nav aria-label="Enlaces secundarios" className="pie-pagina__enlaces">
          <a href="#inicio">Volver arriba</a>
        </nav>
      </Container>
    </footer>
  );
}
