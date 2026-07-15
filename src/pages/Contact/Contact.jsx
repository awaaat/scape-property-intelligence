import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import PageLayout from "../../components/Layout/PageLayout";
import { fadeUp, VIEWPORT } from "../../styles/animations";
import SEO from "../../components/SEO/SEO";


export default function Contact() {
  return (
    
    <>
    <SEO title="Contact Us" description="Contact Scape Data Solutions for property intelligence reports, API access, or partnership enquiries." path="/contact" />
    <PageLayout>
      {/* Short hero */}
      <section className="pc-hero" style={{ minHeight: "30vh", background: "linear-gradient(135deg, #1b2126 0%, #2a3138 100%)", display: "flex", alignItems: "center" }}>
        <div className="pc-container" style={{ textAlign: "center" }}>
          <motion.span variants={fadeUp} initial="hidden" animate="visible" style={{ display: "inline-block", fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, letterSpacing: 1, color: "#8fc2d6", marginBottom: 16, textTransform: "uppercase" }}>CONTACT</motion.span>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#faf8ef", fontSize: "clamp(2.2rem, 6vw, 4rem)", margin: "0 0 16px" }}>Get in touch</motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" style={{ color: "rgba(255,255,255,0.65)", fontSize: 17, lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>We'll get back to you within one business day.</motion.p>
        </div>
      </section>

      {/* Two‑col: form + map */}
      <motion.section className="pc-section" initial="hidden" whileInView="visible" viewport={VIEWPORT} variants={fadeUp}>
        <div className="pc-container-wide" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
          <div>
            <h2 className="pc-heading2" style={{ marginBottom: 8 }}>Send a message</h2>
            <p className="pc-body" style={{ marginBottom: 28 }}>We'll reply within 24 hours.</p>
            <form style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="pc-field">
                <label>Your name</label>
                <input type="text" placeholder="e.g. Jane Doe" />
              </div>
              <div className="pc-field">
                <label>Email address</label>
                <input type="email" placeholder="jane@example.com" />
              </div>
              <div className="pc-field">
                <label>Message</label>
                <textarea rows="4" placeholder="Tell us what you need..." style={{ padding: "8px 12px", fontFamily: "inherit", borderRadius: 6, border: "1px solid var(--hairline)", background: "var(--bg)", color: "var(--text)", width: "100%" }} />
              </div>
              <motion.button type="submit" className="pc-submit-btn" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ alignSelf: "start" }}>
                <Send size={14} style={{ marginRight: 8 }} /> Send message
              </motion.button>
            </form>
          </div>
          <div>
            <div style={{ background: "var(--bg-raised)", padding: 24, borderRadius: 12, border: "1px solid var(--hairline)", marginBottom: 24 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text-h)", marginBottom: 12 }}>Office</h3>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
                <MapPin size={18} color="var(--text-dim)" />
                <span>Nairobi, Kenya</span>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
                <Phone size={18} color="var(--text-dim)" />
                <span>+254 718 889 559</span>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Mail size={18} color="var(--text-dim)" />
                <span>info@scapedatasolutions.com</span>
              </div>
            </div>

            {/* Data-engineering visual — replaces broken map image */}
            <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--hairline)", background: "#1b2126", height: 240 }}>
              <svg
                viewBox="0 0 400 240"
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Data pipeline illustration"
              >
                <defs>
                  <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8fc2d6" stopOpacity="0.15" />
                    <stop offset="50%" stopColor="#8fc2d6" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#8fc2d6" stopOpacity="0.15" />
                  </linearGradient>
                </defs>

                {/* faint grid backdrop */}
                {Array.from({ length: 9 }).map((_, i) => (
                  <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="240" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                ))}
                {Array.from({ length: 5 }).map((_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 60} x2="400" y2={i * 60} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                ))}

                {/* connecting pipeline */}
                <path d="M 55 120 L 150 120 L 150 70 L 245 70 M 150 120 L 245 120 L 245 170 L 340 170 M 245 120 L 340 120"
                      fill="none" stroke="url(#pipeGrad)" strokeWidth="2" />

                {/* flowing data pulses */}
                {[0, 1.2, 2.4].map((delay, i) => (
                  <circle key={i} r="3.5" fill="#fdb840">
                    <animateMotion
                      dur="3.2s"
                      begin={`${delay}s`}
                      repeatCount="indefinite"
                      path="M 55 120 L 150 120 L 150 120 L 245 120 L 245 120 L 340 120"
                    />
                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="3.2s" begin={`${delay}s`} repeatCount="indefinite" />
                  </circle>
                ))}

                {/* Source node (raw data) */}
                <g transform="translate(30,105)">
                  <rect x="0" y="0" width="50" height="30" rx="6" fill="#2a3138" stroke="#8fc2d6" strokeWidth="1.5" />
                  <circle cx="12" cy="8" r="2" fill="#8fc2d6" />
                  <circle cx="20" cy="8" r="2" fill="#8fc2d6" opacity="0.6" />
                  <circle cx="28" cy="8" r="2" fill="#8fc2d6" opacity="0.3" />
                  <line x1="8" y1="18" x2="42" y2="18" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                  <line x1="8" y1="23" x2="34" y2="23" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                </g>

                {/* Transform node (gear / pipeline processing) */}
                <g transform="translate(125,45)">
                  <rect x="0" y="0" width="50" height="50" rx="8" fill="#2a3138" stroke="#8fc2d6" strokeWidth="1.5" />
                  <g transform="translate(25,25)">
                    <circle r="11" fill="none" stroke="#fdb840" strokeWidth="2" />
                    <circle r="4" fill="#fdb840" />
                    {Array.from({ length: 6 }).map((_, i) => {
                      const angle = (i * 60 * Math.PI) / 180;
                      const x1 = Math.cos(angle) * 11;
                      const y1 = Math.sin(angle) * 11;
                      const x2 = Math.cos(angle) * 15;
                      const y2 = Math.sin(angle) * 15;
                      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fdb840" strokeWidth="2" />;
                    })}
                  </g>
                </g>

                {/* Database node */}
                <g transform="translate(220,45)">
                  <ellipse cx="25" cy="8" rx="25" ry="8" fill="#2a3138" stroke="#8fc2d6" strokeWidth="1.5" />
                  <path d="M 0 8 L 0 42 A 25 8 0 0 0 50 42 L 50 8" fill="#2a3138" stroke="#8fc2d6" strokeWidth="1.5" />
                  <ellipse cx="25" cy="25" rx="25" ry="8" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                </g>

                {/* Dashboard / insight node */}
                <g transform="translate(220,145)">
                  <rect x="0" y="0" width="55" height="42" rx="6" fill="#2a3138" stroke="#8fc2d6" strokeWidth="1.5" />
                  <rect x="8" y="20" width="6" height="14" fill="#fdb840" opacity="0.8" />
                  <rect x="18" y="12" width="6" height="22" fill="#8fc2d6" opacity="0.9" />
                  <rect x="28" y="24" width="6" height="10" fill="#fdb840" opacity="0.6" />
                  <rect x="38" y="8" width="6" height="26" fill="#8fc2d6" opacity="0.6" />
                </g>

                {/* API / output node */}
                <g transform="translate(320,105)">
                  <rect x="0" y="0" width="50" height="30" rx="15" fill="#2a3138" stroke="#fdb840" strokeWidth="1.5" />
                  <text x="25" y="19" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#fdb840">API</text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </motion.section>
    </PageLayout>
  </>
  );
}