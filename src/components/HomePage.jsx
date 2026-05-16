import { useState } from 'react';
import { DecorativeBackground } from './DecorativeBackground';
import styles from '../styles/home.module.css';

const FEATURES = [
  {
    icon: '📋',
    title: 'Task Management',
    description: 'Assign responsibilities across family members and track progress in real time.',
  },
  {
    icon: '👥',
    title: 'Guest Tracking',
    description: 'Manage RSVPs, dietary preferences, and seating — all in one place.',
  },
  {
    icon: '💰',
    title: 'Budget Control',
    description: 'Track expenses by category and stay within budget for every celebration.',
  },
  {
    icon: '📅',
    title: 'Event Schedule',
    description: 'Multi-day timelines with ceremonies, meals, and activities clearly mapped.',
  },
  {
    icon: '👨‍👩‍👧‍👦',
    title: 'Family Roles',
    description: 'Coordinators lead; members contribute — everyone stays in sync.',
  },
  {
    icon: '✨',
    title: 'Beautiful Dashboard',
    description: 'A warm, intuitive interface designed for joyful family events.',
  },
];

const STEPS = [
  { step: '01', title: 'Create your event', text: 'Set up your celebration with dates, venues, and key details.' },
  { step: '02', title: 'Invite your family', text: 'Add coordinators and members with clear roles for everyone.' },
  { step: '03', title: 'Plan together', text: 'Assign tasks, track guests, and manage budgets as a team.' },
  { step: '04', title: 'Celebrate stress-free', text: 'Stay organized so you can focus on what matters — the joy.' },
];

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export function HomePage({ onGetStarted }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const navTo = (id) => {
    closeMenu();
    scrollTo(id);
  };

  return (
    <div className={styles.page}>
      <DecorativeBackground />
      <header className={styles.header}>
        <button type="button" className={styles.logoBtn} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className={styles.logoMark}>S</span>
          <span className={styles.logoText}>Samaroh</span>
        </button>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          <button type="button" onClick={() => navTo('features')}>Features</button>
          <button type="button" onClick={() => navTo('how-it-works')}>How It Works</button>
          <button type="button" onClick={() => navTo('contact')}>Contact</button>
          <button type="button" className={styles.navLogin} onClick={() => { closeMenu(); onGetStarted(); }}>
            Login
          </button>
        </nav>

        <button type="button" className={styles.headerCta} onClick={onGetStarted}>
          Get Started
        </button>

        <button
          type="button"
          className={styles.menuToggle}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              Family celebrations, beautifully coordinated
            </span>

            <h1 className={styles.headline}>
              Plan joyful celebrations with everyone,{' '}
              <span className={styles.headlineAccent}>effortlessly.</span>
            </h1>

            <p className={styles.subtext}>
              Bring structure to multi-day family events. Assign responsibilities, track guests,
              manage budgets, and keep everyone in sync — so no task falls through the cracks.
            </p>

            <div className={styles.ctaGroup}>
              <button type="button" className={styles.primaryBtn} onClick={onGetStarted}>
                Start Planning Free
              </button>
              <button type="button" className={styles.secondaryBtn} onClick={() => navTo('features')}>
                Explore Features
              </button>
            </div>

            <div className={styles.socialProof}>
              <div className={styles.avatars} aria-hidden>
                <span className={styles.avatar}>A</span>
                <span className={styles.avatar}>B</span>
                <span className={styles.avatar}>C</span>
                <span className={styles.avatar}>D</span>
              </div>
              <p>Trusted by 500+ families</p>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.imageFrame}>
              <img
                src="/hero-celebration.png"
                alt="Family celebrating a traditional Indian festival together"
                className={styles.heroImage}
              />
              <div className={styles.floatingCard}>
                <span className={styles.floatingIcon} aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </span>
                <div>
                  <strong>12 Tasks Done</strong>
                  <span>Wedding prep on track</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className={styles.features}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Features</span>
            <h2>Everything you need for flawless celebrations</h2>
            <p>From the first invitation to the final farewell — Samaroh keeps your family organized.</p>
          </div>
          <div className={styles.featureGrid}>
            {FEATURES.map((feature) => (
              <article key={feature.title} className={styles.featureCard}>
                <span className={styles.featureIcon}>{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how-it-works" className={styles.howItWorks}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>How It Works</span>
            <h2>Four simple steps to celebration bliss</h2>
            <p>Get your entire family on the same page in minutes, not days.</p>
          </div>
          <div className={styles.stepsGrid}>
            {STEPS.map((item) => (
              <article key={item.step} className={styles.stepCard}>
                <span className={styles.stepNumber}>{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.ctaBanner}>
          <div className={styles.ctaBannerInner}>
            <h2>Ready to plan your next celebration?</h2>
            <p>Join hundreds of families who coordinate weddings, festivals, and reunions with ease.</p>
            <button type="button" className={styles.primaryBtn} onClick={onGetStarted}>
              Get Started — It&apos;s Free
            </button>
          </div>
        </section>
      </main>

      <footer id="contact" className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <span className={styles.logoMark}>S</span>
            <span className={styles.logoText}>Samaroh</span>
            <p>Family event coordination, beautifully made.</p>
          </div>
          <div className={styles.footerLinks}>
            <button type="button" onClick={() => navTo('features')}>Features</button>
            <button type="button" onClick={() => navTo('how-it-works')}>How It Works</button>
            <button type="button" onClick={onGetStarted}>Sign In</button>
          </div>
        </div>
        <p className={styles.copyright}>© {new Date().getFullYear()} Samaroh. Made with love for family celebrations.</p>
      </footer>
    </div>
  );
}