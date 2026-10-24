import PageHeaderBand from '../components/PageHeaderBand'
import SEOHead from '../components/SEOHead'

export default function PrivacyPage() {
  return (
    <div className="policy-page-shell">
      <SEOHead
        title="Privacy Policy | Explorex"
        description="Learn how Explorex safeguards your personal data, saved itineraries, and location privacy."
      />

      <PageHeaderBand
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Privacy Policy' },
        ]}
        eyebrow="Data Protection"
        title="Privacy Policy"
        subtitle="Last updated: October 2026. Explorex respects your privacy and is built with minimal data collection principles."
      />

      <div className="policy-content-container">
        <section className="policy-section">
          <h3>1. Our Core Privacy Philosophy</h3>
          <p>
            Explorex is designed to be usable without surrendering your private personal information. Visitors can explore all monuments, generate routes, and save places as guest explorers without mandatory account registration.
          </p>
        </section>

        <section className="policy-section">
          <h3>2. Information We Collect</h3>
          <ul>
            <li><strong>Account Information:</strong> When you register an account, we store your email address, display name, and avatar preference.</li>
            <li><strong>Trip &amp; Saved Data:</strong> Saved places, custom itineraries, and AI conversation logs are stored to provide continuity across refreshes.</li>
            <li><strong>Location Data:</strong> If you allow browser geolocation, your coordinates are used purely client-side to calculate distances and multimodal routes to nearby monuments. We never log or sell your real-time GPS tracking.</li>
            <li><strong>Feedback &amp; Reports:</strong> Reports submitted via the Feedback panel include your feedback message, rating, and the URL of the page referenced.</li>
          </ul>
        </section>

        <section className="policy-section">
          <h3>3. Data Isolation and Security</h3>
          <p>
            All user data is secured with Postgres Row Level Security (RLS). A user can only access their own saved places, private itineraries, and feedback history. We do not use third-party behavioral advertising trackers or sell personal data.
          </p>
        </section>

        <section className="policy-section">
          <h3>4. Your Right to Delete</h3>
          <p>
            You have full ownership of your data. You can delete your saved places, chat conversations, and entire account at any time through the <a href="#/profile">Profile Settings</a> page under the Danger Zone section.
          </p>
        </section>
      </div>
    </div>
  )
}
