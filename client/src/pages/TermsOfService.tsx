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

export default function TermsOfService() {
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
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(rgba(0,255,157,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,157,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        pointerEvents: "none"
      }} />

      <div style={{ maxWidth: "760px", margin: "0 auto", position: "relative", zIndex: 1 }}>
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
            Terms of<br />
            <span style={{ color: "#00ff9d" }}>Service</span>
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
            By using HaBeat at habeat.online, you agree to these terms. Please read them carefully before using our service.
          </div>
        </div>

        <Section title="Acceptance of Terms">
          <p>By accessing or using HaBeat ("Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service. We reserve the right to update these terms at any time.</p>
        </Section>

        <Section title="Description of Service">
          <p>HaBeat is a habit tracking SaaS application that helps users build and maintain daily routines. We offer both free and paid plan tiers. Features may change over time as we improve the product.</p>
        </Section>

        <Section title="Account Registration">
          <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li>You must provide a valid email address to create an account.</li>
            <li>You are responsible for maintaining the security of your account credentials.</li>
            <li>You must be at least 13 years old to use the Service.</li>
            <li>One person may not maintain multiple accounts to abuse free tier limits.</li>
          </ul>
        </Section>

        <Section title="Payment & Billing">
          <p style={{ marginBottom: "1rem" }}>HaBeat offers a one-time lifetime access purchase. Payments are processed by Paddle, our Merchant of Record.</p>
          <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li>All prices are listed in USD unless otherwise stated.</li>
            <li>Paddle handles all tax calculations and compliance (VAT, GST, etc.).</li>
            <li>Lifetime access grants you access to the plan's features indefinitely.</li>
            <li>We reserve the right to change pricing for new customers at any time.</li>
          </ul>
        </Section>

        <Section title="Acceptable Use">
          <p style={{ marginBottom: "1rem" }}>You agree not to:</p>
          <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li>Use the Service for any illegal or unauthorized purpose</li>
            <li>Attempt to reverse engineer, hack, or disrupt the Service</li>
            <li>Share your account access with others in violation of your plan</li>
            <li>Upload harmful, offensive, or malicious content</li>
            <li>Use automated bots or scripts to abuse the Service</li>
          </ul>
        </Section>

        <Section title="Intellectual Property">
          <p>All content, design, code, and branding of HaBeat is owned by us and protected by applicable intellectual property laws. Your habit data belongs to you. We claim no ownership over content you create within the app.</p>
        </Section>

        <Section title="Service Availability">
          <p>We strive for high availability but do not guarantee uninterrupted access. We may perform maintenance, updates, or experience outages. We are not liable for downtime or data loss beyond our reasonable control.</p>
        </Section>

        <Section title="Termination">
          <p>We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time from your account settings. Upon termination, your data will be deleted within 30 days.</p>
        </Section>

        <Section title="Limitation of Liability">
          <p>HaBeat is provided "as is" without warranties of any kind. To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from your use of the Service.</p>
        </Section>

        <Section title="Governing Law">
          <p>These terms are governed by the laws of India. Any disputes shall be resolved in the courts of Pune, Maharashtra, India.</p>
        </Section>

        <Section title="Contact">
          <p>For questions about these terms:<br />
            <a href="mailto:legal@habeat.online" style={{ color: "#00ff9d", textDecoration: "none" }}>legal@habeat.online</a><br />
            HaBeat, Pune, Maharashtra, India
          </p>
        </Section>

        <div style={{
          marginTop: "4rem", paddingTop: "2rem",
          borderTop: "1px solid #ffffff0f",
          display: "flex", gap: "2rem", flexWrap: "wrap",
          fontFamily: "'Space Mono', monospace", fontSize: "0.75rem"
        }}>
          <a href="/privacy" style={{ color: "#4a5568", textDecoration: "none" }}>Privacy Policy</a>
          <a href="/refund" style={{ color: "#4a5568", textDecoration: "none" }}>Refund Policy</a>
          <a href="/" style={{ color: "#00ff9d", textDecoration: "none" }}>← Back to HaBeat</a>
        </div>
      </div>
    </div>
  );
}
