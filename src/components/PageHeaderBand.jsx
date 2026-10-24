export default function PageHeaderBand({ eyebrow, title, subtitle, badge, children, breadcrumbs }) {
  return (
    <header className="page-header-band">
      <div className="header-band-overlay" />
      <div className="header-band-container">
        {breadcrumbs && (
          <nav className="header-breadcrumbs" aria-label="Breadcrumb">
            {Array.isArray(breadcrumbs) ? (
              breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1
                return (
                  <span key={idx} className="breadcrumb-item">
                    {crumb.path && !isLast ? (
                      <a
                        href={`#${crumb.path.startsWith('/') ? crumb.path : `/${crumb.path}`}`}
                        className="breadcrumb-link"
                      >
                        {crumb.label}
                      </a>
                    ) : (
                      <span className={isLast ? 'breadcrumb-current' : 'breadcrumb-link'}>
                        {crumb.label}
                      </span>
                    )}
                    {!isLast && <span className="breadcrumb-sep"> / </span>}
                  </span>
                )
              })
            ) : (
              breadcrumbs
            )}
          </nav>
        )}

        <div className="header-band-main">
          <div className="header-band-content">
            {eyebrow && <span className="header-eyebrow">{eyebrow}</span>}
            <h1 className="header-band-title">{title}</h1>
            {subtitle && <p className="header-band-subtitle">{subtitle}</p>}
          </div>
          {badge && <div className="header-band-badge-wrapper">{badge}</div>}
        </div>
        {children}
      </div>
    </header>
  )
}
