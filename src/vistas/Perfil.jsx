import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import {
  listarJugadores,
  obtenerJugador,
  equiposDeJugador,
  historialDeJugador,
  listarSancionesDeJugador,
} from "../servicios/equiposService.js";
import { obtenerTorneoPorId } from "../utils/reglas.js";
import { torneos } from "../datos/eamData.js";

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

/** Vista Perfil de jugador. El selector simula la sesión (no hay login real hasta EP3). */
export default function Perfil() {
  const { jugadorId: jugadorIdDeRuta } = useParams();
  const navegar = useNavigate();
  const jugadores = listarJugadores();

  const [jugadorId, setJugadorId] = useState(jugadorIdDeRuta || jugadores[0]?.id || "");
  const jugador = obtenerJugador(jugadorId);

  const equipos = useMemo(() => (jugador ? equiposDeJugador(jugador.id) : []), [jugador]);
  const historial = useMemo(() => (jugador ? historialDeJugador(jugador.id) : []), [jugador]);
  const sanciones = useMemo(() => (jugador ? listarSancionesDeJugador(jugador.id) : []), [jugador]);

  const [apodo, setApodo] = useState(jugador?.apodo || "");
  const [password, setPassword] = useState("");
  const [passwordConfirmacion, setPasswordConfirmacion] = useState("");
  const [errores, setErrores] = useState({});
  const [guardado, setGuardado] = useState(false);

  function cambiarJugador(id) {
    setJugadorId(id);
    const jugadorSeleccionado = obtenerJugador(id);
    setApodo(jugadorSeleccionado?.apodo || "");
    setPassword("");
    setPasswordConfirmacion("");
    setErrores({});
    setGuardado(false);
    navegar(`/perfil/${id}`, { replace: true });
  }

  function manejarGuardar(evento) {
    evento.preventDefault();
    const nuevosErrores = {};

    if (!apodo.trim()) nuevosErrores.apodo = "El apodo es obligatorio.";
    else if (/\s/.test(apodo)) nuevosErrores.apodo = "El apodo no admite espacios.";
    else if (apodo.trim().length < 3 || apodo.trim().length > 20) {
      nuevosErrores.apodo = "El apodo debe tener entre 3 y 20 caracteres.";
    }

    if (password && password !== passwordConfirmacion) {
      nuevosErrores.passwordConfirmacion = "Las contraseñas no coinciden.";
    }
    if (password && password.length < 8) {
      nuevosErrores.password = "La contraseña debe tener al menos 8 caracteres.";
    }

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length === 0) {
      setGuardado(true);
      jugador.apodo = apodo.trim(); // simulación: se guarda en memoria, como en EP1
    }
  }

  if (!jugador) {
    return (
      <Container className="py-5 text-center">
        <p className="texto-tenue">No se encontró el jugador seleccionado.</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="h3 mb-4">Perfil de jugador</h1>

      <Form.Group className="mb-4" controlId="selector-jugador" style={{ maxWidth: 360 }}>
        <Form.Label>Ver perfil de</Form.Label>
        <Form.Select value={jugadorId} onChange={(e) => cambiarJugador(e.target.value)}>
          {jugadores.map((j) => (
            <option key={j.id} value={j.id}>
              {j.nombre} ({j.apodo})
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Row className="g-4">
        <Col lg={5}>
          <h2 className="h5">Datos de contacto</h2>
          <Form onSubmit={manejarGuardar} noValidate>
            <Form.Group className="mb-3" controlId="perfil-apodo">
              <Form.Label>Apodo</Form.Label>
              <Form.Control value={apodo} onChange={(e) => setApodo(e.target.value)} isInvalid={!!errores.apodo} />
              <Form.Control.Feedback type="invalid">{errores.apodo}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="perfil-correo">
              <Form.Label>Correo</Form.Label>
              <Form.Control value={jugador.email} disabled readOnly />
            </Form.Group>
            <Form.Group className="mb-3" controlId="perfil-password">
              <Form.Label>Nueva contraseña (opcional)</Form.Label>
              <Form.Control
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!errores.password}
              />
              <Form.Control.Feedback type="invalid">{errores.password}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="perfil-password-confirmacion">
              <Form.Label>Confirmar contraseña</Form.Label>
              <Form.Control
                type="password"
                autoComplete="new-password"
                value={passwordConfirmacion}
                onChange={(e) => setPasswordConfirmacion(e.target.value)}
                isInvalid={!!errores.passwordConfirmacion}
              />
              <Form.Control.Feedback type="invalid">{errores.passwordConfirmacion}</Form.Control.Feedback>
            </Form.Group>
            <button type="submit" className="btn btn-primario">
              Guardar cambios
            </button>
            {guardado && <p className="text-success small mt-2">Perfil actualizado.</p>}
          </Form>
        </Col>

        <Col lg={7}>
          <h2 className="h5">Estadísticas</h2>
          <p>
            {jugador.victorias} victorias · {jugador.derrotas} derrotas
          </p>

          <h2 className="h5 mt-4">Equipos</h2>
          {equipos.length === 0 ? (
            <p className="texto-tenue small">No pertenece a ningún equipo todavía.</p>
          ) : (
            <ul className="small">
              {equipos.map((e) => (
                <li key={e.id}>{e.nombre}</li>
              ))}
            </ul>
          )}

          <h2 className="h5 mt-4">Historial de torneos</h2>
          {historial.length === 0 ? (
            <p className="texto-tenue small">Sin inscripciones registradas.</p>
          ) : (
            <ul className="small">
              {historial.map((i) => (
                <li key={i.id}>{obtenerTorneoPorId(i.torneoId, torneos)?.nombre}</li>
              ))}
            </ul>
          )}

          <h2 className="h5 mt-4">Sanciones</h2>
          {sanciones.length === 0 ? (
            <p className="texto-tenue small">Sin sanciones registradas.</p>
          ) : (
            <ul className="list-unstyled small">
              {sanciones.map((s) => (
                <li key={s.id} className="mb-1">
                  <Badge bg={s.vigente ? "danger" : "secondary"}>{s.vigente ? "Vigente" : "Cumplida"}</Badge>{" "}
                  {s.motivo}
                </li>
              ))}
            </ul>
          )}
        </Col>
      </Row>
    </Container>
  );
}
