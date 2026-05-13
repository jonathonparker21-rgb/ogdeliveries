import AdSlot from '../components/AdSlot';
import HighlightGrid from '../components/HighlightGrid';
import PageHero from '../components/PageHero';
import { cmsNotes, heroContent, highlights } from '../data/pages';

export default function HomePage() {
  return (
    <div className="stack">
      <PageHero title={heroContent.title} subtitle={heroContent.subtitle} cta={heroContent.cta} />

      <div className="two-column">
        <section className="stack">
          <div className="section-header">
            <div>
              <p className="eyebrow">Headless CMS ready</p>
              <h2>Connect Contentful or Sanity</h2>
            </div>
            <span className="section-header__meta">Fast, cached, and secure.</span>
          </div>
          <p className="muted">
            The layout ships with dedicated ad slots: above-the-fold, in-article, and a sticky sidebar. Connect your
            Contentful or Sanity dataset to populate the hero, highlight cards, and sidebar callouts.
          </p>

          <HighlightGrid
            title="Pre-styled sections"
            items={highlights.map((item) => ({
              ...item,
              action: <span className="muted small">Ready for live CMS feeds</span>
            }))}
          />

          <article className="section-panel">
            <div className="section-header">
              <h3>In-article sponsorship</h3>
              <span className="section-header__meta">Visible without breaking reading flow</span>
            </div>
            <p>
              Drop an ad script into the slot below to monetize long-form posts. The styling keeps a clear distinction
              between editorial and sponsored placements.
            </p>
            <AdSlot id="article-inline" position="in-article" description="In-article rectangle" />
          </article>
        </section>

        <div className="stack">
          <AdSlot id="sidebar-1" position="sidebar" description="Sidebar skyscraper" />
          <div className="section-panel">
            <p className="eyebrow">CDN & HTTPS</p>
            <h3>Performance & trust</h3>
            <p className="muted">Pre-rendered pages, CDN-friendly assets, and middleware that enforces HTTPS redirects.</p>
            <ul className="table-list">
              <li>✔ Static export-ready Next.js layout</li>
              <li>✔ Strict-Transport-Security header enabled</li>
              <li>✔ Structured ad slots for faster viewability</li>
            </ul>
          </div>
          <div className="section-panel">
            <p className="eyebrow">CMS fallback</p>
            <h3>{cmsNotes.platform}</h3>
            <p className="muted">{cmsNotes.setup}</p>
            <p>{cmsNotes.fallback}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
