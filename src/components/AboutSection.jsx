import { CheckCircle2, Compass, XCircle } from 'lucide-react'

export default function AboutSection() {
  const problemsAndSolutions = [
    {
      problem: 'Juggling 5 different apps for directions, timings, ticket counters, stays, and reviews.',
      solution: 'A single unified intelligence portal combining destinations, navigation, rules, and dining.',
    },
    {
      problem: 'Outdated blog posts with incorrect entry fees, surprise camera charges, and dress codes.',
      solution: 'Transparent prices in ₹, verified visiting guidelines, opening hours, and photography rules.',
    },
    {
      problem: 'Inaccurate coordinates and broken map pins leading to frustrating detours.',
      solution: 'Precision Telangana GPS coordinates with interactive Leaflet marker clustering.',
    },
    {
      problem: 'Generic search results that miss local culture, heritage nuance, and golden-hour beauty.',
      solution: 'Specialized TourMate AI assistant tuned for Hyderabad history, cuisine, and local tips.',
    },
  ]

  const stats = [
    { value: '120+', label: 'Curated Landmarks', detail: 'Monuments, forts, lakes & temples' },
    { value: '₹ INR', label: 'Verified Pricing', detail: 'Real ticket fees & photography costs' },
    { value: '3 Modes', label: 'Multimodal Routing', detail: 'Walking, cycling & driving distances' },
    { value: '100%', label: 'Offline Resilient', detail: 'Cached routing & instant fallback' },
  ]

  return (
    <section className="about-section scroll-reveal" id="about">
      <div className="about-container">
        {/* Header */}
        <div className="about-header">
          <span className="eyebrow">
            <Compass size={14} /> The Explorex Mission
          </span>
          <h2>
            What Explorex Does &amp;
            <br />
            <em>the problem we solve.</em>
          </h2>
          <p className="about-lead">
            Exploring Telangana’s 500-year heritage shouldn’t mean getting lost between scattered map apps, outdated travel blogs, and confusing ticket counters. Explorex brings verified destinations, multimodal navigation, ticket prices in ₹, and local culinary gems into one seamless experience.
          </p>
        </div>

        {/* Problem vs Solution Grid */}
        <div className="about-comparison-grid">
          <div className="comparison-card problem-card reveal-slide-left">
            <div className="comparison-card-head">
              <span className="icon-pill problem-pill">
                <XCircle size={18} /> The Friction
              </span>
              <h3>The Old Way of Traveling</h3>
              <p>Fragmented, unreliable, and frustrating</p>
            </div>
            <ul className="comparison-list">
              {problemsAndSolutions.map((item, idx) => (
                <li key={idx} className="problem-item">
                  <span className="bullet-cross">✕</span>
                  <span>{item.problem}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="comparison-card solution-card reveal-slide-right">
            <div className="comparison-card-head">
              <span className="icon-pill solution-pill">
                <CheckCircle2 size={18} /> The Solution
              </span>
              <h3>The Explorex Way</h3>
              <p>Intelligent, curated, and connected</p>
            </div>
            <ul className="comparison-list">
              {problemsAndSolutions.map((item, idx) => (
                <li key={idx} className="solution-item">
                  <span className="bullet-check">✓</span>
                  <span>{item.solution}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Key Metrics / Stat Strip */}
        <div className="about-stats-strip">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-box">
              <span className="stat-number">{stat.value}</span>
              <strong className="stat-label">{stat.label}</strong>
              <small className="stat-detail">{stat.detail}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
