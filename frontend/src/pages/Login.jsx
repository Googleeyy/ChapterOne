import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { loginUser, registerUser } from '../api/userApi.js'

export default function Login() {
  const { login } = useAuth()
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (tab === 'register') {
        await registerUser({ username: form.username, email: form.email, password: form.password })
        // Auto-login after register
        const result = await loginUser({ email: form.email, password: form.password })
        login(result.user, result.token)
      } else {
        const result = await loginUser({ email: form.email, password: form.password })
        login(result.user, result.token)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">📚</div>
          <h1 className="auth-title">ChapterOne</h1>
          <p className="auth-subtitle">Your community library</p>
        </div>

        <div className="auth-tabs">
          <button
            id="tab-login"
            className={`auth-tab${tab === 'login' ? ' active' : ''}`}
            onClick={() => { setTab('login'); setError('') }}
          >
            Sign In
          </button>
          <button
            id="tab-register"
            className={`auth-tab${tab === 'register' ? ' active' : ''}`}
            onClick={() => { setTab('register'); setError('') }}
          >
            Register
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} id="auth-form">
          {tab === 'register' && (
            <div className="form-group">
              <label className="form-label" htmlFor="input-username">Username</label>
              <input
                id="input-username"
                className="form-input"
                type="text"
                placeholder="Your name"
                value={form.username}
                onChange={e => set('username', e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="input-email">Email</label>
            <input
              id="input-email"
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="input-password">Password</label>
            <input
              id="input-password"
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => set('password', e.target.value)}
              required
              minLength={6}
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? '⏳ Please wait…' : tab === 'login' ? '🚀 Sign In' : '✨ Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          {tab === 'login'
            ? "Don't have an account? "
            : 'Already have an account? '}
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError('') }}
            style={{ padding: '2px 6px', color: 'var(--accent)' }}
          >
            {tab === 'login' ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  )
}
