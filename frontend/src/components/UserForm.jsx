import { useState } from 'react';

export default function UserForm({ currentUser, onSaveUser }) {
  const [user, setUser] = useState(currentUser || '');

  function handleSubmit(event) {
    event.preventDefault();
    onSaveUser(user);
  }

  return (
    <section className="card border-0 shadow-sm rounded-5 p-4 p-lg-5 mb-4 intro-card">
      <div className="row align-items-center g-4">
        <div className="col-lg-7">
          <p className="eyebrow mb-2">Identidad por header</p>
          <h1 className="display-4 fw-black lh-1 mb-3">Crea, explora y administra pins minimalistas.</h1>
          <p className="lead text-secondary mb-0">Tu usuario se guarda en sessionStorage y se envía al backend como <code>X-User-Id</code> para proteger edición y borrado.</p>
        </div>
        <div className="col-lg-5">
          <form className="bg-white rounded-4 p-3 p-md-4" onSubmit={handleSubmit}>
            <label className="form-label fw-bold" htmlFor="current-user">Usuario actual</label>
            <input id="current-user" className="form-control form-control-lg rounded-pill" value={user} onChange={(event) => setUser(event.target.value)} placeholder="Ej. andrea" required />
            <button className="btn btn-dark btn-lg rounded-pill w-100 mt-3" type="submit">Guardar usuario</button>
          </form>
        </div>
      </div>
    </section>
  );
}
