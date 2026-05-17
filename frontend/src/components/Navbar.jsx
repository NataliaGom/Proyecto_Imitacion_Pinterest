export default function Navbar({ currentUser, onClearUser }) {
  return (
    <nav className="navbar navbar-expand-lg sticky-top bg-body-tertiary border-bottom glass-nav">
      <div className="container-fluid px-3 px-lg-5">
        <a className="navbar-brand fw-black d-flex align-items-center gap-2" href="#top">
          <span className="brand-mark">P</span>
          Pin Minimal
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Abrir navegación">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li className="nav-item"><a className="nav-link" href="#feed">Feed</a></li>
            <li className="nav-item"><a className="nav-link" href="#crear">Crear</a></li>
            <li className="nav-item"><a className="nav-link" href="#descubrir">Descubrir</a></li>
            {currentUser && (
              <li className="nav-item d-flex align-items-center gap-2 ms-lg-3">
                <span className="badge rounded-pill text-bg-dark px-3 py-2"><i className="bi bi-person-circle me-1" />{currentUser}</span>
                <button className="btn btn-sm btn-outline-dark rounded-pill" onClick={onClearUser}>Cambiar</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
