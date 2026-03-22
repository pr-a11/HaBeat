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

export default function RefundPolicy() {
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
            Refund<br />
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

          {/* Highlight box */}
          <div style={{
            marginTop: "2rem", padding: "1.25rem 1.5rem",
            border: "1px solid #00ff9d33",
            background: "#00ff9d0a",
            borderRadius: "4px",
            fontSize: "0.95rem", color: "#a0aec0", lineHeight: "1.7"
          }}>
            <span style={{ color: "#00ff9d", fontFamily: "'Space Mono', monospace", fontSize: "0.8rem" }}>TL;DR —</span>{" "}
            We offer a <strong style={{ color: "#e2e8f0" }}>14-day money-back guarantee</strong>, no questions asked.
          </div>
        </div>

        <Section title="14-Day Money-Back Guarantee">
          <p>If you purchased a HaBeat lifetime plan and are not satisfied, you may request a full refund within <strong style={{ color: "#e2e8f0" }}>14 days of purchase</strong>. No questions asked. We want you to love HaBeat — if it's not for you, we'll make it right.</p>
        </Section>

        <Section title="How to Request a Refund">
          <p style={{ marginBottom: "1rem" }}>To request a refund:</p>
          <ol style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li>Email <a href="mailto:support@habeat.online" style={{ color: "#00ff9d", textDecoration: "none" }}>support@habeat.online</a> within 14 days of purchase</li>
            <li>Include your purchase email and order ID (from your Paddle receipt)</li>
            <li>We will process your refund within 5-7 business days</li>
          </ol>
          <p style={{ marginTop: "1rem" }}>Refunds are returned to the original payment method via Paddle.</p>
        </Section>

        <Section title="Eligibility">
          <p style={{ marginBottom: "1rem" }}>Refunds are available if:</p>
          <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li>The request is made within 14 days of the original purchase date</li>
            <li>The purchase was made directly through habeat.online</li>
          </ul>
          <p style={{ marginTop: "1rem", marginBottom: "1rem" }}>Refunds are <strong style={{ color: "#e2e8f0" }}>not</strong> available for:</p>
          <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li>Requests made after the 14-day window</li>
            <li>Accounts suspended for Terms of Service violations</li>
          </ul>
        </Section>

        <Section title="Chargebacks">
          <p>We encourage you to contact us before initiating a chargeback with your bank. Chargebacks increase costs for everyone. We are committed to resolving issues fairly and quickly — just reach out.</p>
        </Section>

        <Section title="Contact">
          <p>Refund requests and questions:<br />
            <a href="mailto:support@habeat.online" style={{ color: "#00ff9d", textDecoration: "none" }}>support@habeat.online</a><br />
            We typically respond within 24 hours on business days.
          </p>
        </Section>

        <div style={{
          marginTop: "4rem", paddingTop: "2rem",
          borderTop: "1px solid #ffffff0f",
          display: "flex", gap: "2rem", flexWrap: "wrap",
          fontFamily: "'Space Mono', monospace", fontSize: "0.75rem"
        }}>
          <a href="/privacy" style={{ color: "#4a5568", textDecoration: "none" }}>Privacy Policy</a>
          <a href="/terms" style={{ color: "#4a5568", textDecoration: "none" }}>Terms of Service</a>
          <a href="/" style={{ color: "#00ff9d", textDecoration: "none" }}>← Back to HaBeat</a>
        </div>
      </div>
    </div>
  );
}
