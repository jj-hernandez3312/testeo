/**
 * Servicio simulado de inscripciones (EP2).
 */
import { inscripciones } from "../datos/eamData.js";
import { yaInscrito as revisarYaInscrito } from "../utils/reglas.js";

export function yaInscrito(torneoId, participanteId) {
  return revisarYaInscrito(torneoId, participanteId, inscripciones);
}

/** Registra una nueva inscripción en memoria y la devuelve. */
export function crearInscripcion({ torneoId, participanteId, tipoParticipante }) {
  const nuevaInscripcion = {
    id: `i${inscripciones.length + 1}`,
    torneoId,
    participanteId,
    tipoParticipante,
    fecha: new Date().toISOString().slice(0, 10),
  };
  inscripciones.push(nuevaInscripcion);
  return nuevaInscripcion;
}
