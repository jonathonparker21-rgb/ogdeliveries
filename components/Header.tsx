import Link from 'next/link';
import { navigation } from '../data/pages';

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__brand">
        <Link href="/" className="site-header__logo">
          OG Deliveries
        </Link>
        <p className="site-header__tagline">Logistics news, monetization-ready.</p>
      </div>
      <nav className="site-header__nav" aria-label="Primary navigation">
        {navigation.map((item) => (
          <Link key={item.name} href={item.href} className="nav-link">
            {item.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
