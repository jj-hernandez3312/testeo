import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

const enlaces = [
  { to: "/", etiqueta: "Inicio", fin: true },
  { to: "/torneos", etiqueta: "Torneos" },
  { to: "/inscripcion", etiqueta: "Inscripción" },
  { to: "/equipo", etiqueta: "Equipo" },
  { to: "/perfil", etiqueta: "Perfil" },
];

/**
 * Cabecera común a las 6 vistas: marca + menú de navegación.
 * Usa NavLink para que React Router marque automáticamente el enlace activo
 * (equivalente al atributo aria-current que EP1 fijaba a mano en comun.js).
 */
export default function Cabecera() {
  return (
    <Navbar expand="md" className="cabecera" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="cabecera__marca">
          <span aria-hidden="true">🎮</span> eSports Arena Manager
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="nav-principal" />
        <Navbar.Collapse id="nav-principal">
          <Nav as="ul" className="ms-auto nav-lista">
            {enlaces.map((enlace) => (
              <Nav.Item as="li" key={enlace.to}>
                <Nav.Link as={NavLink} to={enlace.to} end={enlace.fin}>
                  {enlace.etiqueta}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
