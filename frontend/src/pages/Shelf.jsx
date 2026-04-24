import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import Toast from '../components/Toast.jsx'
import { getUserHistory, returnBook } from '../api/borrowApi.js'

let toastId = 0

const GENRE_EMOJI = {
  Fiction: '✨', Science: '🔬', History: '🏛️',
  Fantasy: '🐉', Technology: '💻', Biography: '🧑‍💼'
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function isOverdue(dueDate, status) {
  if (status !== 'ACTIVE') return false
  return new Date(dueDate) < new Date()
}

export default function Shelf() {
  const { user } = useAuth()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ACTIVE')
  const [returning, setReturning] = useState(null)
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info') => {
    setToasts(prev => [...prev, { id: ++toastId, message, type }])
  }
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  useEffect(() => {
    if (!user) return
    setLoading(true)
    getUserHistory(user.id)
      .then(setRecords)
      .catch(() => addToast('Failed to load shelf', 'error'))
      .finally(() => setLoading(false))
  }, [user])

  const handleReturn = async (record) => {
    setReturning(record.id)
    try {
      await returnBook(record.id)
      setRecords(prev => prev.map(r =>
        r.id === record.id ? { ...r, status: 'RETURNED', returnDate: new Date().toISOString() } : r
      ))
      addToast(`"${record.bookTitle}" returned successfully!`, 'success')
    } catch (err) {
      addToast(err.response?.data?.error || 'Return failed', 'error')
    } finally {
      setReturning(null)
    }
  }

  const filtered = records.filter(r => filter === 'ALL' || r.status === filter)

  return (
    <main className="page-wrapper">
      <div className="container" style={{ paddingTop: 36, paddingBottom: 60 }}>
        <h1 className="page-title">My Shelf</h1>
        <p className="page-subtitle">Your reading history and active loans</p>

        <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
          {['ACTIVE', 'RETURNED', 'ALL'].map(f => (
            <button
              key={f}
              id={`shelf-filter-${f.toLowerCase()}`}
              className={`genre-pill${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'ACTIVE' ? '📗 Active' : f === 'RETURNED' ? '✅ Returned' : '📋 All'}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '60px 0' }}>
            Loading your shelf…
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🗂️</div>
            <div className="empty-state-title">Nothing here yet</div>
            <div className="empty-state-desc">
              {filter === 'ACTIVE' ? 'Browse the catalog and borrow a book!' : 'No records found'}
            </div>
          </div>
        ) : (
          <div>
            {filtered.map(record => {
              const overdue = isOverdue(record.dueDate, record.status)
              const statusClass = overdue ? 'overdue' : record.status.toLowerCase()
              return (
                <div key={record.id} className="borrow-card fade-in">
                  <div className="borrow-cover" style={{ background: 'var(--bg-elevated)' }}>
                    {GENRE_EMOJI[record.bookGenre] || '📖'}
                  </div>
                  <div className="borrow-info">
                    <div className="borrow-title">{record.bookTitle}</div>
                    <div className="borrow-author">by {record.bookAuthor}</div>
                    <div className="borrow-dates">
                      <span>📅 Borrowed: {formatDate(record.borrowDate)}</span>
                      <span>⏰ Due: {formatDate(record.dueDate)}</span>
                      {record.returnDate && <span>✅ Returned: {formatDate(record.returnDate)}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                    <span className={`status-badge ${statusClass}`}>
                      {overdue ? 'Overdue' : record.status}
                    </span>
                    {record.status === 'ACTIVE' && (
                      <button
                        id={`return-btn-${record.id}`}
                        className="btn btn-outline btn-sm"
                        onClick={() => handleReturn(record)}
                        disabled={returning === record.id}
                      >
                        {returning === record.id ? '⏳' : '↩️ Return'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <Toast toasts={toasts} removeToast={removeToast} />
    </main>
  )
}
