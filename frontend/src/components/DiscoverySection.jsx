import { useState } from 'react';
import { useDiscovery } from '../hooks/useDiscovery';

export default function DiscoverySection({ currentUser, onSavePhoto }) {
  const { photos, loading, error, page, setPage, reload } = useDiscovery(currentUser);
  const [message, setMessage] = useState('');

  async function handleSave(photo) {
    setMessage('');
    try {
      await onSavePhoto({
        title: photo.title,
        description: `Foto de ${photo.author_name || 'Unsplash'} vía Unsplash`,
        image_url: photo.image_url,
        tags: ['unsplash', 'descubrimiento'],
      });
      setMessage('Imagen de discovery guardada como pin.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section id="descubrir" className="mb-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-3">
        <div>
          <p className="eyebrow mb-1">API de terceros transformada</p>
          <h2 className="h3 fw-black mb-0">Descubrimiento Unsplash</h2>
          <p className="text-secondary mb-0">El frontend llama a tu backend, y el backend transforma la respuesta de Unsplash.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-dark rounded-pill" disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</button>
          <button className="btn btn-outline-dark rounded-pill" onClick={() => setPage(page + 1)}>Más</button>
          <button className="btn btn-dark rounded-pill" onClick={reload}>Recargar</button>
        </div>
      </div>
      {message && <div className="alert alert-info rounded-4">{message}</div>}
      {error && <div className="alert alert-warning rounded-4">{error}</div>}
      {loading && <div className="text-center p-4"><span className="spinner-border" /></div>}
      <div className="row g-4">
        {photos.map((photo) => (
          <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={photo.external_id}>
            <article className="card border-0 shadow-sm rounded-5 overflow-hidden h-100">
              <img src={photo.thumb_url || photo.image_url} className="card-img-top discovery-image" alt={photo.title} loading="lazy" />
              <div className="card-body d-flex flex-column">
                <h3 className="h6 fw-bold">{photo.title}</h3>
                <p className="small text-secondary flex-grow-1">Por {photo.author_name || 'Unsplash'}</p>
                <button className="btn btn-sm btn-pinterest rounded-pill" onClick={() => handleSave(photo)} disabled={!currentUser}>Guardar como pin</button>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
