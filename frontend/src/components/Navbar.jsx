import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '??'

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="navbar-logo">
          <div className="navbar-logo-icon">📚</div>
          ChapterOne
        </NavLink>

        <div className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            📖 Catalog
          </NavLink>
          <NavLink to="/shelf" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            🗂️ My Shelf
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            👤 Profile
          </NavLink>
        </div>

        <div className="navbar-actions">
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {user?.username}
          </span>
          <button
            onClick={handleLogout}
            className="btn btn-outline btn-sm"
            id="logout-btn"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  )
}
