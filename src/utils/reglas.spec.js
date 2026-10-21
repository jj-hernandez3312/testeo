/**
 * Pruebas unitarias de la lógica de negocio pura (src/utils/reglas.js).
 * Cubre las pruebas 1 a 6 del listado obligatorio de EP2.
 */
import {
  ordenarRanking,
  calcularPuntos,
  cuposDisponibles,
  inscripcionFueraDePlazo,
  tieneSancionActiva,
  equipoCompleto,
} from "./reglas.js";

describe("ordenarRanking", () => {
  it("ordena por puntos y desempata por diferencia de puntaje", () => {
    const filasDesordenadas = [
      { participante: "Equipo B", puntos: 3, diferenciaPuntaje: 0 },
      { participante: "Equipo A", puntos: 6, diferenciaPuntaje: 4 },
      { participante: "Equipo C", puntos: 3, diferenciaPuntaje: 6 }, // mismos puntos que B, mejor diferencia
    ];

    const resultado = ordenarRanking(filasDesordenadas);

    expect(resultado.map((f) => f.participante)).toEqual(["Equipo A", "Equipo C", "Equipo B"]);
    // La posición se recalcula según el nuevo orden
    expect(resultado.map((f) => f.posicion)).toEqual([1, 2, 3]);
  });

  it("no muta el arreglo original", () => {
    const original = [
      { participante: "X", puntos: 1, diferenciaPuntaje: 1 },
      { participante: "Y", puntos: 2, diferenciaPuntaje: 2 },
    ];
    const copiaOriginal = JSON.parse(JSON.stringify(original));
    ordenarRanking(original);
    expect(original).toEqual(copiaOriginal);
  });
});

describe("calcularPuntos", () => {
  it("asigna los puntos definidos por victoria y por derrota a partir de una lista de resultados", () => {
    const partidas = [
      { id: "p1", participanteA: "Equipo A", participanteB: "Equipo B" },
      { id: "p2", participanteA: "Equipo A", participanteB: "Equipo C" },
    ];
    const resultados = [
      { partidaId: "p1", ganador: "Equipo A" },
      { partidaId: "p2", ganador: "Equipo C" },
    ];

    const puntos = calcularPuntos(resultados, partidas, { puntosPorVictoria: 3, puntosPorDerrota: 1 });

    expect(puntos).toEqual({
      "Equipo A": 3 + 1, // gana p1 (3) y pierde p2 (1)
      "Equipo B": 1, // pierde p1
      "Equipo C": 3, // gana p2
    });
  });

  it("usa 3 puntos por victoria y 0 por derrota cuando no se especifican opciones", () => {
    const partidas = [{ id: "p1", participanteA: "Equipo A", participanteB: "Equipo B" }];
    const resultados = [{ partidaId: "p1", ganador: "Equipo A" }];

    const puntos = calcularPuntos(resultados, partidas);

    expect(puntos).toEqual({ "Equipo A": 3, "Equipo B": 0 });
  });
});

describe("cuposDisponibles", () => {
  it("resta las inscripciones vigentes al cupo máximo", () => {
    expect(cuposDisponibles({ cupoMaximo: 16, cupoOcupado: 9 })).toBe(7);
  });

  it("nunca retorna un valor negativo", () => {
    expect(cuposDisponibles({ cupoMaximo: 8, cupoOcupado: 10 })).toBe(0);
  });
});

describe("inscripcionFueraDePlazo", () => {
  it("retorna verdadero cuando la fecha actual supera el cierre de inscripción", () => {
    const torneo = { fechaCierreInscripcion: "2026-08-15" };
    expect(inscripcionFueraDePlazo(torneo, "2026-08-16")).toBe(true);
  });

  it("retorna falso cuando la fecha actual aún no alcanza el cierre", () => {
    const torneo = { fechaCierreInscripcion: "2026-09-30" };
    expect(inscripcionFueraDePlazo(torneo, "2026-09-01")).toBe(false);
  });
});

describe("tieneSancionActiva", () => {
  const sanciones = [
    { jugadorId: "j4", vigente: true },
    { jugadorId: "j6", vigente: false },
  ];

  it("bloquea al participante con sanción vigente", () => {
    expect(tieneSancionActiva("j4", sanciones)).toBe(true);
  });

  it("permite al que ya cumplió su sanción", () => {
    expect(tieneSancionActiva("j6", sanciones)).toBe(false);
  });
});

describe("equipoCompleto", () => {
  const juegos = [{ id: "g1", nombre: "Valorion Strike", integrantesPorEquipo: 5 }];

  it("valida la cantidad de integrantes exigida por el juego del torneo", () => {
    const equipoCompletoDeIntegrantes = {
      juegoId: "g1",
      integrantes: [1, 2, 3, 4, 5].map((n) => ({ jugadorId: `j${n}` })),
    };
    expect(equipoCompleto(equipoCompletoDeIntegrantes, juegos)).toBe(true);
  });

  it("retorna falso cuando faltan integrantes", () => {
    const equipoIncompleto = { juegoId: "g1", integrantes: [{ jugadorId: "j1" }] };
    expect(equipoCompleto(equipoIncompleto, juegos)).toBe(false);
  });
});
