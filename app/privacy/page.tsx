import { policyContent } from '../../data/pages';
import { PolicySection } from '../../components/PolicySection';

export const metadata = {
  title: 'Privacy | OG Deliveries'
};

export default function PrivacyPage() {
  return (
    <div className="stack">
      <div className="section-panel">
        <p className="eyebrow">Compliance</p>
        <h1>Privacy & data use</h1>
        <p className="muted">
          We honor reader privacy and clearly label affiliate relationships. Use this page to document analytics tools,
          consent flows, and any cookie banners you enable through your ad tech stack.
        </p>
      </div>
      <PolicySection headline={policyContent.privacy.headline} sections={policyContent.privacy.sections} />
    </div>
  );
}
