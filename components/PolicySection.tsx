export function PolicySection({
  headline,
  sections
}: {
  headline: string;
  sections: { title: string; body: string }[];
}) {
  return (
    <section className="policy">
      <h1>{headline}</h1>
      <div className="policy__grid">
        {sections.map((section) => (
          <article key={section.title} className="card">
            <h3>{section.title}</h3>
            <p>{section.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
