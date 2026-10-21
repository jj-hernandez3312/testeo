import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";
import TablaRanking from "../components/torneos/TablaRanking.jsx";
import ListaPartidas from "../components/torneos/ListaPartidas.jsx";
import {
  listarJuegos,
  listarPartidasDeTorneo,
  listarRondasDeTorneo,
  obtenerPremiosDeTorneo,
  obtenerRankingDeTorneo,
  obtenerTorneo,
} from "../servicios/torneosService.js";
import { listarInscripcionesDeTorneo } from "../servicios/torneosService.js";
import { listarEquipos, listarJugadores } from "../servicios/equiposService.js";
import {
  cuposDisponibles,
  etiquetaEstado,
  formatearFecha,
  obtenerEquipoPorId,
  obtenerJugadorPorId,
  obtenerNombreJuego,
  ordenarRanking,
} from "../utils/reglas.js";

/**
 * Vista Detalle de torneo. La ronda visible (`rondaActual`) es estado local:
 * cambiar de pestaña no navega a otra URL, solo vuelve a filtrar y renderizar
 * la lista de partidas, igual que hacía torneo-detalle.js en EP1 pero con
 * useState en vez de reasignar una variable y volver a dibujar el DOM a mano.
 */
export default function TorneoDetalle() {
  const { torneoId } = useParams();
  const juegos = listarJuegos();

  const torneo = obtenerTorneo(torneoId);
  const rondas = useMemo(() => (torneo ? listarRondasDeTorneo(torneo.id) : []), [torneo]);
  const [rondaActual, setRondaActual] = useState(rondas[0] ?? null);

  const rondaSeleccionada = rondaActual ?? rondas[0] ?? null;

  const partidasDeLaRonda = useMemo(() => {
    if (!torneo || rondaSeleccionada == null) return [];
    return listarPartidasDeTorneo(torneo.id).filter((p) => p.ronda === rondaSeleccionada);
  }, [torneo, rondaSeleccionada]);

  const ranking = useMemo(() => {
    if (!torneo) return [];
    return ordenarRanking(obtenerRankingDeTorneo(torneo.id));
  }, [torneo]);

  const inscripciones = torneo ? listarInscripcionesDeTorneo(torneo.id) : [];
  const premios = torneo ? obtenerPremiosDeTorneo(torneo.id) : [];
  const equipos = listarEquipos();
  const jugadores = listarJugadores();

  function nombreDeParticipante(inscripcion) {
    if (inscripcion.tipoParticipante === "equipo") {
      return obtenerEquipoPorId(inscripcion.participanteId, equipos)?.nombre || inscripcion.participanteId;
    }
    return obtenerJugadorPorId(inscripcion.participanteId, jugadores)?.nombre || inscripcion.participanteId;
  }

  if (!torneo) {
    return (
      <Container className="py-5 text-center">
        <h1 className="h4">Torneo no encontrado</h1>
        <p className="texto-tenue">No existe un torneo con el identificador indicado.</p>
        <Link to="/torneos" className="btn btn-primario">
          Volver al listado
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <nav aria-label="breadcrumb" className="mb-2">
        <Link to="/torneos" className="texto-tenue small">
          ← Volver al listado
        </Link>
      </nav>

      <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
        <h1 className="h3 mb-0">{torneo.nombre}</h1>
        <Badge bg="secondary">{etiquetaEstado(torneo.estado)}</Badge>
      </div>
      <p className="texto-tenue">
        {obtenerNombreJuego(torneo.juegoId, juegos)} · {torneo.modalidad} · Inicio{" "}
        {formatearFecha(torneo.fechaInicio)}
      </p>
      <p>{torneo.descripcion}</p>

      <Row className="g-4 mt-2">
        <Col lg={4}>
          <section aria-labelledby="titulo-cupos">
            <h2 id="titulo-cupos" className="h5">
              Cupos
            </h2>
            <p>
              {cuposDisponibles(torneo)} disponibles de {torneo.cupoMaximo}
            </p>
            <Link to={`/inscripcion?torneo=${torneo.id}`} className="btn btn-primario btn-sm">
              Inscribirme
            </Link>
          </section>

          <section className="mt-4" aria-labelledby="titulo-participantes">
            <h2 id="titulo-participantes" className="h5">
              Participantes inscritos
            </h2>
            {inscripciones.length === 0 ? (
              <p className="texto-tenue small">Aún no hay inscripciones registradas.</p>
            ) : (
              <ul className="list-unstyled small">
                {inscripciones.map((i) => (
                  <li key={i.id}>{nombreDeParticipante(i)}</li>
                ))}
              </ul>
            )}
          </section>

          {torneo.estado === "finalizado" && premios.length > 0 && (
            <section className="mt-4" aria-labelledby="titulo-premios">
              <h2 id="titulo-premios" className="h5">
                Premios
              </h2>
              <ul className="small">
                {premios.map((p) => (
                  <li key={`${p.torneoId}-${p.posicion}`}>
                    Posición {p.posicion}: {p.premio}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </Col>

        <Col lg={8}>
          <section aria-labelledby="titulo-partidas">
            <h2 id="titulo-partidas" className="h5">
              Llaves / calendario de partidas
            </h2>
            {rondas.length === 0 ? (
              <p className="texto-tenue small">Este torneo todavía no tiene partidas programadas.</p>
            ) : (
              <>
                <Nav variant="tabs" className="mb-3">
                  {rondas.map((ronda) => (
                    <Nav.Item key={ronda}>
                      <Nav.Link active={ronda === rondaSeleccionada} onClick={() => setRondaActual(ronda)}>
                        Ronda {ronda}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
                <ListaPartidas partidas={partidasDeLaRonda} />
              </>
            )}
          </section>

          <section className="mt-4" aria-labelledby="titulo-ranking">
            <h2 id="titulo-ranking" className="h5">
              Tabla de posiciones
            </h2>
            <TablaRanking filas={ranking} />
          </section>
        </Col>
      </Row>
    </Container>
  );
}
