/**
 * TablaRanking renderiza una fila por participante y respeta el orden recibido (prueba 8).
 */
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import TablaRanking from "./TablaRanking.jsx";

describe("TablaRanking", () => {
  let contenedor;
  let raiz;

  const filas = [
    { posicion: 1, participante: "Nova Reapers", puntos: 6, diferenciaPuntaje: 6 },
    { posicion: 2, participante: "Rango Cero", puntos: 3, diferenciaPuntaje: -2 },
    { posicion: 3, participante: "Escuadra Ceniza", puntos: 0, diferenciaPuntaje: -6 },
  ];

  beforeEach(() => {
    contenedor = document.createElement("div");
    document.body.appendChild(contenedor);
    raiz = createRoot(contenedor);
  });

  afterEach(() => {
    act(() => raiz.unmount());
    contenedor.remove();
  });

  it("renderiza una fila por participante y respeta el orden recibido", () => {
    act(() => {
      raiz.render(<TablaRanking filas={filas} />);
    });

    const nombresEnPantalla = Array.from(contenedor.querySelectorAll('[data-testid="fila-ranking"]')).map(
      (fila) => fila.children[1].textContent
    );

    expect(nombresEnPantalla.length).toBe(3);
    expect(nombresEnPantalla).toEqual(["Nova Reapers", "Rango Cero", "Escuadra Ceniza"]);
  });

  it("muestra un mensaje cuando no hay filas", () => {
    act(() => {
      raiz.render(<TablaRanking filas={[]} />);
    });

    expect(contenedor.textContent).toContain("Aún no hay resultados");
  });
});
