import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="page-shell">
      <Header />
      <main className="page-shell__content">{children}</main>
      <Footer />
    </div>
  );
}
