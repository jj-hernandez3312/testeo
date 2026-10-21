/**
 * TarjetaTorneo renderiza nombre, juego y estado del torneo (prueba 7 del listado obligatorio).
 */
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import TarjetaTorneo from "./TarjetaTorneo.jsx";

describe("TarjetaTorneo", () => {
  let contenedor;
  let raiz;

  const torneo = {
    id: "t1",
    nombre: "Copa Apertura Valorion",
    juegoId: "g1",
    modalidad: "Equipos",
    estado: "abierto",
    cupoMaximo: 16,
    cupoOcupado: 9,
    fechaCierreInscripcion: "2026-09-12",
  };
  const juegos = [{ id: "g1", nombre: "Valorion Strike", integrantesPorEquipo: 5 }];

  beforeEach(() => {
    contenedor = document.createElement("div");
    document.body.appendChild(contenedor);
    raiz = createRoot(contenedor);
  });

  afterEach(() => {
    act(() => raiz.unmount());
    contenedor.remove();
  });

  it("renderiza el nombre, el juego y el estado del torneo", () => {
    act(() => {
      raiz.render(
        <MemoryRouter>
          <TarjetaTorneo torneo={torneo} juegos={juegos} />
        </MemoryRouter>
      );
    });

    const texto = contenedor.textContent;
    expect(texto).toContain("Copa Apertura Valorion");
    expect(texto).toContain("Valorion Strike");
    expect(texto).toContain("Abierto");
  });
});
