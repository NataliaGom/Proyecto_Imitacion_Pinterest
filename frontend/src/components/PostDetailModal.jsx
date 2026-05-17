export default function PostDetailModal({ post, loading, error, onClose, onEdit, onDelete }) {
  if (!post && !loading && !error) return null;

  return (
    <div className="modal-backdrop-custom" role="dialog" aria-modal="true" aria-label="Detalle del pin">
      <div className="modal-card modal-card-lg">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 fw-black mb-0">Detalle del pin</h2>
          <button className="btn-close" type="button" onClick={onClose} aria-label="Cerrar" />
        </div>
        {loading && <div className="text-center p-5"><span className="spinner-border" /></div>}
        {error && <div className="alert alert-danger rounded-4">{error}</div>}
        {post && (
          <div className="row g-4">
            <div className="col-lg-6">
              <img className="img-fluid rounded-5 detail-image" src={post.image_url} alt={post.title} />
            </div>
            <div className="col-lg-6">
              <p className="eyebrow mb-2">Creado por {post.user_id}</p>
              <h3 className="fw-black">{post.title}</h3>
              <p className="text-secondary">{post.description || 'Sin descripción'}</p>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag) => <span className="badge tag-badge" key={tag}>#{tag}</span>)}
              </div>
              <p className="small text-secondary">Alta: {new Date(post.created_at).toLocaleString('es-MX')}</p>
              <p className="small text-secondary">Última actualización: {new Date(post.updated_at).toLocaleString('es-MX')}</p>
              {post.can_edit && (
                <div className="d-flex gap-2 mt-4">
                  <button className="btn btn-outline-secondary rounded-pill" onClick={() => onEdit(post)}>Editar</button>
                  <button className="btn btn-outline-danger rounded-pill" onClick={() => onDelete(post)}>Borrar</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
