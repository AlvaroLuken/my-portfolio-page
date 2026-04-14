import BackgroundAudio from "../components/BackgroundAudio";
import InteractiveGlobe from "../components/InteractiveGlobe";

export default function Home() {
  const nav = [
    { label: "Map" },
    { label: "Projects" },
    { label: "About" },
    { label: "Playground" },
    { label: "Contact" },
    { label: "Instagram" },
    { label: "LinkedIn", icon: "in" },
    { label: "X", icon: "X" },
  ];

  const legend = [
    "Orbit",
    "Drag to rotate",
    "Scroll to zoom",
    "Click San Diego ping",
  ];

  return (
    <div className="terrain-page">
      <main className="terrain-shell">
        <section className="terrain-card">
          <aside className="terrain-left">
            <p className="terrain-eyebrow">The Trails of Alvaro</p>
            <ul className="terrain-nav">
              {nav.map((item) => (
                <li key={item.label}>
                  <a href="#">
                    <span>{item.label}</span>
                    {item.icon ? <span className="terrain-nav-icon">{item.icon}</span> : null}
                  </a>
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
            <div className="terrain-left-bottom">
              <p className="terrain-copy">@2026 Atelier Alvaro Inc.</p>
            </div>
          </aside>

          <section className="terrain-map" aria-label="Interactive Globe">
            <div className="terrain-meta">
              <span>14:42:34 GMT</span>
              <span>San Diego, California</span>
            </div>
            <InteractiveGlobe />
            <BackgroundAudio src="/ElGato.mp4" className="terrain-audio-in-map" />

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
