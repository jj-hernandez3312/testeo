/**
 * Servicio simulado de equipos y jugadores (EP2).
 * Igual que torneosService.js, en EP3 se reemplaza por llamadas HTTP.
 */
import { equipos, jugadores, sanciones, inscripciones } from "../datos/eamData.js";
import {
  obtenerEquipoPorId as buscarEquipoPorId,
  obtenerJugadorPorId as buscarJugadorPorId,
} from "../utils/reglas.js";

export function listarEquipos() {
  return equipos;
}

export function listarJugadores() {
  return jugadores;
}

export function obtenerEquipo(equipoId) {
  return buscarEquipoPorId(equipoId, equipos);
}

export function obtenerJugador(jugadorId) {
  return buscarJugadorPorId(jugadorId, jugadores);
}

export function listarSancionesDeJugador(jugadorId) {
  return sanciones.filter((s) => s.jugadorId === jugadorId);
}

export function equiposDeJugador(jugadorId) {
  return equipos.filter((e) => e.integrantes.some((i) => i.jugadorId === jugadorId));
}

export function historialDeJugador(jugadorId) {
  const idsEquipos = equiposDeJugador(jugadorId).map((e) => e.id);
  return inscripciones.filter(
    (i) =>
      (i.tipoParticipante === "jugador" && i.participanteId === jugadorId) ||
      (i.tipoParticipante === "equipo" && idsEquipos.includes(i.participanteId))
  );
}

/**
 * "Guarda" un equipo nuevo en el arreglo en memoria (simulación de
 * persistencia, como en EP1). Devuelve el equipo creado.
 */
export function crearEquipo({ nombre, juegoId, capitanId, integrantes }) {
  const nuevoId = `e${equipos.length + 1}`;
  const nuevoEquipo = { id: nuevoId, nombre, juegoId, capitanId, activo: true, integrantes };
  equipos.push(nuevoEquipo);
  return nuevoEquipo;
}

export function quitarIntegrante(equipoId, jugadorId) {
  const equipo = obtenerEquipo(equipoId);
  if (!equipo) return null;
  equipo.integrantes = equipo.integrantes.filter((i) => i.jugadorId !== jugadorId);
  return equipo;
}
