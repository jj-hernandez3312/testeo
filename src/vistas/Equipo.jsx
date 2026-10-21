import { useMemo, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import { listarEquipos, listarJugadores, crearEquipo, quitarIntegrante } from "../servicios/equiposService.js";
import { listarJuegos } from "../servicios/torneosService.js";
import { obtenerJugadorPorId, obtenerNombreJuego } from "../utils/reglas.js";

/**
 * Vista Gestión de equipo. `integrantesNuevoEquipo` es estado local que vive
 * solo mientras se arma el formulario: no se guarda hasta pulsar "Crear equipo".
 */
export default function Equipo() {
  const juegos = listarJuegos();
  const jugadores = listarJugadores();
  const [equipos, setEquipos] = useState(() => listarEquipos());

  const [nombre, setNombre] = useState("");
  const [juegoId, setJuegoId] = useState(juegos[0]?.id || "");
  const [capitanId, setCapitanId] = useState("");
  const [integrantesNuevoEquipo, setIntegrantesNuevoEquipo] = useState([]);
  const [jugadorAAgregar, setJugadorAAgregar] = useState("");
  const [errores, setErrores] = useState({});

  const jugadoresDisponibles = useMemo(
    () => jugadores.filter((j) => !integrantesNuevoEquipo.includes(j.id)),
    [jugadores, integrantesNuevoEquipo]
  );

  function agregarIntegrante() {
    if (!jugadorAAgregar) return;
    if (integrantesNuevoEquipo.includes(jugadorAAgregar)) return;
    setIntegrantesNuevoEquipo((previos) => [...previos, jugadorAAgregar]);
    setJugadorAAgregar("");
  }

  function quitarIntegranteNuevo(jugadorId) {
    setIntegrantesNuevoEquipo((previos) => previos.filter((id) => id !== jugadorId));
  }

  function manejarCreacion(evento) {
    evento.preventDefault();
    const nuevosErrores = {};

    if (!nombre.trim()) nuevosErrores.nombre = "El nombre del equipo es obligatorio.";
    else if (equipos.some((e) => e.nombre.toLowerCase() === nombre.trim().toLowerCase())) {
      nuevosErrores.nombre = "Ya existe un equipo con ese nombre.";
    }
    if (!capitanId) nuevosErrores.capitan = "Debes indicar un capitán.";
    if (integrantesNuevoEquipo.length === 0) nuevosErrores.integrantes = "Agrega al menos un integrante.";

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const integrantesFinales = integrantesNuevoEquipo.map((jugadorId) => ({
      jugadorId,
      rol: jugadorId === capitanId ? "Capitán" : "Integrante",
    }));

    const nuevoEquipo = crearEquipo({ nombre: nombre.trim(), juegoId, capitanId, integrantes: integrantesFinales });
    setEquipos((previos) => [...previos, nuevoEquipo]);
    setNombre("");
    setCapitanId("");
    setIntegrantesNuevoEquipo([]);
  }

  function manejarQuitarDeEquipoExistente(equipoId, jugadorId) {
    const actualizado = quitarIntegrante(equipoId, jugadorId);
    setEquipos((previos) => previos.map((e) => (e.id === equipoId ? { ...actualizado } : e)));
  }

  return (
    <Container className="py-4">
      <h1 className="h3 mb-4">Gestión de equipo</h1>

      <Row className="g-4">
        <Col lg={5}>
          <h2 className="h5">Crear equipo</h2>
          <Form onSubmit={manejarCreacion} noValidate>
            <Form.Group className="mb-3" controlId="equipo-nombre">
              <Form.Label>Nombre del equipo</Form.Label>
              <Form.Control
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                isInvalid={!!errores.nombre}
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="equipo-juego">
              <Form.Label>Juego principal</Form.Label>
              <Form.Select value={juegoId} onChange={(e) => setJuegoId(e.target.value)}>
                {juegos.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="equipo-capitan">
              <Form.Label>Capitán</Form.Label>
              <Form.Select
                value={capitanId}
                onChange={(e) => setCapitanId(e.target.value)}
                isInvalid={!!errores.capitan}
              >
                <option value="">Selecciona un jugador</option>
                {integrantesNuevoEquipo.map((id) => {
                  const jugador = obtenerJugadorPorId(id, jugadores);
                  return (
                    <option key={id} value={id}>
                      {jugador?.nombre}
                    </option>
                  );
                })}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errores.capitan}</Form.Control.Feedback>
              {integrantesNuevoEquipo.length === 0 && (
                <Form.Text className="text-muted">Agrega integrantes primero para poder elegir capitán.</Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-2" controlId="equipo-integrante-nuevo">
              <Form.Label>Agregar integrante</Form.Label>
              <div className="d-flex gap-2">
                <Form.Select value={jugadorAAgregar} onChange={(e) => setJugadorAAgregar(e.target.value)}>
                  <option value="">Selecciona un jugador</option>
                  {jugadoresDisponibles.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.nombre} ({j.apodo})
                    </option>
                  ))}
                </Form.Select>
                <Button variant="secondary" type="button" onClick={agregarIntegrante}>
                  Agregar
                </Button>
              </div>
              {errores.integrantes && <p className="text-danger small mt-1">{errores.integrantes}</p>}
            </Form.Group>

            {integrantesNuevoEquipo.length > 0 && (
              <ul className="list-group mb-3">
                {integrantesNuevoEquipo.map((id) => {
                  const jugador = obtenerJugadorPorId(id, jugadores);
                  return (
                    <li key={id} className="list-group-item d-flex justify-content-between align-items-center">
                      {jugador?.nombre}
                      <Button size="sm" variant="outline-secondary" onClick={() => quitarIntegranteNuevo(id)}>
                        Quitar
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}

            <Button type="submit" className="btn-primario">
              Crear equipo
            </Button>
          </Form>
        </Col>

        <Col lg={7}>
          <h2 className="h5">Equipos existentes</h2>
          <Row xs={1} md={2} className="g-3">
            {equipos.map((equipo) => (
              <Col key={equipo.id}>
                <Card className="h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <Card.Title className="h6">{equipo.nombre}</Card.Title>
                      <Badge bg={equipo.activo ? "success" : "secondary"}>
                        {equipo.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    <p className="small texto-tenue mb-2">{obtenerNombreJuego(equipo.juegoId, juegos)}</p>
                    <ul className="list-unstyled small mb-0">
                      {equipo.integrantes.map((integrante) => {
                        const jugador = obtenerJugadorPorId(integrante.jugadorId, jugadores);
                        return (
                          <li key={integrante.jugadorId} className="d-flex justify-content-between align-items-center py-1">
                            <span>
                              {jugador?.nombre} · <span className="texto-tenue">{integrante.rol}</span>
                            </span>
                            <Button
                              size="sm"
                              variant="link"
                              className="text-danger p-0"
                              onClick={() => manejarQuitarDeEquipoExistente(equipo.id, integrante.jugadorId)}
                            >
                              Quitar
                            </Button>
                          </li>
                        );
                      })}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
