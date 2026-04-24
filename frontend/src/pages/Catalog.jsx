import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import BookCard from '../components/BookCard.jsx'
import BookModal from '../components/BookModal.jsx'
import SkeletonCard from '../components/SkeletonCard.jsx'
import GenreFilter from '../components/GenreFilter.jsx'
import Toast from '../components/Toast.jsx'
import { getBooks } from '../api/bookApi.js'
import { getUserActiveBorrows } from '../api/borrowApi.js'

let toastId = 0

export default function Catalog() {
  const { user } = useAuth()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [genre, setGenre] = useState('All')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedBook, setSelectedBook] = useState(null)
  const [activeBorrowIds, setActiveBorrowIds] = useState([])
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info') => {
    setToasts(prev => [...prev, { id: ++toastId, message, type }])
  }
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getBooks(genre, debouncedSearch)
      setBooks(data)
    } catch {
      addToast('Failed to load books', 'error')
    } finally {
      setLoading(false)
    }
  }, [genre, debouncedSearch])

  useEffect(() => { fetchBooks() }, [fetchBooks])

  useEffect(() => {
    if (!user) return
    getUserActiveBorrows(user.id)
      .then(records => setActiveBorrowIds(records.map(r => r.bookId)))
      .catch(() => {})
  }, [user])

  const handleBorrowed = () => {
    addToast('Book borrowed! Check your shelf 📚', 'success')
    fetchBooks()
    if (user) {
      getUserActiveBorrows(user.id)
        .then(records => setActiveBorrowIds(records.map(r => r.bookId)))
        .catch(() => {})
    }
  }

  return (
    <main className="page-wrapper fade-in">
      <div className="container" style={{ paddingBottom: 60 }}>
        <h1 className="page-title">Book Catalog</h1>
        <p className="page-subtitle">Discover your next great read</p>

        <div className="filters-row">
          <GenreFilter selected={genre} onChange={setGenre} />
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              id="catalog-search"
              type="text"
              placeholder="Search by title or author…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="books-grid">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : books.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-title">No books found</div>
            <div className="empty-state-desc">Try a different genre or search term</div>
          </div>
        ) : (
          <div className="books-grid">
            {books.map(book => (
              <BookCard key={book.id} book={book} onClick={setSelectedBook} />
            ))}
          </div>
        )}
      </div>

      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onBorrowed={handleBorrowed}
          activeBorrowIds={activeBorrowIds}
        />
      )}

      <Toast toasts={toasts} removeToast={removeToast} />
    </main>
  )
}
