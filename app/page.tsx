// app/page.tsx

// NOTE: This is the main landing page for Advertimus demo.
// NOTE: Icons: you can use <i className="bx bx-ICON_NAME"></i> anywhere you see a NOTE about icons.

export default function Home() {
  return (
    <main>
      {/* ====================== */}
      {/* HERO SECTION           */}
      {/* ====================== */}
      <section className="adv-hero">
        <div className="adv-container adv-hero-inner">
          {/* Small label above title */}
          <p className="adv-hero-eyebrow">AI-POWERED AD CREATION</p>

          {/* Main title */}
          <h1 className="adv-hero-title">
            CREATE HIGH-CONVERTING <span>AD CONTENT</span> IN MINUTES
          </h1>

          {/* Subtitle */}
          <p className="adv-hero-subtitle">
            Advertimus turns your ideas into high-quality ad campaigns — built
            to grab attention and drive real results. Chat with Advertimus about
            your product, offer, or idea...
          </p>

          {/* Chat-style input row */}
          <div className="adv-hero-chat-row">
            <div className="adv-hero-chat-input">
              {/* NOTE: you could put an icon at the start:
                  <i className="bx bx-chat adv-hero-chat-icon"></i>
              */}
              <span className="adv-hero-chat-label">
                Describe your product, audience, and offer — Advertimus does the rest.
              </span>
            </div>
            <button className="adv-hero-chat-btn">
              Start Chat <span className="adv-cta-arrow">→</span>
            </button>
          </div>

          <p className="adv-hero-note">
            Works for Meta, TikTok, YouTube, and more — powered by Advertimus AI.
          </p>

          {/* Tags row */}
          <div className="adv-hero-tags">
            <button className="adv-tag adv-tag-primary">
              {/* NOTE: optional icon here */}
              {/* <i className="bx bx-cog adv-tag-icon"></i> */}
              Automations
            </button>
            <button className="adv-tag">Ad Copy & Scripts</button>
            <button className="adv-tag">Visual Concepts</button>
            <button className="adv-tag">Performance Insights</button>
          </div>
        </div>
      </section>

      {/* ====================== */}
      {/* WHY ADVERTIMUS SECTION */}
      {/* ====================== */}
      <section className="adv-section">
        <div className="adv-container adv-section-inner">
          <h2 className="adv-section-title">Why Advertimus?</h2>
          <p className="adv-section-subtitle">
            Turn raw ideas into polished ad campaigns without wasting hours on
            copy, design, and testing.
          </p>

          <div className="adv-section-grid">
            <div className="adv-card">
              {/* NOTE: Optional icon above card title */}
              {/* <i className="bx bx-brain adv-card-icon"></i> */}
              <h3 className="adv-card-title">AI Ad Strategist</h3>
              <p className="adv-card-text">
                Advertimus acts like a full-funnel strategist that understands
                your offer and audience.
              </p>
            </div>

            <div className="adv-card">
              {/* <i className="bx bx-image-alt adv-card-icon"></i> */}
              <h3 className="adv-card-title">High-Quality Creatives</h3>
              <p className="adv-card-text">
                Get scroll-stopping angles, hooks, and scripts ready for your
                video and image tools.
              </p>
            </div>

            <div className="adv-card">
              {/* <i className="bx bx-line-chart adv-card-icon"></i> */}
              <h3 className="adv-card-title">Built for Performance</h3>
              <p className="adv-card-text">
                Campaign ideas are structured to capture attention and drive
                conversions, not just views.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== */}
      {/* TABS / AUTOMATIONS     */}
      {/* ====================== */}
      <section className="adv-tabs-section">
        <div className="adv-container">
          {/* Tabs row */}
          <div className="adv-tabs-row">
            <button className="adv-tab adv-tab-active">
              {/* NOTE: change icon name from bx-cog to anything you like */}
              <i className="bx bx-cog adv-tab-icon" />
              <span>Automations</span>
            </button>

            <button className="adv-tab">
              <i className="bx bx-magic-wand adv-tab-icon" />
              <span>AI Edits</span>
            </button>

            <button className="adv-tab">
              <i className="bx bx-image-alt adv-tab-icon" />
              <span>Visual Templates</span>
            </button>

            <button className="adv-tab">
              <i className="bx bx-cut adv-tab-icon" />
              <span>Long to Short</span>
            </button>

            <button className="adv-tab">
              <i className="bx bx-search adv-tab-icon" />
              <span>Search &amp; Import</span>
            </button>
          </div>

          {/* Tabs content area */}
          <div className="adv-tabs-content">
            {/* Left panel */}
            <div className="adv-tabs-panel">
              <h3 className="adv-tabs-title">Automations</h3>
              <p className="adv-tabs-text">
                Set up profiles and let Advertimus automatically pull, analyze,
                and prepare content using your templates.
              </p>

              <div className="adv-tabs-inner-grid">
                <div className="adv-tabs-card">
                  <p className="adv-tabs-label">3 profiles selected</p>
                  <div className="adv-tabs-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>

                <div className="adv-tabs-card">
                  <p className="adv-tabs-label">Applying Template</p>
                  <div className="adv-tabs-mini-cards">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              </div>

              <button className="adv-tabs-cta">Automation Running</button>
            </div>

            {/* Right side: Generated content preview */}
            <div className="adv-tabs-side-card">
              <div className="adv-generated-badge">AI Generated</div>
              <div className="adv-generated-thumb"></div>
              <div className="adv-generated-footer">
                <div className="adv-generated-url">
                  https://your-link.com/content
                </div>
                <button className="adv-generated-create-btn">Create</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== */}
      {/* FOOTER (SIMPLE)        */}
      {/* ====================== */}
      <footer className="adv-footer">
        <div className="adv-container adv-footer-inner">
          <div>
            <span className="adv-footer-logo">ADVERTIMUS</span>
            <span className="adv-footer-copy">
              © {new Date().getFullYear()} Advertimus. All rights reserved.
            </span>
          </div>

          <div className="adv-footer-links">
            {/* NOTE: you can add icons in footer too:
                <i className="bx bx-shield"></i> Privacy
            */}
            <a href="#" className="adv-footer-link">
              Privacy
            </a>
            <a href="#" className="adv-footer-link">
              Terms
            </a>
            <a href="#" className="adv-footer-link">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
