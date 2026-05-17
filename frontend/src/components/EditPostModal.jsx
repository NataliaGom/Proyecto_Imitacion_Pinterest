import { useState } from 'react';

export default function EditPostModal({ post, onClose, onPatch, onReplace }) {
  const [form, setForm] = useState(() => ({
    title: post?.title || '',
    description: post?.description || '',
    image_url: post?.image_url || '',
    tags: post?.tags?.join(', ') || '',
  }));
  const [mode, setMode] = useState('patch');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!post) return null;

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    const payload = {
      title: form.title,
      description: form.description,
      image_url: form.image_url,
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    };

    try {
      if (mode === 'patch') {
        await onPatch(post.id, payload);
      } else {
        await onReplace(post.id, payload);
      }
      onClose();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop-custom" role="dialog" aria-modal="true" aria-label="Editar pin">
      <div className="modal-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 fw-black mb-0">Editar pin</h2>
          <button className="btn-close" type="button" onClick={onClose} aria-label="Cerrar" />
        </div>
        <div className="btn-group mb-3" role="group" aria-label="Tipo de actualización">
          <input type="radio" className="btn-check" name="edit-mode" id="mode-patch" checked={mode === 'patch'} onChange={() => setMode('patch')} />
          <label className="btn btn-outline-dark" htmlFor="mode-patch">PATCH parcial</label>
          <input type="radio" className="btn-check" name="edit-mode" id="mode-put" checked={mode === 'put'} onChange={() => setMode('put')} />
          <label className="btn btn-outline-dark" htmlFor="mode-put">PUT reemplazo</label>
        </div>
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-12">
            <label className="form-label">Título</label>
            <input className="form-control rounded-pill" value={form.title} onChange={(event) => updateField('title', event.target.value)} required />
          </div>
          <div className="col-12">
            <label className="form-label">Imagen</label>
            <input type="url" className="form-control rounded-pill" value={form.image_url} onChange={(event) => updateField('image_url', event.target.value)} required />
          </div>
          <div className="col-12">
            <label className="form-label">Descripción</label>
            <textarea className="form-control rounded-4" rows="3" value={form.description} onChange={(event) => updateField('description', event.target.value)} />
          </div>
          <div className="col-12">
            <label className="form-label">Etiquetas</label>
            <input className="form-control rounded-pill" value={form.tags} onChange={(event) => updateField('tags', event.target.value)} />
          </div>
          {message && <div className="alert alert-danger rounded-4">{message}</div>}
          <div className="col-12 d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-outline-secondary rounded-pill" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-pinterest rounded-pill" disabled={submitting}>{submitting ? 'Guardando...' : 'Guardar cambios'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
