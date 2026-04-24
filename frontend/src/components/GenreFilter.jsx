const GENRES = ['All', 'Fiction', 'Science', 'History', 'Fantasy', 'Technology', 'Biography']

export default function GenreFilter({ selected, onChange }) {
  return (
    <div className="genre-filter">
      {GENRES.map(g => (
        <button
          key={g}
          id={`genre-filter-${g.toLowerCase()}`}
          className={`genre-pill${selected === g ? ' active' : ''}`}
          onClick={() => onChange(g)}
        >
          {g}
        </button>
      ))}
    </div>
  )
}
