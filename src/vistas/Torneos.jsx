import { useMemo, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import TarjetaTorneo from "../components/torneos/TarjetaTorneo.jsx";
import EstadoVacio from "../components/EstadoVacio.jsx";
import { listarTorneos, listarJuegos } from "../servicios/torneosService.js";

/** Vista Listado de torneos: filtros por juego, estado, rango de fechas y texto. */
export default function Torneos() {
  const torneos = listarTorneos();
  const juegos = listarJuegos();

  const [texto, setTexto] = useState("");
  const [juegoId, setJuegoId] = useState("");
  const [estado, setEstado] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const errorFechas = desde && hasta && desde > hasta ? "La fecha 'desde' no puede ser posterior a la fecha 'hasta'." : "";

  const filtrados = useMemo(() => {
    if (errorFechas) return [];
    const textoNormalizado = texto.trim().toLowerCase();

    return torneos.filter((t) => {
      const coincideTexto = !textoNormalizado || t.nombre.toLowerCase().includes(textoNormalizado);
      const coincideJuego = !juegoId || t.juegoId === juegoId;
      const coincideEstado = !estado || t.estado === estado;
      const coincideDesde = !desde || t.fechaCierreInscripcion >= desde;
      const coincideHasta = !hasta || t.fechaCierreInscripcion <= hasta;
      return coincideTexto && coincideJuego && coincideEstado && coincideDesde && coincideHasta;
    });
  }, [torneos, texto, juegoId, estado, desde, hasta, errorFechas]);

  return (
    <Container className="py-4">
      <h1 className="h3 mb-4">Torneos</h1>

      <Form className="mb-4" aria-label="Filtros de torneos">
        <Row className="g-3 align-items-end">
          <Col md={4}>
            <Form.Group controlId="filtro-busqueda">
              <Form.Label>Buscar por nombre</Form.Label>
              <Form.Control
                type="search"
                placeholder="Ej: Copa Apertura"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3} sm={6}>
            <Form.Group controlId="filtro-juego">
              <Form.Label>Juego</Form.Label>
              <Form.Select value={juegoId} onChange={(e) => setJuegoId(e.target.value)}>
                <option value="">Todos</option>
                {juegos.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2} sm={6}>
            <Form.Group controlId="filtro-estado">
              <Form.Label>Estado</Form.Label>
              <Form.Select value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="">Todos</option>
                <option value="abierto">Abierto</option>
                <option value="en-curso">En curso</option>
                <option value="finalizado">Finalizado</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2} sm={6}>
            <Form.Group controlId="filtro-desde">
              <Form.Label>Cierre desde</Form.Label>
              <Form.Control type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={1} sm={6}>
            <Form.Group controlId="filtro-hasta">
              <Form.Label>Hasta</Form.Label>
              <Form.Control type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
            </Form.Group>
          </Col>
        </Row>
        {errorFechas && (
          <p className="text-danger small mt-2" role="alert" id="error-fechas">
            {errorFechas}
          </p>
        )}
      </Form>

      <p className="texto-tenue small" aria-live="polite">
        {filtrados.length} {filtrados.length === 1 ? "torneo encontrado" : "torneos encontrados"}
      </p>

      {filtrados.length === 0 ? (
        <EstadoVacio mensaje="Ningún torneo coincide con los filtros aplicados." />
      ) : (
        <Row xs={1} md={2} lg={3} className="g-3">
          {filtrados.map((torneo) => (
            <Col key={torneo.id}>
              <TarjetaTorneo torneo={torneo} juegos={juegos} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
