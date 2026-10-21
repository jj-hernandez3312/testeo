import Container from "react-bootstrap/Container";
import { useSearchParams } from "react-router-dom";
import FormularioInscripcion from "../components/equipo/FormularioInscripcion.jsx";
import { listarTorneos, listarJuegos } from "../servicios/torneosService.js";
import { listarEquipos, listarJugadores } from "../servicios/equiposService.js";
import { crearInscripcion } from "../servicios/inscripcionesService.js";
import { sanciones, inscripciones } from "../datos/eamData.js";

/** Vista Inscripción: formulario principal del dominio. */
export default function Inscripcion() {
  const [parametros] = useSearchParams();
  const torneoPreseleccionado = parametros.get("torneo");

  const torneos = listarTorneos();
  const juegos = listarJuegos();
  const jugadores = listarJugadores();
  const equipos = listarEquipos();

  function manejarConfirmacion(datos) {
    crearInscripcion(datos);
  }

  return (
    <Container className="py-4" style={{ maxWidth: 760 }}>
      <h1 className="h3 mb-1">Inscripción a torneo</h1>
      <p className="texto-tenue mb-4">
        Registra la participación de un jugador individual o de un equipo completo.
      </p>
      <FormularioInscripcion
        torneos={
          torneoPreseleccionado
            ? [...torneos].sort((a, b) => (a.id === torneoPreseleccionado ? -1 : b.id === torneoPreseleccionado ? 1 : 0))
            : torneos
        }
        juegos={juegos}
        jugadores={jugadores}
        equipos={equipos}
        inscripciones={inscripciones}
        sanciones={sanciones}
        onConfirmar={manejarConfirmacion}
      />
    </Container>
  );
}
