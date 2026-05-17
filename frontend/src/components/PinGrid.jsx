import PinCard from './PinCard.jsx';

export default function PinGrid({ posts, loading, error, onDetail, onEdit, onDelete }) {
  return (
    <section id="feed" className="mb-5">
      <div className="d-flex justify-content-between align-items-end gap-3 mb-3">
        <div>
          <p className="eyebrow mb-1">Base de datos</p>
          <h2 className="h3 fw-black mb-0">Feed de pins</h2>
        </div>
        {loading && <span className="spinner-border spinner-border-sm" aria-label="Cargando" />}
      </div>
      {error && <div className="alert alert-warning rounded-4">{error}</div>}
      {!loading && posts.length === 0 && !error && <div className="empty-state">Aún no hay pins. Crea el primero desde el formulario.</div>}
      <div className="pin-masonry">
        {posts.map((post) => (
          <div className="pin-masonry-item" key={post.id}>
            <PinCard post={post} onDetail={onDetail} onEdit={onEdit} onDelete={onDelete} />
          </div>
        ))}
      </div>
    </section>
  );
}
