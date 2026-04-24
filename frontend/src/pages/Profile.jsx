import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import Toast from '../components/Toast.jsx'
import { updateProfile } from '../api/userApi.js'

let toastId = 0

export default function Profile() {
  const { user, token, updateUser, logout } = useAuth()
  const [editing, setEditing] = useState(false)
  const [username, setUsername] = useState(user?.username || '')
  const [saving, setSaving] = useState(false)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    if (token) {
      import('../api/userApi.js').then(({ getProfile }) => {
        getProfile(token)
          .then(data => {
            updateUser(data)
            setUsername(data.username)
          })
          .catch(err => console.error('Failed to refresh profile', err))
      })
    }
  }, [token])

  const addToast = (message, type = 'info') => {
    setToasts(prev => [...prev, { id: ++toastId, message, type }])
  }
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  const handleSave = async () => {
    if (!username.trim()) return
    setSaving(true)
    try {
      const updated = await updateProfile({ username }, token)
      updateUser({ ...user, username: updated.username })
      setEditing(false)
      addToast('Profile updated!', 'success')
    } catch {
      addToast('Failed to update profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  const initials = user?.username?.slice(0, 2).toUpperCase() || '??'

  return (
    <main className="page-wrapper fade-in">
      <div className="container" style={{ paddingBottom: 60, maxWidth: 800 }}>
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Your account overview</p>

        <div className="profile-header">
          <div className="avatar">{initials}</div>
          <div style={{ flex: 1 }}>
            {editing ? (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  id="profile-username-input"
                  className="form-input"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  style={{ maxWidth: 260 }}
                  placeholder="Username"
                />
                <button
                  id="profile-save-btn"
                  className="btn btn-primary btn-sm"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving…' : '💾 Save'}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(false); setUsername(user?.username || '') }}>
                  Cancel
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{user?.username}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user?.email}</div>
                </div>
                <button
                  id="profile-edit-btn"
                  className="btn btn-outline btn-sm"
                  onClick={() => setEditing(true)}
                >
                  ✏️ Edit
                </button>
              </div>
            )}
            <div style={{ marginTop: 10, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
            </div>
          </div>
        </div>

        <div className="profile-stats">
          <div className="profile-stat-card">
            <div className="profile-stat-value">{user?.totalBorrowed ?? 0}</div>
            <div className="profile-stat-label">Total Books Borrowed</div>
          </div>
          <div className="profile-stat-card">
            <div className="profile-stat-value">{user?.currentlyBorrowing ?? 0}</div>
            <div className="profile-stat-label">Currently Borrowing</div>
          </div>
          <div className="profile-stat-card">
            <div className="profile-stat-value">{user?.daysPerLoan ?? 14}</div>
            <div className="profile-stat-label">Days per Loan</div>
          </div>
        </div>

        <div className="section-card">
          <div className="section-title">Account Details</div>
          <div style={{ display: 'grid', gap: 14 }}>
            {[
              { label: 'User ID', value: user?.id },
              { label: 'Email', value: user?.email },
              { label: 'Username', value: user?.username },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{label}</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          <button id="signout-profile-btn" className="btn btn-danger" onClick={logout}>
            🚪 Sign Out
          </button>
        </div>
      </div>
      <Toast toasts={toasts} removeToast={removeToast} />
    </main>
  )
}
