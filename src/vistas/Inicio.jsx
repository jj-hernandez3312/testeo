import { useMemo } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import TarjetaTorneo from "../components/torneos/TarjetaTorneo.jsx";
import { listarTorneos, listarJuegos } from "../servicios/torneosService.js";
import { formatearFecha } from "../utils/reglas.js";

/** Vista Inicio: presenta la plataforma y destaca torneos abiertos/en curso. */
export default function Inicio() {
  const torneos = listarTorneos();
  const juegos = listarJuegos();

  const destacados = useMemo(
    () => torneos.filter((t) => t.estado === "abierto" || t.estado === "en-curso"),
    [torneos]
  );

  const proximosCierres = useMemo(
    () =>
      torneos
        .filter((t) => t.estado === "abierto")
        .sort((a, b) => a.fechaCierreInscripcion.localeCompare(b.fechaCierreInscripcion)),
    [torneos]
  );

  return (
    <>
      <section className="py-5 text-center" style={{ background: "var(--eam-superficie-2)" }} id="inicio">
        <Container>
          <h1 className="display-6 fw-bold">eSports Arena Manager</h1>
          <p className="lead texto-tenue mb-0">
            Organiza, juega y sigue torneos competitivos de Valorion Strike, Rift Legends y Turbo Kart Rivals.
          </p>
        </Container>
      </section>

      <Container className="py-5">
        <section aria-labelledby="titulo-destacados">
          <h2 id="titulo-destacados" className="h4 mb-3">
            Torneos destacados
          </h2>
          <Row xs={1} md={2} lg={3} className="g-3">
            {destacados.map((torneo) => (
              <Col key={torneo.id}>
                <TarjetaTorneo torneo={torneo} juegos={juegos} />
              </Col>
            ))}
          </Row>
        </section>

        <section className="mt-5" aria-labelledby="titulo-cierres">
          <h2 id="titulo-cierres" className="h4 mb-3">
            Próximos cierres de inscripción
          </h2>
          <Table responsive hover>
            <thead>
              <tr>
                <th scope="col">Torneo</th>
                <th scope="col">Cierre de inscripción</th>
              </tr>
            </thead>
            <tbody>
              {proximosCierres.map((t) => (
                <tr key={t.id}>
                  <td>{t.nombre}</td>
                  <td>{formatearFecha(t.fechaCierreInscripcion)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </section>

        <section className="mt-5" aria-labelledby="titulo-video">
          <h2 id="titulo-video" className="h4 mb-3">
            Final de la temporada anterior
          </h2>
          <figure>
            <video controls width="100%" poster="" style={{ maxWidth: 640, borderRadius: "0.5rem" }}>
              <source src="/media/final-temporada.mp4" type="video/mp4" />
              Tu navegador no soporta la reproducción de video embebido.
            </video>
            <figcaption className="texto-tenue small mt-2">
              Resumen de la gran final de la Copa Fundación Valorion.
            </figcaption>
          </figure>
        </section>
      </Container>
    </>
  );
}
