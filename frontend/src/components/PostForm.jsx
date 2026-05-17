import { useEffect, useState } from 'react';

const emptyForm = {
  title: '',
  description: '',
  image_url: '',
  tags: '',
};

export default function PostForm({ currentUser, initialImage = '', onSubmit, title = 'Crear nuevo pin', submitLabel = 'Crear pin' }) {
  const [form, setForm] = useState({ ...emptyForm, image_url: initialImage });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialImage) {
      setForm((current) => ({ ...current, image_url: initialImage }));
    }
  }, [initialImage]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      await onSubmit({
        title: form.title,
        description: form.description,
        image_url: form.image_url,
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      });
      setMessage('Pin guardado correctamente.');
      setForm(emptyForm);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="crear" className="card border-0 shadow-sm rounded-5 p-4 mb-5">
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
        <div>
          <p className="eyebrow mb-1">Alta de entidad</p>
          <h2 className="h3 fw-black mb-0">{title}</h2>
        </div>
        <span className="text-secondary small">Usuario creador: <strong>{currentUser || 'sin identificar'}</strong></span>
      </div>
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <label className="form-label" htmlFor="post-title">Título</label>
          <input id="post-title" className="form-control rounded-pill" value={form.title} onChange={(event) => updateField('title', event.target.value)} required />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="post-date">Fecha de alta</label>
          <input id="post-date" className="form-control rounded-pill" value={new Date().toLocaleString('es-MX')} disabled readOnly />
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="post-image">Link a imagen</label>
          <input id="post-image" type="url" className="form-control rounded-pill" value={form.image_url} onChange={(event) => updateField('image_url', event.target.value)} placeholder="https://..." required />
        </div>
        <div className="col-md-7">
          <label className="form-label" htmlFor="post-description">Descripción</label>
          <textarea id="post-description" className="form-control rounded-4" rows="3" value={form.description} onChange={(event) => updateField('description', event.target.value)} />
        </div>
        <div className="col-md-5">
          <label className="form-label" htmlFor="post-tags">Etiquetas separadas por coma</label>
          <textarea id="post-tags" className="form-control rounded-4" rows="3" value={form.tags} onChange={(event) => updateField('tags', event.target.value)} placeholder="interiores, minimalismo" />
        </div>
        <div className="col-12 d-flex flex-column flex-sm-row align-items-sm-center gap-3">
          <button className="btn btn-pinterest rounded-pill px-4" type="submit" disabled={!currentUser || submitting}>{submitting ? 'Guardando...' : submitLabel}</button>
          {message && <span className="small text-secondary">{message}</span>}
        </div>
      </form>
    </section>
  );
}
