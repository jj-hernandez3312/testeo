import Badge from "react-bootstrap/Badge";
import { formatearFecha } from "../../utils/reglas.js";

const TEXTO_SIN_RIVAL = "Participante por definir";

const variantePorEstado = {
  jugada: "secondary",
  programada: "info",
};

/**
 * Representa una partida dentro de la llave/calendario de un torneo.
 * Cuando el back (o, en EP1/EP2, los datos simulados) todavía no asigna un
 * rival, el campo llega como "Por definir" y este componente lo muestra con
 * un texto explícito en vez de dejar la celda vacía.
 */
export default function LlaveTorneo({ partida }) {
  const participanteB =
    !partida.participanteB || partida.participanteB === "Por definir" ? TEXTO_SIN_RIVAL : partida.participanteB;

  return (
    <li className="llave-torneo__item" data-testid="llave-torneo">
      <div className="llave-torneo__participantes">
        <span>{partida.participanteA}</span>
        <span className="llave-torneo__vs">vs</span>
        <span className={participanteB === TEXTO_SIN_RIVAL ? "text-muted fst-italic" : undefined}>
          {participanteB}
        </span>
      </div>
      <div className="llave-torneo__meta">
        <span>{formatearFecha(partida.horario?.split(" ")[0])}</span>
        <Badge bg={variantePorEstado[partida.estado] || "secondary"}>
          {partida.estado === "jugada" ? "Jugada" : "Programada"}
        </Badge>
      </div>
    </li>
  );
}
