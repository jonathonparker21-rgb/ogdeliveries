import { contactDetails, socialLinks } from '../../data/pages';

export const metadata = {
  title: 'Contact | OG Deliveries'
};

export default function ContactPage() {
  return (
    <div className="stack">
      <div className="section-panel">
        <p className="eyebrow">Get in touch</p>
        <h1>Contact OG Deliveries</h1>
        <p className="muted">
          Reach out for partnerships, sponsorships, or affiliate opportunities. We respond within two business days.
        </p>
      </div>
      <div className="two-column">
        <div className="contact-card">
          <h3>Editorial & partnerships</h3>
          <ul className="table-list">
            <li>Email: {contactDetails.email}</li>
            <li>Phone: {contactDetails.phone}</li>
            <li>HQ: {contactDetails.address}</li>
          </ul>
        </div>
        <div className="section-panel">
          <h3>Social</h3>
          <p className="muted">Join our channels for product drops, delivery insights, and live interviews.</p>
          <div className="site-footer__links">
            {socialLinks.map((link) => (
              <a key={link.label} className="nav-link" href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
