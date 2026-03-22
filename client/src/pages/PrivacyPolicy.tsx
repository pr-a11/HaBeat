import { useEffect } from "react";

const Section = ({ title, children }) => (
  <div style={{ marginBottom: "2.5rem" }}>
    <h2 style={{
      fontFamily: "'Space Mono', monospace",
      fontSize: "0.85rem",
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "#00ff9d",
      marginBottom: "1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem"
    }}>
      <span style={{ color: "#00ff9d44", fontSize: "0.7rem" }}>▶</span>
      {title}
    </h2>
    <div style={{
      color: "#a0aec0",
      fontSize: "0.95rem",
      lineHeight: "1.8",
      fontFamily: "'DM Sans', sans-serif"
    }}>
      {children}
    </div>
  </div>
);

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      color: "#e2e8f0",
      padding: "4rem 1.5rem",
      fontFamily: "'DM Sans', sans-serif"
    }}>
      {/* Grid background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(rgba(0,255,157,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,157,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        pointerEvents: "none"
      }} />

      <div style={{ maxWidth: "760px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: "3.5rem" }}>
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.3em",
            color: "#00ff9d",
            marginBottom: "1rem",
            textTransform: "uppercase"
          }}>
            habeat.online / legal
          </p>
          <h1 style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: "700",
            lineHeight: "1.1",
            color: "#f7fafc",
            marginBottom: "1.5rem"
          }}>
            Privacy<br />
            <span style={{ color: "#00ff9d" }}>Policy</span>
          </h1>
          <div style={{
            display: "flex", gap: "2rem", flexWrap: "wrap",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.75rem", color: "#4a5568"
          }}>
            <span>Last updated: March 22, 2026</span>
            <span style={{ color: "#00ff9d44" }}>|</span>
            <span>Effective: March 22, 2026</span>
          </div>
          <div style={{
            marginTop: "2rem", padding: "1rem 1.5rem",
            border: "1px solid #00ff9d22",
            background: "#00ff9d08",
            borderRadius: "4px",
            fontSize: "0.9rem", color: "#718096", lineHeight: "1.7"
          }}>
            HaBeat ("we", "our", "us") operates habeat.online. This policy explains what data we collect, why, and your rights over it.
          </div>
        </div>

        <Section title="Information We Collect">
          <p style={{ marginBottom: "1rem" }}>We collect the following types of information:</p>
          <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li><strong style={{ color: "#e2e8f0" }}>Account data:</strong> Email address and password (encrypted) when you register.</li>
            <li><strong style={{ color: "#e2e8f0" }}>Usage data:</strong> Habits you track, streaks, and in-app activity to provide the service.</li>
            <li><strong style={{ color: "#e2e8f0" }}>Payment data:</strong> Processed by Paddle (our Merchant of Record). We never store your card details.</li>
            <li><strong style={{ color: "#e2e8f0" }}>Technical data:</strong> Browser type, IP address, and device info for security and analytics.</li>
          </ul>
        </Section>

        <Section title="How We Use Your Data">
          <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li>To provide and improve the HaBeat service</li>
            <li>To send transactional emails (account confirmation, receipts)</li>
            <li>To analyze usage patterns and fix bugs</li>
            <li>To comply with legal obligations</li>
          </ul>
          <p style={{ marginTop: "1rem" }}>We do <strong style={{ color: "#e2e8f0" }}>not</strong> sell your personal data to third parties.</p>
        </Section>

        <Section title="Data Storage & Security">
          <p>Your data is stored on Supabase (PostgreSQL) infrastructure with encryption at rest and in transit. We implement industry-standard security practices. While no system is 100% secure, we take reasonable precautions to protect your information.</p>
        </Section>

        <Section title="Third-Party Services">
          <p style={{ marginBottom: "1rem" }}>We use the following third-party services:</p>
          <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li><strong style={{ color: "#e2e8f0" }}>Supabase</strong> — database and authentication</li>
            <li><strong style={{ color: "#e2e8f0" }}>Paddle</strong> — payment processing and tax compliance</li>
            <li><strong style={{ color: "#e2e8f0" }}>Render</strong> — application hosting</li>
          </ul>
          <p style={{ marginTop: "1rem" }}>Each service has its own privacy policy governing their data practices.</p>
        </Section>

        <Section title="Cookies">
          <p>We use essential cookies for authentication sessions. We do not use advertising or tracking cookies. You may disable cookies in your browser, but some features may not function correctly.</p>
        </Section>

        <Section title="Your Rights">
          <p style={{ marginBottom: "1rem" }}>You have the right to:</p>
          <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and data</li>
            <li>Export your data in a portable format</li>
          </ul>
          <p style={{ marginTop: "1rem" }}>To exercise any of these rights, email us at <a href="mailto:privacy@habeat.online" style={{ color: "#00ff9d", textDecoration: "none" }}>privacy@habeat.online</a>.</p>
        </Section>

        <Section title="Children's Privacy">
          <p>HaBeat is not directed at children under 13. We do not knowingly collect data from children under 13. If you believe we have inadvertently collected such data, contact us immediately.</p>
        </Section>

        <Section title="Changes to This Policy">
          <p>We may update this policy periodically. We will notify you of significant changes via email or an in-app notice. Continued use of the service after changes constitutes acceptance.</p>
        </Section>

        <Section title="Contact">
          <p>For privacy-related questions:<br />
            <a href="mailto:privacy@habeat.online" style={{ color: "#00ff9d", textDecoration: "none" }}>privacy@habeat.online</a><br />
            HaBeat, Pune, Maharashtra, India
          </p>
        </Section>

        {/* Footer nav */}
        <div style={{
          marginTop: "4rem", paddingTop: "2rem",
          borderTop: "1px solid #ffffff0f",
          display: "flex", gap: "2rem", flexWrap: "wrap",
          fontFamily: "'Space Mono', monospace", fontSize: "0.75rem"
        }}>
          <a href="/terms" style={{ color: "#4a5568", textDecoration: "none" }}>Terms of Service</a>
          <a href="/refund" style={{ color: "#4a5568", textDecoration: "none" }}>Refund Policy</a>
          <a href="/" style={{ color: "#00ff9d", textDecoration: "none" }}>← Back to HaBeat</a>
        </div>
      </div>
    </div>
  );
}
