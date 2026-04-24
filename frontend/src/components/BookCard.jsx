// Genre-specific Unsplash images - high quality book covers
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

export default function BookCard({ book, onClick }) {
  const style = GENRE_STYLES[book.genre] || DEFAULT_STYLE
  const available = book.availableCopies > 0
  const coverImage = book.coverImage || GENRE_IMAGES[book.genre] || DEFAULT_IMAGE

  return (
    <article
      className="book-card fade-in"
      onClick={() => onClick(book)}
      id={`book-card-${book.id}`}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(book)}
    >
      <div className="book-card-cover" style={{ background: style.bg }}>
        <img 
          src={coverImage} 
          alt={book.title}
          className="book-cover-image"
          loading="lazy"
          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
        />
        <span className="book-cover-emoji" style={{ display: 'none', position: 'relative', zIndex: 1, fontSize: '3rem' }}>{style.emoji}</span>
      </div>
      <div className="book-card-body">
        <div className="book-card-title">{book.title}</div>
        <div className="book-card-author">by {book.author}</div>
      </div>
      <div className="book-card-footer">
        <span className={`badge badge-${book.genre?.toLowerCase()}`}>{book.genre}</span>
        <span className={`availability-pill ${available ? 'available' : 'unavailable'}`}>
          {available ? `${book.availableCopies} left` : 'Unavailable'}
        </span>
      </div>
    </article>
  )
}
