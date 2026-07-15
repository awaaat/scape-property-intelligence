import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, MapPin, TrendingUp, ShieldCheck, Loader2, ArrowRight, Sparkles,
  Star, CheckCircle, Building2, Landmark, Award, Clock, Users, BarChart3
} from "lucide-react";
import PageLayout from "../../components/Layout/PageLayout";
import { fadeUp, springScale, staggerContainer, VIEWPORT } from "../../styles/animations";
import { SOLUTIONS, SOLUTIONS_LIST } from "./solutionsData";
import AnalyzeTool from "./shared/AnalyzeTool";

const ICONS = { Building2, ShieldCheck, Landmark, Award, TrendingUp, CheckCircle, MapPin };

export default function Solutions() {
  const { slug } = useParams();
  const data = SOLUTIONS[slug];
  const [activeStep, setActiveStep] = useState(0);

  if (!data) return <Navigate to="/property-intel" replace />;

  const SegIcon = ICONS[data.icon];

  return (
    <PageLayout>
      {/* ── Hero (same as before) ── */}
      <section className="pc-hero-img" style={{ backgroundImage: `url(${data.heroImg})`, minHeight: "62vh" }}>
        <div className="pc-hero-img-overlay" style={{ background: `linear-gradient(180deg, rgba(${data.color},0.35) 0%, rgba(20,22,24,0.85) 65%, #14181c 100%)` }} />
        <motion.div className="pc-hero-img-inner" style={{ maxWidth: 780 }} initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.span className="pc-hero-img-eyebrow" variants={fadeUp}><Sparkles size={12} /> {data.eyebrow}</motion.span>
          <motion.h1 className="pc-hero-img-title" variants={fadeUp}>{data.title}</motion.h1>
          <motion.p className="pc-hero-img-lead" variants={fadeUp}>{data.lead}</motion.p>
          <motion.div variants={fadeUp} style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 28 }}>
            {SOLUTIONS_LIST.map((seg) => {
              const PillIcon = ICONS[seg.icon];
              const isActive = seg.slug === slug;
              return (
                <Link
                  key={seg.slug}
                  to={`/solutions/${seg.slug}`}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "8px 16px", fontSize: 13, fontFamily: "var(--font-mono)",
                    fontWeight: 600, textDecoration: "none", borderRadius: 999,
                    border: `1px solid ${isActive ? "#8fc2d6" : "rgba(255,255,255,0.15)"}`,
                    background: isActive ? "rgba(143,194,214,0.12)" : "transparent",
                    color: isActive ? "#8fc2d6" : "rgba(255,255,255,0.6)",
                    transition: "all 0.25s ease",
                  }}
                >
                  <PillIcon size={14} /> {seg.navLabel}
                </Link>
              );
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Process (now first, moved up) ── */}
      <motion.section className="pc-section pc-section-grey" initial="hidden" whileInView="visible" viewport={VIEWPORT} variants={fadeUp}>
        <div className="pc-container">
          <h2 className="pc-heading2" style={{ textAlign: "center", marginBottom: 40 }}>How it works for you</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, maxWidth: 720, margin: "0 auto" }}>
            {data.process.map((step, i) => {
              const isOpen = activeStep === i;
              return (
                <motion.div
                  key={step.title}
                  onClick={() => setActiveStep(i)}
                  whileHover={{ x: 6 }}
                  style={{
                    display: "flex", gap: 20, padding: "18px 20px", cursor: "pointer", borderRadius: 8,
                    borderLeft: `3px solid ${isOpen ? "var(--lime)" : "transparent"}`,
                    background: isOpen ? "var(--bg-raised)" : "transparent",
                    transition: "all 0.25s ease",
                  }}
                >
                  <div style={{
                    width: 40, height: 40, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 14, borderRadius: 8,
                    color: isOpen ? "var(--lime)" : "var(--text-dim)",
                    background: isOpen ? "var(--lime-bg)" : "var(--bg)",
                    border: "1px solid var(--hairline)",
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <strong style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 16, color: isOpen ? "var(--lime)" : "var(--text-h)" }}>{step.title}</strong>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                          style={{ fontSize: 14, color: "var(--text)", margin: "6px 0 0", overflow: "hidden" }}
                        >
                          {step.desc}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ── Stats with icons ── */}
      <motion.section className="pc-section" style={{ paddingTop: 48, paddingBottom: 48 }} initial="hidden" whileInView="visible" viewport={VIEWPORT} variants={staggerContainer}>
        <div className="pc-container">
          <div style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
            {data.stats.map((s) => (
              <motion.div key={s.label} variants={springScale} style={{ textAlign: "center", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ background: "var(--lime-bg)", padding: 10, borderRadius: 999, display: "flex" }}>
                  <BarChart3 size={20} color="var(--lime)" />
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color: "var(--text-h)" }}>{s.val}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Benefits as a 3‑col grid ── */}
      <motion.section className="pc-section pc-section-grey" initial="hidden" whileInView="visible" viewport={VIEWPORT} variants={fadeUp}>
        <div className="pc-container">
          <h2 className="pc-heading2" style={{ textAlign: "center" }}>Why It Matters For You</h2>
          <p className="pc-body" style={{ textAlign: "center", maxWidth: 520, margin: "0 auto 32px" }}>{data.title}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {data.benefits.map((item) => {
              const BIcon = ICONS[item.icon];
              return (
                <motion.div key={item.title} whileHover={{ y: -6 }} style={{ background: "var(--bg-raised)", padding: 24, borderRadius: 12, border: "1px solid var(--hairline)" }}>
                  <div style={{ color: "var(--lime)", marginBottom: 12 }}><BIcon size={28} /></div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text-h)", marginBottom: 6 }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: "var(--text)", margin: 0 }}>{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ── Live analyze tool ── */}
      <motion.section className="pc-section" initial="hidden" whileInView="visible" viewport={VIEWPORT} variants={fadeUp}>
        <div className="pc-container">
          <h2 className="pc-heading2" style={{ textAlign: "center" }}>Try it on a real address</h2>
          <p className="pc-body" style={{ textAlign: "center", maxWidth: 520, margin: "0 auto 28px" }}>
            Drop an address below to see the kind of report you'd hand over.
          </p>
          <AnalyzeTool render={({ address, setAddress, isSearching, result, statusMessage, errorMessage, run, Search, Loader2, motion, AnimatePresence }) => (
            <>
              <div className="pc-field">
                <label>Address or Google Maps link</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && run()}
                  placeholder="e.g. Ruiru, Kiambu County or a maps.google.com link"
                />
              </div>
              <motion.button className="pc-submit-btn" type="button" onClick={run} disabled={isSearching} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                {isSearching ? (
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ display: "inline-flex" }}>
                    <Loader2 size={14} style={{ marginRight: 8 }} />
                  </motion.span>
                ) : (
                  <Search size={14} style={{ marginRight: 8, verticalAlign: "-2px" }} />
                )}
                {isSearching ? "Analyzing..." : "Analyze Property"}
              </motion.button>

              {isSearching && statusMessage && (
                <div style={{ marginTop: 16, fontSize: 13, color: "var(--text-dim)" }}>{statusMessage}</div>
              )}
              {errorMessage && (
                <div style={{ marginTop: 16, fontSize: 13, color: "#c0392b" }}>{errorMessage}</div>
              )}

              <AnimatePresence>
                {result?.pdfUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    style={{ marginTop: 28, padding: "28px 32px", background: "var(--bg-raised)", border: "1px solid var(--hairline)", boxShadow: "var(--shadow)", borderRadius: 10 }}
                  >
                    <div style={{ fontSize: 15, color: "var(--text-h)", marginBottom: 16 }}>Your report is ready.</div>
                    <a href={result.pdfUrl} target="_blank" rel="noopener noreferrer" className="pc-submit-btn" style={{ display: "inline-block", textDecoration: "none" }}>Download Report</a>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )} />
        </div>
      </motion.section>

      {/* ── Fixed banner (now after tool) ── */}
      <motion.section
        className="pc-img-banner"
        style={{ backgroundImage: `url(${data.bannerImg})` }}
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.7 }}
      >
        <div className="pc-img-banner-overlay" style={{ background: `linear-gradient(180deg, rgba(${data.color},0.3) 0%, rgba(20,29,19,0.88) 100%)` }} />
        <div className="pc-img-banner-inner">
          <h3 className="pc-img-banner-line">{data.bannerLine}</h3>
        </div>
      </motion.section>

      {/* ── Testimonial ── */}
      <motion.section className="pc-section" initial="hidden" whileInView="visible" viewport={VIEWPORT} variants={fadeUp}>
        <div className="pc-container" style={{ maxWidth: 640, textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 2, marginBottom: 16 }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="var(--amber)" color="var(--amber)" />)}
          </div>
          <blockquote style={{ fontFamily: "var(--font-display)", fontSize: 24, fontStyle: "italic", color: "var(--text-h)", lineHeight: 1.6, margin: "0 0 20px" }}>
            "{data.testimonial.quote}"
          </blockquote>
          <strong style={{ display: "block", fontSize: 15, color: "var(--text-h)" }}>{data.testimonial.name}</strong>
          <span style={{ fontSize: 13, color: "var(--text-dim)" }}>{data.testimonial.role}</span>
        </div>
      </motion.section>

      {/* ── CTA ── */}
      <motion.section className="pc-section" style={{ background: "#14181c", textAlign: "center" }} initial="hidden" whileInView="visible" viewport={VIEWPORT} variants={fadeUp}>
        <div className="pc-container">
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "#faf8ef", marginBottom: 12 }}>Ready to check your next property?</h2>
          <p style={{ color: "rgba(255,255,255,0.65)", marginBottom: 28 }}>Start free — your first few reports don't cost anything.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/signup" className="pc-price-cta">Get Started <ArrowRight size={14} /></Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", border: "1px solid rgba(255,255,255,0.2)", color: "#faf8ef", textDecoration: "none", fontWeight: 600, fontSize: 14, borderRadius: 8 }}>
                Talk To Us
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </PageLayout>
  );
}
