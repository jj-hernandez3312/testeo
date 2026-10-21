/** Mensaje reutilizable para listas filtradas que no arrojan resultados. */
export default function EstadoVacio({ mensaje = "No se encontraron resultados con los filtros aplicados." }) {
  return (
    <div className="estado-vacio text-center py-5" role="status">
      <p className="mb-0 text-muted">{mensaje}</p>
    </div>
  );
}
