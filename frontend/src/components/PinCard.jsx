export default function PinCard({ post, onDetail, onEdit, onDelete }) {
  return (
    <article className="card pin-card border-0 shadow-sm rounded-5 overflow-hidden mb-4">
      <button className="pin-image-button" type="button" onClick={() => onDetail(post.id)} aria-label={`Ver detalle de ${post.title}`}>
        <img src={post.image_url} className="card-img-top pin-image" alt={post.title} loading="lazy" />
      </button>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <h3 className="h6 fw-bold mb-0">{post.title}</h3>
          {post.can_edit && <span className="badge rounded-pill text-bg-success">Mío</span>}
        </div>
        <p className="small text-secondary mb-2">{post.description || 'Sin descripción'}</p>
        <div className="d-flex flex-wrap gap-1 mb-3">
          {post.tags.map((tag) => <span className="badge tag-badge" key={`${post.id}-${tag}`}>#{tag}</span>)}
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-sm btn-outline-dark rounded-pill" onClick={() => onDetail(post.id)}>Detalle</button>
          {post.can_edit && (
            <>
              <button className="btn btn-sm btn-outline-secondary rounded-pill" onClick={() => onEdit(post)}>Editar</button>
              <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => onDelete(post)}>Borrar</button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
