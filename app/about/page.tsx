import HighlightGrid from '../../components/HighlightGrid';
import { highlights } from '../../data/pages';

export const metadata = {
  title: 'About | OG Deliveries'
};

export default function AboutPage() {
  return (
    <div className="stack">
      <div className="section-panel">
        <p className="eyebrow">Our story</p>
        <h1>Built for affiliates and ad ops teams</h1>
        <p>
          OG Deliveries blends editorial storytelling with a monetization-ready layout. Above-the-fold hero inventory,
          in-article placements, and a sticky sidebar keep revenue opportunities visible without sacrificing readability.
        </p>
      </div>
      <HighlightGrid title="What you get" items={highlights} />
    </div>
  );
}
