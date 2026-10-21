/**
 * Servicio simulado de torneos (EP2).
 *
 * Centraliza el acceso a los datos de torneos para que los componentes no
 * importen `datos/eamData.js` directamente. Hoy lee de memoria; en EP3 cada
 * función se reemplaza por un `fetch` a la URL base de la API (parametrizada
 * por variable de entorno) sin que las vistas que la consumen cambien.
 */
import { torneos, juegos, inscripciones, partidas, resultados, rankings, premios } from "../datos/eamData.js";
import { obtenerTorneoPorId as buscarTorneoPorId } from "../utils/reglas.js";

export function listarTorneos() {
  return torneos;
}

export function listarJuegos() {
  return juegos;
}

export function obtenerTorneo(torneoId) {
  return buscarTorneoPorId(torneoId, torneos);
}

export function listarInscripcionesDeTorneo(torneoId) {
  return inscripciones.filter((i) => i.torneoId === torneoId);
}

export function listarPartidasDeTorneo(torneoId) {
  return partidas.filter((p) => p.torneoId === torneoId);
}

export function listarRondasDeTorneo(torneoId) {
  const rondas = listarPartidasDeTorneo(torneoId).map((p) => p.ronda);
  return [...new Set(rondas)].sort((a, b) => a - b);
}

export function obtenerResultadosDeTorneo(torneoId) {
  const idsPartidas = listarPartidasDeTorneo(torneoId).map((p) => p.id);
  return resultados.filter((r) => idsPartidas.includes(r.partidaId));
}

export function obtenerRankingDeTorneo(torneoId) {
  return rankings[torneoId] || [];
}

export function obtenerPremiosDeTorneo(torneoId) {
  return premios.filter((p) => p.torneoId === torneoId);
}
