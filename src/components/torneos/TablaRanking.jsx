import Table from "react-bootstrap/Table";

/**
 * Tabla de posiciones de un torneo. Es "tonta": no ordena ni recalcula nada,
 * solo dibuja las filas en el orden en que las recibe por props. Quien la usa
 * (TorneoDetalle) es responsable de pasarle el resultado de ordenarRanking().
 */
export default function TablaRanking({ filas }) {
  if (!filas || filas.length === 0) {
    return <p className="texto-tenue">Aún no hay resultados validados para esta tabla de posiciones.</p>;
  }

  return (
    <Table responsive hover className="tabla-ranking" data-testid="tabla-ranking">
      <caption className="visually-hidden">Tabla de posiciones del torneo</caption>
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Participante</th>
          <th scope="col">Puntos</th>
          <th scope="col">Diferencia</th>
        </tr>
      </thead>
      <tbody>
        {filas.map((fila) => (
          <tr key={fila.participante} data-testid="fila-ranking">
            <td>{fila.posicion}</td>
            <td>{fila.participante}</td>
            <td>{fila.puntos}</td>
            <td>{fila.diferenciaPuntaje > 0 ? `+${fila.diferenciaPuntaje}` : fila.diferenciaPuntaje}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
