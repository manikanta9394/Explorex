export default function PageSkeletonLoader({ type = 'default' }) {
  if (type === 'cards') {
    return (
      <div className="skeleton-grid-container" aria-busy="true" aria-label="Loading content">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-img-box shimmer" />
            <div className="skeleton-body">
              <div className="skeleton-line title shimmer" />
              <div className="skeleton-line sub shimmer" />
              <div className="skeleton-line meta shimmer" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="skeleton-page-shell" aria-busy="true" aria-label="Loading page">
      <div className="skeleton-hero shimmer">
        <div className="skeleton-hero-inner">
          <div className="skeleton-pill shimmer" />
          <div className="skeleton-heading shimmer" />
          <div className="skeleton-subtitle shimmer" />
        </div>
      </div>
      <div className="skeleton-content-row">
        <div className="skeleton-col main shimmer" />
        <div className="skeleton-col side shimmer" />
      </div>
    </div>
  )
}
