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
                <span>+254 700 123 456</span>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Mail size={18} color="var(--text-dim)" />
                <span>info@scapedatasolutions.com</span>
              </div>
            </div>
            <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--hairline)" }}>
              {/* Static map placeholder — replace with actual iframe if needed */}
              <img src="/site-images/map-placeholder.png" alt="Map" style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }} />
            </div>
          </div>
        </div>
      </motion.section>
    </PageLayout>
  </>
  );
}
