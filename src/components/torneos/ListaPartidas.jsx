import LlaveTorneo from "./LlaveTorneo.jsx";

/** Lista de partidas de una ronda, construida a partir de LlaveTorneo. */
export default function ListaPartidas({ partidas }) {
  if (!partidas || partidas.length === 0) {
    return <p className="texto-tenue">No hay partidas programadas para esta ronda todavía.</p>;
  }

  return (
    <ul className="llave-torneo list-unstyled">
      {partidas.map((partida) => (
        <LlaveTorneo key={partida.id} partida={partida} />
      ))}
    </ul>
  );
}
