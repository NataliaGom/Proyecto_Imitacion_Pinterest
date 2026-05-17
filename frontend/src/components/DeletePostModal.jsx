import { useState } from 'react';

export default function DeletePostModal({ post, onClose, onConfirm }) {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!post) return null;

  async function handleDelete() {
    setSubmitting(true);
    setMessage('');
    try {
      await onConfirm(post.id);
      onClose();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop-custom" role="dialog" aria-modal="true" aria-label="Eliminar pin">
      <div className="modal-card modal-card-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 fw-black mb-0">Eliminar pin</h2>
          <button className="btn-close" type="button" onClick={onClose} aria-label="Cerrar" />
        </div>
        <p>¿Seguro que quieres eliminar <strong>{post.title}</strong>? Esta acción no se puede deshacer.</p>
        {message && <div className="alert alert-danger rounded-4">{message}</div>}
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-outline-secondary rounded-pill" onClick={onClose}>Cancelar</button>
          <button className="btn btn-danger rounded-pill" onClick={handleDelete} disabled={submitting}>{submitting ? 'Eliminando...' : 'Eliminar'}</button>
        </div>
      </div>
    </div>
  );
}
