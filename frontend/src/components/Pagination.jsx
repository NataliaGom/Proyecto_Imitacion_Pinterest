export default function Pagination({ pagination, page, pageSize, onPageChange, onPageSizeChange }) {
  const totalPages = pagination.total_pages || 1;

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">
      <div className="text-secondary small">Página {page} de {totalPages} · {pagination.total} resultados</div>
      <div className="d-flex flex-wrap gap-2 align-items-center">
        <select className="form-select form-select-sm rounded-pill page-size-select" value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))} aria-label="Tamaño de página">
          <option value="12">12 por página</option>
          <option value="24">24 por página</option>
          <option value="36">36 por página</option>
        </select>
        <button className="btn btn-outline-dark rounded-pill" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Anterior</button>
        <button className="btn btn-outline-dark rounded-pill" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Siguiente</button>
      </div>
    </div>
  );
}
