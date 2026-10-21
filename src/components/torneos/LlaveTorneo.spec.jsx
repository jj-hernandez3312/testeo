/**
 * LlaveTorneo muestra el texto de participante por definir cuando la partida
 * aún no tiene rival asignado (prueba 10 del listado obligatorio).
 */
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import LlaveTorneo from "./LlaveTorneo.jsx";

describe("LlaveTorneo", () => {
  let contenedor;
  let raiz;

  beforeEach(() => {
    contenedor = document.createElement("ul"); // <li> necesita un padre de lista válido
    document.body.appendChild(contenedor);
    raiz = createRoot(contenedor);
  });

  afterEach(() => {
    act(() => raiz.unmount());
    contenedor.remove();
  });

  it('muestra "Participante por definir" cuando la partida no tiene rival asignado', () => {
    const partidaSinRival = {
      id: "p1",
      participanteA: "Silencio Absoluto",
      participanteB: "Por definir",
      horario: "2026-08-25 18:00",
      estado: "jugada",
    };

    act(() => {
      raiz.render(<LlaveTorneo partida={partidaSinRival} />);
    });

    expect(contenedor.textContent).toContain("Participante por definir");
  });

  it("muestra el nombre del rival cuando ya está asignado", () => {
    const partidaConRival = {
      id: "p2",
      participanteA: "Silencio Absoluto",
      participanteB: "Vórtice Norte",
      horario: "2026-09-01 18:00",
      estado: "programada",
    };

    act(() => {
      raiz.render(<LlaveTorneo partida={partidaConRival} />);
    });

    expect(contenedor.textContent).toContain("Vórtice Norte");
    expect(contenedor.textContent).not.toContain("Participante por definir");
  });
});
