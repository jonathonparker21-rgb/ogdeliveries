import AdSlot from './AdSlot';

export default function PageHero({
  title,
  subtitle,
  cta
}: {
  title: string;
  subtitle: string;
  cta?: string;
}) {
  return (
    <section className="hero">
      <div className="hero__content">
        <p className="eyebrow">Featured</p>
        <h1>{title}</h1>
        <p className="lead">{subtitle}</p>
        {cta && <button className="btn">{cta}</button>}
      </div>
      <div className="hero__ad">
        <AdSlot id="hero-above-fold" position="above-fold" description="Above-the-fold leaderboard" />
      </div>
    </section>
  );
}
