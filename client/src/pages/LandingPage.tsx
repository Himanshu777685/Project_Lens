import { Link } from "react-router-dom";
import { useAuth } from "../auth";

const capabilities = [
  {
    icon: "01",
    title: "Capture the full story",
    copy: "Bring WhatsApp threads, emails, site notes, and meeting records into one searchable project inbox.",
  },
  {
    icon: "02",
    title: "Turn noise into clarity",
    copy: "Run analysis across your source records to surface decisions, tasks, risks, and conflicts.",
  },
  {
    icon: "03",
    title: "Keep teams aligned",
    copy: "Give every stakeholder a shared, current view of what changed and what needs attention next.",
  },
];

export function LandingPage() {
  const { user } = useAuth();
  const workspacePath = user ? "/projects" : "/signup";

  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">One source of project truth</p>
          <h1>Make every project conversation <em>count.</em></h1>
          <p className="hero-lede">
            ProjectLens turns scattered project communications into clear, actionable intelligence
            so your team can move forward with confidence.
          </p>
          <div className="hero-actions">
            <Link className="primary-button primary-button--large" to={workspacePath}>
              {user ? "Open workspace" : "Start for free"} <span>→</span>
            </Link>
            <a className="hero-text-link" href="#how-it-works">See how it works <span>↓</span></a>
          </div>
          <p className="hero-note"><span className="note-check">✓</span> Built for teams who build the real world</p>
        </div>
        <div className="hero-visual" aria-label="Project intelligence preview">
          <div className="visual-orb visual-orb--one" />
          <div className="visual-orb visual-orb--two" />
          <div className="preview-window">
            <div className="preview-window-bar"><span /><span /><span /><small>ProjectLens / Project truth</small></div>
            <div className="preview-content">
              <div className="preview-kicker">ACTIVE PROJECT</div>
              <div className="preview-title-row"><strong>Riverside Residence</strong><span className="preview-live">● Live</span></div>
              <div className="preview-metrics">
                <div><strong>24</strong><span>Records</span></div>
                <div><strong>08</strong><span>Open tasks</span></div>
                <div><strong>03</strong><span>Risks found</span></div>
              </div>
              <div className="preview-insight">
                <span className="preview-insight-icon">✦</span>
                <div><strong>Project truth updated</strong><small>3 decisions and 2 risks found in your latest records.</small></div>
                <span className="preview-arrow">→</span>
              </div>
              <div className="preview-lines"><span /><span /><span /></div>
            </div>
          </div>
          <div className="floating-badge floating-badge--insight"><span>✦</span><div><strong>New insight</strong><small>Decision detected</small></div></div>
          <div className="floating-badge floating-badge--signal"><span>✓</span><div><strong>All aligned</strong><small>Just now</small></div></div>
        </div>
      </section>
      <section className="trust-strip"><span>BUILT FOR THE PEOPLE BEHIND</span><strong>CONSTRUCTION</strong><strong>DESIGN</strong><strong>OPERATIONS</strong><strong>DELIVERY</strong></section>
      <section className="landing-section" id="how-it-works">
        <div className="section-intro-centered">
          <p className="eyebrow">Less searching. More building.</p>
          <h2>Your project has a story.<br /><em>We help you see it.</em></h2>
          <p>Every important decision is already somewhere in your communications. ProjectLens brings it to the surface.</p>
        </div>
        <div className="capability-grid" id="capabilities">
          {capabilities.map((capability) => (
            <article className="capability-card" key={capability.icon}>
              <span className="capability-number">{capability.icon}</span>
              <h3>{capability.title}</h3>
              <p>{capability.copy}</p>
              <span className="capability-arrow">↗</span>
            </article>
          ))}
        </div>
      </section>
      <section className="landing-cta">
        <div><p className="eyebrow">Ready when you are</p><h2>Give your project a clearer<br /><em>next step.</em></h2></div>
        <Link className="primary-button primary-button--light" to={workspacePath}>
          {user ? "Open your workspace" : "Create your workspace"} <span>→</span>
        </Link>
      </section>
      <footer className="public-footer"><Link className="brand" to="/"><span className="brand-mark">PL</span><strong>ProjectLens</strong></Link><span>Project intelligence for teams who build.</span></footer>
    </main>
  );
}
