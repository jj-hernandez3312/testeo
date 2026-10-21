import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import ProgressBar from "react-bootstrap/ProgressBar";
import { cuposDisponibles, etiquetaEstado, formatearFecha, obtenerNombreJuego } from "../../utils/reglas.js";

const variantePorEstado = {
  abierto: "success",
  "en-curso": "warning",
  finalizado: "secondary",
};

/**
 * Tarjeta reutilizable de torneo. Usada en Inicio (destacados) y en el
 * Listado de torneos. Recibe todo por props: no conoce de dónde vienen los
 * datos ni cómo se filtraron.
 */
export default function TarjetaTorneo({ torneo, juegos }) {
  const cupos = cuposDisponibles(torneo);
  const porcentajeOcupado = Math.round((torneo.cupoOcupado / torneo.cupoMaximo) * 100);

  return (
    <Card className="tarjeta-torneo h-100" data-testid="tarjeta-torneo">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <Card.Title as="h3" className="h5 mb-1">
            {torneo.nombre}
          </Card.Title>
          <Badge bg={variantePorEstado[torneo.estado] || "secondary"}>{etiquetaEstado(torneo.estado)}</Badge>
        </div>
        <Card.Subtitle className="text-muted mb-2">
          {obtenerNombreJuego(torneo.juegoId, juegos)} · {torneo.modalidad}
        </Card.Subtitle>
        <p className="small mb-2">
          Cierre de inscripción: <strong>{formatearFecha(torneo.fechaCierreInscripcion)}</strong>
        </p>
        <div className="mb-3">
          <ProgressBar
            now={porcentajeOcupado}
            label={`${torneo.cupoOcupado}/${torneo.cupoMaximo}`}
            aria-label={`Cupos ocupados: ${torneo.cupoOcupado} de ${torneo.cupoMaximo}`}
          />
          <span className="small text-muted">{cupos} cupos disponibles</span>
        </div>
        <Link to={`/torneos/${torneo.id}`} className="btn btn-primario mt-auto">
          Ver detalle
        </Link>
      </Card.Body>
    </Card>
  );
}
