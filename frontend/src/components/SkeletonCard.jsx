export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-cover" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-line full" />
        <div className="skeleton skeleton-line medium" />
        <div className="skeleton skeleton-line short" />
      </div>
    </div>
  )
}
