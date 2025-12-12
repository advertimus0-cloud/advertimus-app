export default function HomePage() {
  return (
    <>
      <main className="adv-home">
        {/* HERO */}
        <section className="adv-hero">
          <div className="adv-hero-inner">
            <span className="adv-badge">AI Advertising Superpower</span>

            <h1>
              Build ads that <span>think</span>,<br />
              launch faster, and <span>win</span>.
            </h1>

            <p>
              Advertimus turns your ideas into premium ad creatives —
              images, videos, and smart strategies powered by AI.
            </p>

            <div className="adv-hero-actions">
              <button className="btn-primary">Get Started</button>
              <button className="btn-secondary">See How It Works</button>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="adv-features">
          <h2>What Advertimus Does Best</h2>

          <div className="adv-features-grid">
            <div className="adv-feature-card">
              <h3>Ad Post Lab</h3>
              <p>
                Graphic design posts, product shots, and fashion visuals built
                with precision.
              </p>
            </div>

            <div className="adv-feature-card">
              <h3>Ad Video Lab</h3>
              <p>
                Professional video ads, fashion commercials, and product videos
                powered by AI.
              </p>
            </div>

            <div className="adv-feature-card">
              <h3>Advertimus IQ</h3>
              <p>
                Smart system that analyzes and optimizes your ad performance
                24/7.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="adv-cta">
          <h2>Ready to build ads like a pro?</h2>
          <p>
            Stop wasting time and budget. Let Advertimus handle creativity and
            optimization.
          </p>

          <button className="btn-primary big">Start Free</button>
        </section>
      </main>

      {/* ✅ CSS in the same file (works in Server Components) */}
      <style>{`
        .adv-home {
          background: #000;
          color: #fff;
          min-height: 100vh;
        }

        .adv-hero {
          padding: 120px 20px 80px;
          text-align: center;
          background: radial-gradient(
            circle at top,
            rgba(93, 26, 27, 0.35),
            transparent 60%
          );
        }

        .adv-hero-inner {
          max-width: 900px;
          margin: 0 auto;
        }

        .adv-badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 13px;
          letter-spacing: 0.5px;
          background: rgba(93, 26, 27, 0.25);
          border: 1px solid rgba(93, 26, 27, 0.6);
          margin-bottom: 20px;
        }

        .adv-hero h1 {
          font-size: 56px;
          line-height: 1.1;
          margin-bottom: 20px;
        }

        .adv-hero h1 span {
          color: #5d1a1b;
        }

        .adv-hero p {
          color: #bdbdbd;
          font-size: 18px;
          max-width: 600px;
          margin: 0 auto 32px;
        }

        .adv-hero-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-primary {
          background: #5d1a1b;
          color: #fff;
          border: none;
          padding: 14px 26px;
          border-radius: 999px;
          font-size: 15px;
          cursor: pointer;
        }

        .btn-primary.big {
          padding: 16px 34px;
          font-size: 16px;
        }

        .btn-secondary {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 14px 26px;
          border-radius: 999px;
          font-size: 15px;
          cursor: pointer;
        }

        .adv-features {
          padding: 80px 20px;
          text-align: center;
        }

        .adv-features h2 {
          font-size: 36px;
          margin-bottom: 48px;
        }

        .adv-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .adv-feature-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 28px;
          text-align: left;
        }

        .adv-feature-card h3 {
          margin-bottom: 10px;
          font-size: 20px;
        }

        .adv-feature-card p {
          color: #bdbdbd;
          font-size: 15px;
        }

        .adv-cta {
          padding: 80px 20px 120px;
          text-align: center;
          background: radial-gradient(
            circle at bottom,
            rgba(22, 17, 66, 0.4),
            transparent 60%
          );
        }

        .adv-cta h2 {
          font-size: 40px;
          margin-bottom: 16px;
        }

        .adv-cta p {
          color: #bdbdbd;
          margin-bottom: 28px;
          font-size: 17px;
        }

        @media (max-width: 768px) {
          .adv-hero {
            padding: 90px 16px 60px;
          }

          .adv-hero h1 {
            font-size: 38px;
          }

          .adv-features h2,
          .adv-cta h2 {
            font-size: 28px;
          }
        }
      `}</style>
    </>
  );
}
