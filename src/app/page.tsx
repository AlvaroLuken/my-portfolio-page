import InteractiveGlobe from "../components/InteractiveGlobe";

export default function Home() {
  const nav = [
    "Map",
    "Projects",
    "About",
    "Playground",
    "Contact",
    "Instagram",
    "LinkedIn",
  ];

  const legend = ["Orbit", "Drag to rotate", "Scroll to zoom", "San Diego ping"];

  return (
    <div className="terrain-page">
      <main className="terrain-shell">
        <section className="terrain-card">
          <aside className="terrain-left">
            <p className="terrain-eyebrow">The Trails of Alvaro</p>
            <ul className="terrain-nav">
              {nav.map((item) => (
                <li key={item}>
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>

            <ul className="terrain-legend">
              {legend.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h1 className="terrain-title">
              A creative studio where brands and stories move off-trails
            </h1>
            <p className="terrain-copy">@2026 Atelier Alvaro Inc.</p>
          </aside>

          <section className="terrain-map" aria-label="Interactive Globe">
            <div className="terrain-meta">
              <span>14:42:34 GMT</span>
              <span>San Diego, California</span>
            </div>
            <InteractiveGlobe />

            <div className="terrain-mini">
              <p>Base Camp</p>
              <h2>San Diego</h2>
              <div />
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
