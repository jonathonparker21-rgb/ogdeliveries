import { policyContent } from '../../data/pages';
import { PolicySection } from '../../components/PolicySection';

export const metadata = {
  title: 'Disclaimer | OG Deliveries'
};

export default function DisclaimerPage() {
  return (
    <div className="stack">
      <div className="section-panel">
        <p className="eyebrow">Affiliate transparency</p>
        <h1>Editorial & affiliate disclaimer</h1>
        <p className="muted">
          We disclose affiliate relationships and keep ad units visually distinct from editorial content. Customize this
          page with partner names, cookie policies, and your disclosure language.
        </p>
      </div>
      <PolicySection headline={policyContent.disclaimer.headline} sections={policyContent.disclaimer.sections} />
    </div>
  );
}
