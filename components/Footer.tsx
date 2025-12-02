import Link from 'next/link';
import { navigation, socialLinks } from '../data/pages';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div>
          <h3>OG Deliveries</h3>
          <p className="muted">Insights on delivery, commerce, and local logistics.</p>
        </div>
        <div>
          <h4>Navigate</h4>
          <div className="site-footer__links">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="nav-link">
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4>Follow</h4>
          <div className="site-footer__links">
            {socialLinks.map((item) => (
              <a key={item.label} href={item.href} className="nav-link" target="_blank" rel="noreferrer">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <p className="muted small">&copy; {new Date().getFullYear()} OG Deliveries. All rights reserved.</p>
    </footer>
  );
}
