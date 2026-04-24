import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { borrowBook } from '../api/borrowApi.js'

// Genre-specific Unsplash images
const GENRE_IMAGES = {
  Fiction:    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
  Science:    'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
  History:    'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=600&fit=crop',
  Fantasy:    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop',
  Technology: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=600&fit=crop',
  Biography:  'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=600&fit=crop',
}
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop'

const GENRE_STYLES = {
  Fiction:    { bg: 'linear-gradient(135deg,#4c1d95,#6d28d9)', emoji: '✨' },
  Science:    { bg: 'linear-gradient(135deg,#0e7490,#06b6d4)', emoji: '🔬' },
  History:    { bg: 'linear-gradient(135deg,#92400e,#d97706)', emoji: '🏛️' },
  Fantasy:    { bg: 'linear-gradient(135deg,#9d174d,#ec4899)', emoji: '🐉' },
  Technology: { bg: 'linear-gradient(135deg,#065f46,#10b981)', emoji: '💻' },
  Biography:  { bg: 'linear-gradient(135deg,#9a3412,#f97316)', emoji: '🧑‍💼' },
}
const DEFAULT_STYLE = { bg: 'linear-gradient(135deg,#1e1b35,#2e1065)', emoji: '📖' }

export default function BookModal({ book, onClose, onBorrowed, activeBorrowIds = [] }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!book) return null

  const style = GENRE_STYLES[book.genre] || DEFAULT_STYLE
  const coverImage = book.coverImage || GENRE_IMAGES[book.genre] || DEFAULT_IMAGE
  const available = book.availableCopies > 0
  const alreadyBorrowed = activeBorrowIds.includes(book.id)

  const handleBorrow = async () => {
    if (!user) return
    setLoading(true)
    setError('')
    try {
      await borrowBook(user.id, book.id)
      setSuccess(true)
      onBorrowed && onBorrowed()
      setTimeout(onClose, 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to borrow. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()} id="book-modal-overlay">
      <div className="modal" id={`book-modal-${book.id}`}>
        <div className="modal-header">
          <span className={`badge badge-${book.genre?.toLowerCase()}`}>{book.genre}</span>
          <button className="btn btn-ghost btn-sm" onClick={onClose} id="modal-close-btn" aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-cover" style={{ background: style.bg }}>
            <img 
              src={coverImage} 
              alt={book.title}
              className="modal-cover-image"
              loading="lazy"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
            <span className="modal-cover-emoji" style={{ display: 'none' }}>{style.emoji}</span>
          </div>

          <h2 className="modal-title">{book.title}</h2>
          <p className="modal-meta">by {book.author} · {book.publishedYear || 'N/A'}</p>
          {book.isbn && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>ISBN: {book.isbn}</p>}

          {book.description && (
            <p className="modal-description">{book.description}</p>
          )}

          <div className="modal-stats">
            <div className="stat-box">
              <div className="stat-box-value">{book.totalCopies}</div>
              <div className="stat-box-label">Total Copies</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-value" style={{ color: book.availableCopies > 0 ? 'var(--success)' : 'var(--danger)' }}>
                {book.availableCopies}
              </div>
              <div className="stat-box-label">Available</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-value" style={{ fontSize: '1rem' }}>14</div>
              <div className="stat-box-label">Days Loan</div>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">🎉 Book borrowed successfully!</div>}

          <div style={{ display: 'flex', gap: 12 }}>
            {alreadyBorrowed ? (
              <button className="btn btn-outline" disabled style={{ flex: 1 }}>
                ✅ Already on your shelf
              </button>
            ) : (
              <button
                id="borrow-btn"
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={!available || loading || success}
                onClick={handleBorrow}
              >
                {loading ? '⏳ Borrowing…' : !available ? '📵 Unavailable' : '📗 Borrow Book'}
              </button>
            )}
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}
