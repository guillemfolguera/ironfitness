function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{ backgroundColor: '#000000', borderBottom: '1px solid #4f46e5' }}
    >
      <div className="container">
        <a className="navbar-brand text-white" href="#">Iron Fitness</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main-navbar" aria-controls="main-navbar" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="main-navbar">
          <span className="navbar-text" style={{ color: '#a5b4fc' }}>
            The home of the great fitness lovers
          </span>
        </div>
      </div>
    </nav>
  )
}
export default Navbar