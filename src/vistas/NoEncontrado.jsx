import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";

export default function NoEncontrado() {
  return (
    <Container className="py-5 text-center">
      <h1 className="h3">Página no encontrada</h1>
      <p className="texto-tenue">La dirección a la que intentaste acceder no existe.</p>
      <Link to="/" className="btn btn-primario">
        Volver al inicio
      </Link>
    </Container>
  );
}
