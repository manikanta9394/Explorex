import PageHeaderBand from '../components/PageHeaderBand'
import SEOHead from '../components/SEOHead'

export default function TermsPage() {
  return (
    <div className="policy-page-shell">
      <SEOHead
        title="Terms of Service | Explorex"
        description="Terms of service, content licensing, and cultural data attribution for Explorex."
      />

      <PageHeaderBand
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Terms of Service' },
        ]}
        eyebrow="Legal & Licensing"
        title="Terms of Service"
        subtitle="Last updated: October 2026. Guidelines for using Explorex cultural data, maps, and AI services."
      />

      <div className="policy-content-container">
        <section className="policy-section">
          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing or using Explorex, you agree to comply with these Terms of Service. If you do not agree, you may discontinue use of the platform at any time.
          </p>
        </section>

        <section className="policy-section">
          <h3>2. Verified Information &amp; On-Site Disclaimers</h3>
          <p>
            While Explorex cross-checks all entry fees, opening hours, and rules against official Archaeological Survey of India (ASI) circulars and state tourism records, local site conditions, weather events, restoration closures, or temporary festival guidelines may alter visiting conditions without notice. Travelers are advised to verify operational details locally.
          </p>
        </section>

        <section className="policy-section">
          <h3>3. Open Data &amp; Image Licensing</h3>
          <p>
            Monument descriptions, structured data, and photographs are sourced under Creative Commons licenses (CC-BY-SA) via Wikidata and Wikimedia Commons. Original photographers are credited on every destination detail page. Re-use of media must respect the respective Creative Commons license terms.
          </p>
        </section>

        <section className="policy-section">
          <h3>4. Respectful Community Conduct</h3>
          <p>
            User reviews and community feedback must maintain a respectful, constructive tone. Submissions containing hate speech, obscenity, defamation, spam, or promotional material will be flagged and removed by our moderation system.
          </p>
        </section>
      </div>
    </div>
  )
}
