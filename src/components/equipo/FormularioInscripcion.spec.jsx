/**
 * FormularioInscripcion mantiene deshabilitado el envío cuando el equipo está
 * incompleto, verificado con un espía sobre el manejador (prueba 9).
 */
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import FormularioInscripcion from "./FormularioInscripcion.jsx";

/**
 * React intercepta el setter nativo de `.value` de cada <input> que controla,
 * para comparar el valor anterior con el nuevo y decidir si debe disparar su
 * evento sintético onChange. Asignar `input.value = "..."` directo no pasa por
 * ese setter interceptado, así que el input nativo del prototipo se usa a
 * propósito antes de despachar el evento "input".
 */
function setValorReact(elemento, valor) {
  const descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value");
  descriptor.set.call(elemento, valor);
  elemento.dispatchEvent(new Event("input", { bubbles: true }));
}

describe("FormularioInscripcion", () => {
  let contenedor;
  let raiz;

  const juegos = [{ id: "g1", nombre: "Valorion Strike", integrantesPorEquipo: 5 }];
  const torneos = [
    {
      id: "t1",
      nombre: "Copa Apertura Valorion",
      juegoId: "g1",
      cupoMaximo: 16,
      cupoOcupado: 9,
      fechaCierreInscripcion: "2099-01-01", // lejos en el futuro: nunca fuera de plazo en la prueba
    },
  ];
  const jugadores = [{ id: "j1", nombre: "Camila Rojas", apodo: "camiRJ" }];
  const sanciones = [];
  const inscripciones = [];

  function montar(equipos) {
    contenedor = document.createElement("div");
    document.body.appendChild(contenedor);
    raiz = createRoot(contenedor);
    const onConfirmar = jasmine.createSpy("onConfirmar");

    act(() => {
      raiz.render(
        <FormularioInscripcion
          torneos={torneos}
          juegos={juegos}
          jugadores={jugadores}
          equipos={equipos}
          inscripciones={inscripciones}
          sanciones={sanciones}
          onConfirmar={onConfirmar}
        />
      );
    });

    return { onConfirmar };
  }

  afterEach(() => {
    act(() => raiz.unmount());
    contenedor.remove();
  });

  it("deja el botón deshabilitado y nunca llama al manejador cuando el equipo está incompleto", () => {
    const equipoIncompleto = [
      { id: "e1", nombre: "Nova Reapers", juegoId: "g1", activo: true, integrantes: [{ jugadorId: "j1" }] },
    ];
    const { onConfirmar } = montar(equipoIncompleto);

    // Cambiar el tipo de participante a "equipo". React escucha el evento "click"
    // (no "change") para sincronizar inputs de tipo radio/checkbox, así que se
    // usa el método .click() del propio elemento en vez de despachar eventos a mano.
    const radioEquipo = contenedor.querySelector("#tipo-equipo");
    act(() => {
      radioEquipo.click();
    });

    const boton = contenedor.querySelector('[data-testid="boton-inscribir"]');
    expect(boton.disabled).toBe(true);

    act(() => {
      boton.click();
    });

    expect(onConfirmar).not.toHaveBeenCalled();
    expect(contenedor.textContent).toContain("no tiene los integrantes mínimos");
  });

  it("habilita el envío y llama al manejador cuando el equipo cumple los integrantes mínimos", () => {
    const equipoCompleto = [
      {
        id: "e1",
        nombre: "Nova Reapers",
        juegoId: "g1",
        activo: true,
        integrantes: [1, 2, 3, 4, 5].map((n) => ({ jugadorId: `j${n}` })),
      },
    ];
    const { onConfirmar } = montar(equipoCompleto);

    const radioEquipo = contenedor.querySelector("#tipo-equipo");
    act(() => {
      radioEquipo.click();
    });

    const boton = contenedor.querySelector('[data-testid="boton-inscribir"]');
    expect(boton.disabled).toBe(false);

    const campoEdad = contenedor.querySelector("#campo-edad");
    const campoContacto = contenedor.querySelector("#campo-contacto");
    const campoTerminos = contenedor.querySelector("#campo-terminos");

    act(() => {
      setValorReact(campoEdad, "22");
      setValorReact(campoContacto, "camila.rojas@correo.cl");
      campoTerminos.click();
    });

    act(() => {
      boton.click();
    });

    expect(onConfirmar).toHaveBeenCalled();
    expect(onConfirmar).toHaveBeenCalledWith(
      jasmine.objectContaining({ torneoId: "t1", tipo: "equipo", participanteId: "e1" })
    );
  });
});
