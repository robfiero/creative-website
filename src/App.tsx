import { NavLink, Outlet } from 'react-router-dom'

import './App.css'

function App() {
  return (
    <div className="site-shell">
      <header className="top-nav">
        <div className="top-nav__inner">
          <NavLink to="/" className="top-nav__brand-link">
            <img src="/images/signature.png" alt="Creative" className="top-nav__brand-logo" />
            <span className="sr-only">Creative</span>
          </NavLink>
          <nav aria-label="Primary">
            <ul className="top-nav__links">
              <li>
                <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : undefined)} end>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : undefined)}>
                  About the Artist
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="content-wrap">
        <Outlet />
      </main>
    </div>
  )
}

export default App
