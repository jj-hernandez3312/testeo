/**
 * eSports Arena Manager (EP2) - Reglas de negocio puras.
 *
 * Estas funciones no dependen de React ni del DOM: reciben los datos que
 * necesitan como parámetros y devuelven un resultado, por eso son las más
 * fáciles de cubrir con pruebas unitarias (ver reglas.spec.js). Los
 * componentes y servicios las importan y les pasan los datos de
 * src/datos/eamData.js (o, en EP3, los datos que lleguen de la API).
 */

/** Busca el nombre de un juego por id; si no existe, devuelve un texto por defecto. */
export function obtenerNombreJuego(juegoId, juegos) {
  const juego = juegos.find((j) => j.id === juegoId);
  return juego ? juego.nombre : "Juego no disponible";
}

export function obtenerJuegoPorId(juegoId, juegos) {
  return juegos.find((j) => j.id === juegoId) || null;
}

export function obtenerTorneoPorId(torneoId, torneos) {
  return torneos.find((t) => t.id === torneoId) || null;
}

export function obtenerEquipoPorId(equipoId, equipos) {
  return equipos.find((e) => e.id === equipoId) || null;
}

export function obtenerJugadorPorId(jugadorId, jugadores) {
  return jugadores.find((j) => j.id === jugadorId) || null;
}

/** Cupos aún disponibles en un torneo; nunca retorna un valor negativo. */
export function cuposDisponibles(torneo) {
  const disponibles = torneo.cupoMaximo - torneo.cupoOcupado;
  return disponibles < 0 ? 0 : disponibles;
}

/** Convierte una fecha ISO (AAAA-MM-DD) a formato DD-MM-AAAA para mostrar en pantalla. */
export function formatearFecha(fechaISO) {
  if (!fechaISO) return "Sin fecha";
  const [anio, mes, dia] = fechaISO.split(/[- ]/);
  return `${dia}-${mes}-${anio}`;
}

export function etiquetaEstado(estado) {
  const mapa = {
    abierto: "Abierto",
    "en-curso": "En curso",
    finalizado: "Finalizado",
  };
  return mapa[estado] || estado;
}

/** Verdadero cuando la fecha actual ya superó el cierre de inscripción del torneo. */
export function inscripcionFueraDePlazo(torneo, fechaActualISO = new Date().toISOString().slice(0, 10)) {
  return fechaActualISO > torneo.fechaCierreInscripcion;
}

/** Verdadero si el jugador tiene al menos una sanción vigente. */
export function tieneSancionActiva(jugadorId, sanciones) {
  return sanciones.some((s) => s.jugadorId === jugadorId && s.vigente);
}

export function yaInscrito(torneoId, participanteId, inscripciones) {
  return inscripciones.some((i) => i.torneoId === torneoId && i.participanteId === participanteId);
}

/** Verdadero si el equipo alcanza el mínimo de integrantes exigido por su juego. */
export function equipoCompleto(equipo, juegos) {
  const juego = obtenerJuegoPorId(equipo.juegoId, juegos);
  if (!juego) return false;
  return equipo.integrantes.length >= juego.integrantesPorEquipo;
}

/**
 * Ordena una tabla de posiciones por puntos (de mayor a menor) y, en caso de
 * empate, por diferencia de puntaje. Devuelve un arreglo nuevo con la
 * propiedad `posicion` recalculada según el nuevo orden (no muta el original).
 */
export function ordenarRanking(filas) {
  return [...filas]
    .sort((a, b) => {
      if (b.puntos !== a.puntos) return b.puntos - a.puntos;
      return b.diferenciaPuntaje - a.diferenciaPuntaje;
    })
    .map((fila, indice) => ({ ...fila, posicion: indice + 1 }));
}

/**
 * Calcula los puntos de cada participante a partir de una lista de
 * resultados validados y las partidas a las que pertenecen: suma
 * `puntosPorVictoria` al ganador de cada partida y `puntosPorDerrota` al
 * rival. Devuelve un objeto { participante: puntosAcumulados }.
 */
export function calcularPuntos(resultados, partidas, opciones = {}) {
  const puntosPorVictoria = opciones.puntosPorVictoria ?? 3;
  const puntosPorDerrota = opciones.puntosPorDerrota ?? 0;

  const acumulado = {};
  const sumar = (participante, puntos) => {
    acumulado[participante] = (acumulado[participante] || 0) + puntos;
  };

  resultados.forEach((resultado) => {
    const partida = partidas.find((p) => p.id === resultado.partidaId);
    if (!partida) return;
    const perdedor = resultado.ganador === partida.participanteA ? partida.participanteB : partida.participanteA;
    sumar(resultado.ganador, puntosPorVictoria);
    sumar(perdedor, puntosPorDerrota);
  });

  return acumulado;
}
