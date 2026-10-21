import { useMemo, useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import {
  cuposDisponibles,
  equipoCompleto,
  inscripcionFueraDePlazo,
  obtenerEquipoPorId,
  obtenerJuegoPorId,
  obtenerNombreJuego,
  obtenerTorneoPorId,
  tieneSancionActiva,
  yaInscrito,
} from "../../utils/reglas.js";

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

/**
 * Formulario controlado de inscripción (migrado desde js/inscripcion.js de EP1).
 * Toda la lógica de validación vive en reglas.js; este componente solo la
 * invoca y mantiene el estado de los campos con useState.
 *
 * Props:
 * - torneos, juegos, jugadores, equipos, inscripciones, sanciones: catálogos (arrays)
 * - onConfirmar(datosInscripcion): se llama solo cuando el formulario es válido
 */
export default function FormularioInscripcion({
  torneos,
  juegos,
  jugadores,
  equipos,
  inscripciones,
  sanciones,
  onConfirmar,
}) {
  const [torneoId, setTorneoId] = useState(torneos[0]?.id || "");
  const [tipo, setTipo] = useState("jugador");
  const [jugadorId, setJugadorId] = useState(jugadores[0]?.id || "");
  const [equipoId, setEquipoId] = useState(equipos[0]?.id || "");
  const [edad, setEdad] = useState("");
  const [contacto, setContacto] = useState("");
  const [terminos, setTerminos] = useState(false);
  const [errores, setErrores] = useState({});
  const [confirmacion, setConfirmacion] = useState(null);

  const torneo = useMemo(() => obtenerTorneoPorId(torneoId, torneos), [torneoId, torneos]);
  const equipoSeleccionado = useMemo(() => obtenerEquipoPorId(equipoId, equipos), [equipoId, equipos]);
  const juegoDelTorneo = torneo ? obtenerJuegoPorId(torneo.juegoId, juegos) : null;

  // Motivos de bloqueo que se muestran ANTES de intentar enviar (igual que en EP1)
  const motivosBloqueo = useMemo(() => {
    if (!torneo) return [];
    const motivos = [];

    if (inscripcionFueraDePlazo(torneo)) {
      motivos.push("El plazo de inscripción para este torneo ya cerró.");
    }
    if (cuposDisponibles(torneo) <= 0) {
      motivos.push("Este torneo ya no tiene cupos disponibles.");
    }

    if (tipo === "jugador" && jugadorId) {
      if (tieneSancionActiva(jugadorId, sanciones)) {
        motivos.push("El jugador seleccionado tiene una sanción vigente y no puede inscribirse.");
      }
      if (yaInscrito(torneo.id, jugadorId, inscripciones)) {
        motivos.push("Este jugador ya está inscrito en este torneo.");
      }
    }

    if (tipo === "equipo" && equipoSeleccionado) {
      if (!equipoSeleccionado.activo) {
        motivos.push("El equipo está inactivo y no puede inscribirse.");
      } else if (!equipoCompleto(equipoSeleccionado, juegos)) {
        motivos.push(
          `El equipo no tiene los integrantes mínimos exigidos por ${obtenerNombreJuego(torneo.juegoId, juegos)}.`
        );
      } else if (yaInscrito(torneo.id, equipoSeleccionado.id, inscripciones)) {
        motivos.push("Este equipo ya está inscrito en este torneo.");
      }
    }

    return motivos;
  }, [torneo, tipo, jugadorId, equipoSeleccionado, inscripciones, sanciones, juegos]);

  const envioBloqueado = !torneo || motivosBloqueo.length > 0;

  function validarCamposDeFormato() {
    const nuevosErrores = {};
    const edadNumero = Number(edad);

    if (!edad || Number.isNaN(edadNumero) || edadNumero < 13 || edadNumero > 99) {
      nuevosErrores.edad = "Ingresa una edad válida entre 13 y 99 años.";
    }
    if (!REGEX_CORREO.test(contacto.trim())) {
      nuevosErrores.contacto = "Ingresa un correo electrónico con formato válido.";
    }
    if (!terminos) {
      nuevosErrores.terminos = "Debes aceptar el reglamento del torneo para continuar.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    if (envioBloqueado) return; // el botón ya está disabled, esto es una segunda barrera
    if (!validarCamposDeFormato()) return;

    const nombreParticipante =
      tipo === "equipo" ? equipoSeleccionado?.nombre : jugadores.find((j) => j.id === jugadorId)?.nombre;

    const datos = { torneoId, tipo, participanteId: tipo === "equipo" ? equipoId : jugadorId, contacto };
    setConfirmacion(`${nombreParticipante} quedó inscrito en "${torneo.nombre}". Se enviará confirmación a ${contacto}.`);
    onConfirmar?.(datos);
  }

  return (
    <Form noValidate onSubmit={manejarEnvio} data-testid="formulario-inscripcion">
      <Row className="g-3">
        <Col md={6}>
          <Form.Group controlId="campo-torneo">
            <Form.Label>Torneo</Form.Label>
            <Form.Select value={torneoId} onChange={(e) => setTorneoId(e.target.value)}>
              {torneos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre} ({obtenerNombreJuego(t.juegoId, juegos)})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label as="legend" className="col-form-label pt-0">
              Tipo de participante
            </Form.Label>
            <div className="d-flex gap-3">
              <Form.Check
                type="radio"
                id="tipo-jugador"
                name="tipoParticipante"
                label="Jugador individual"
                checked={tipo === "jugador"}
                onChange={() => setTipo("jugador")}
              />
              <Form.Check
                type="radio"
                id="tipo-equipo"
                name="tipoParticipante"
                label="Equipo"
                checked={tipo === "equipo"}
                onChange={() => setTipo("equipo")}
              />
            </div>
          </Form.Group>
        </Col>

        {tipo === "jugador" ? (
          <Col md={6}>
            <Form.Group controlId="campo-jugador">
              <Form.Label>Jugador</Form.Label>
              <Form.Select value={jugadorId} onChange={(e) => setJugadorId(e.target.value)}>
                {jugadores.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.nombre} ({j.apodo})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        ) : (
          <Col md={6}>
            <Form.Group controlId="campo-equipo">
              <Form.Label>Equipo</Form.Label>
              <Form.Select value={equipoId} onChange={(e) => setEquipoId(e.target.value)}>
                {equipos.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                    {e.activo ? "" : " (inactivo)"}
                  </option>
                ))}
              </Form.Select>
              {juegoDelTorneo && (
                <Form.Text className="text-muted">
                  Requiere al menos {juegoDelTorneo.integrantesPorEquipo} integrantes.
                </Form.Text>
              )}
            </Form.Group>
          </Col>
        )}

        <Col md={4}>
          <Form.Group controlId="campo-edad">
            <Form.Label>Edad</Form.Label>
            <Form.Control
              type="number"
              min={13}
              max={99}
              autoComplete="off"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
              isInvalid={!!errores.edad}
            />
            <Form.Control.Feedback type="invalid">{errores.edad}</Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={8}>
          <Form.Group controlId="campo-contacto">
            <Form.Label>Correo de contacto</Form.Label>
            <Form.Control
              type="email"
              autoComplete="email"
              placeholder="nombre@correo.cl"
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              isInvalid={!!errores.contacto}
            />
            <Form.Control.Feedback type="invalid">{errores.contacto}</Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col xs={12}>
          <Form.Group controlId="campo-terminos">
            <Form.Check
              type="checkbox"
              label="Acepto el reglamento del torneo"
              checked={terminos}
              onChange={(e) => setTerminos(e.target.checked)}
              isInvalid={!!errores.terminos}
              feedback={errores.terminos}
              feedbackType="invalid"
            />
          </Form.Group>
        </Col>
      </Row>

      {motivosBloqueo.length > 0 && (
        <Alert variant="warning" className="mt-3" data-testid="alerta-bloqueo">
          {motivosBloqueo.join(" ")}
        </Alert>
      )}

      {confirmacion && (
        <Alert variant="success" className="mt-3" data-testid="alerta-confirmacion">
          {confirmacion}
        </Alert>
      )}

      <Button type="submit" className="mt-3" disabled={envioBloqueado} data-testid="boton-inscribir">
        Confirmar inscripción
      </Button>
    </Form>
  );
}
