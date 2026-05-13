import { ReactNode } from 'react';

export default function HighlightGrid({
  title,
  items
}: {
  title: string;
  items: { title: string; body: string; tag?: string; action?: ReactNode }[];
}) {
  return (
    <section className="highlight-grid">
      <div className="highlight-grid__heading">
        <h2>{title}</h2>
        <p className="muted">Pre-built blocks optimized for monetized editorial.</p>
      </div>
      <div className="grid">
        {items.map((item) => (
          <article key={item.title} className="card">
            {item.tag && <span className="pill">{item.tag}</span>}
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            {item.action}
          </article>
        ))}
      </div>
    </section>
  );
}
