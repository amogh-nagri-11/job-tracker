import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiLayers,
  FiMoon,
  FiSearch,
  FiShield,
  FiSun,
  FiZap,
} from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme.js';

const features = [
  {
    icon: FiLayers,
    title: 'Clean pipeline control',
    copy: 'Track every application in one focused board with clear statuses and no spreadsheet drift.',
  },
  {
    icon: FiSearch,
    title: 'Fast signal, less noise',
    copy: 'Spot stuck applications, follow-up gaps, and interview momentum without digging through clutter.',
  },
  {
    icon: FiShield,
    title: 'Built for consistency',
    copy: 'Keep your job search organized with structure that feels calm, sharp, and reliable every day.',
  },
];

const metrics = [
  { value: '4x', label: 'faster weekly review loops' },
  { value: '24/7', label: 'visibility into every application stage' },
  { value: '1', label: 'single workspace for your search' },
];

const workflow = [
  'Capture every role the moment you apply.',
  'Move applications through interview stages with clarity.',
  'Review progress, blockers, and next moves in minutes.',
];

export default function Landing() {
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="landing-shell">
      <div className="landing-noise" />
      <div className="landing-glow landing-glow-one" />
      <div className="landing-glow landing-glow-two" />

      <section className="landing-page">
        <nav className="landing-nav">
          <Link to="/" className="brand-mark">
            <span className="brand-mark__dot" />
            TrackFlow
          </Link>

          <div className="landing-nav__actions">
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>
            <Link to="/login" className="nav-link">
              Sign in
            </Link>
            <Link to="/register" className="button button-primary">
              Start tracking
            </Link>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy fade-up">
            <span className="eyebrow">Minimal system for ambitious job hunts</span>
            <h1>Track applications with a futuristic workflow that stays beautifully simple.</h1>
            <p className="hero-text">
              Job Tracker gives your search a polished command center for applications, interviews,
              and momentum, with a dark and light experience that feels intentional in every mode.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="button button-primary button-large">
                Create account
                <FiArrowRight />
              </Link>
              <Link to="/login" className="button button-secondary button-large">
                Explore dashboard
              </Link>
            </div>

            <div className="metric-row">
              {metrics.map((metric) => (
                <div key={metric.label} className="metric-card">
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual fade-up-delayed">
            <div className="orbital-panel">
              <div className="orbital-ring orbital-ring--outer" />
              <div className="orbital-ring orbital-ring--inner" />
              <div className="orbital-core" />

              <div className="floating-chip floating-chip--top">
                <FiZap />
                Focused
              </div>
              <div className="floating-chip floating-chip--right">
                <FiClock />
                Follow-ups
              </div>
              <div className="floating-chip floating-chip--bottom">
                <FiBarChart2 />
                Progress
              </div>

              <div className="dashboard-preview">
                <div className="dashboard-preview__header">
                  <span className="status-pill">Live pipeline</span>
                  <span className="preview-dots">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>

                <div className="preview-chart">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>

                <div className="preview-list">
                  <article>
                    <div>
                      <strong>Frontend Engineer</strong>
                      <small>Applied today</small>
                    </div>
                    <mark>Applied</mark>
                  </article>
                  <article>
                    <div>
                      <strong>Product Designer</strong>
                      <small>Interview loop</small>
                    </div>
                    <mark>Interview</mark>
                  </article>
                  <article>
                    <div>
                      <strong>Platform PM</strong>
                      <small>Offer pending</small>
                    </div>
                    <mark>Offer</mark>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="feature-grid">
          {features.map(({ icon: Icon, title, copy }) => (
            <article key={title} className="feature-card">
              <div className="feature-icon">
                <Icon />
              </div>
              <h2>{title}</h2>
              <p>{copy}</p>
            </article>
          ))}
        </section>

        <section className="showcase-panel">
          <div>
            <span className="eyebrow">How it flows</span>
            <h2>One quiet interface for a high-intensity search.</h2>
            <p>
              Designed to feel lightweight, premium, and fast, so reviewing your search becomes a
              habit instead of a chore.
            </p>
          </div>

          <div className="workflow-list">
            {workflow.map((step) => (
              <div key={step} className="workflow-item">
                <FiCheckCircle />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-panel">
          <div>
            <span className="eyebrow">Ready to launch</span>
            <h2>Bring structure to your next opportunity sprint.</h2>
          </div>
          <Link to="/register" className="button button-primary button-large">
            Build your workflow
            <FiArrowRight />
          </Link>
        </section>
      </section>
    </main>
  );
}
