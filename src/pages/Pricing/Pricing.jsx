import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, AlertCircle, Gift, Receipt, Layers } from "lucide-react";
import PageLayout from "../../components/Layout/PageLayout";
import { fetchPricing, fetchMyUsage } from "../../api/billing";
import { isLoggedIn } from "../../api/auth";
import { fadeUp, VIEWPORT } from "../../styles/animations";
import SEO from "../../components/SEO/SEO";


const RADIUS = 78;
const CIRC = 2 * Math.PI * RADIUS;

// Rendered immediately on mount, before the live /billing/pricing/ call
// resolves (or if it fails/never runs, e.g. during prerendering when no
// backend is up). This keeps the page from ever being stuck on a bare
// loading spinner — both for crawlers snapshotting the prerendered HTML
// and for real users on a slow or flaky connection. Update these numbers
// if the actual plan changes so the fallback doesn't drift from reality.
const FALLBACK_PRICING = { free_reports: 3, price_per_report: 300, currency: "KES" };

export default function Pricing() {
  const [pricing, setPricing] = useState(FALLBACK_PRICING);
  const [usage, setUsage] = useState(null);
  const [stale, setStale] = useState(false); // true if we're showing fallback because the live fetch failed

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const p = await fetchPricing();
        if (cancelled) return;
        setPricing(p);
        setStale(false);
        if (isLoggedIn()) {
          try {
            const u = await fetchMyUsage();
            if (!cancelled) setUsage(u);
          } catch {
            // Usage is a nice-to-have on top of pricing; ignore failures.
          }
        }
      } catch {
        if (!cancelled) setStale(true); // keep FALLBACK_PRICING on screen, just flag it
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const remaining = usage ? usage.freeReportsRemaining : pricing.free_reports ?? 0;
  const total = pricing.free_reports || 1;
  const pct = Math.max(0, Math.min(1, remaining / total));
  const offset = CIRC * (1 - pct);

  const STAGES = [
    { icon: <Gift size={18} />, title: "Free trial", text: `${pricing.free_reports} reports, no card needed.` },
    { icon: <Receipt size={18} />, title: "Pay as you go", text: `${pricing.currency} ${pricing.price_per_report} flat, per report after that.` },
    { icon: <Layers size={18} />, title: "Scale up", text: "Bulk uploads & API access on request." },
  ];

  return (
    <>
    <SEO title="Pricing" description="Pricing plans for Scape Data Solutions property intelligence reports and API access." path="/pricing" />
    <PageLayout>
      <section style={{ background: "#14181c", padding: "90px 0 70px", textAlign: "center" }}>
        <div className="pc-container">
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: 2, color: "#8fc2d6", textTransform: "uppercase" }}>Plans</span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,4vw,2.8rem)", color: "#faf8ef", margin: "16px 0" }}>One price, no tiers to compare</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 520, margin: "0 auto" }}>Try it free. Pay only for what you check after that.</p>
        </div>
      </section>

      <section className="pc-section">
        <div className="pc-container">
          {stale && (
            <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "12px 20px", background: "rgba(166,64,46,0.1)", border: "1px solid var(--red)", color: "var(--red)", maxWidth: 560, margin: "0 auto 30px", fontSize: 13 }}>
              <AlertCircle size={16} /> Showing standard pricing — couldn't confirm your live plan details. <Link to="/contact" style={{ color: "var(--red)", fontWeight: 600, textDecoration: "underline" }}>Contact us</Link> if this looks wrong.
            </div>
          )}
          <>
            <div style={{ display: "flex", gap: 60, alignItems: "center", justifyContent: "center", flexWrap: "wrap", marginBottom: 70 }}>
              <motion.svg width={200} height={200} initial={{ rotate: -90 }} style={{ transform: "rotate(-90deg)" }}>
                <circle cx={100} cy={100} r={RADIUS} fill="none" stroke="var(--hairline)" strokeWidth={10} />
                <motion.circle
                  cx={100} cy={100} r={RADIUS} fill="none" stroke="var(--lime)" strokeWidth={10}
                  strokeDasharray={CIRC} strokeLinecap="round"
                  initial={{ strokeDashoffset: CIRC }}
                  whileInView={{ strokeDashoffset: offset }}
                  viewport={VIEWPORT}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.svg>
              <div style={{ position: "relative", marginLeft: -160, pointerEvents: "none" }} />
              <div style={{ textAlign: "left", maxWidth: 320 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 56, fontWeight: 700, color: "var(--text-h)", lineHeight: 1 }}>{remaining}</div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 0.5, margin: "8px 0 20px" }}>
                  {usage ? "Free reports left on your account" : "Free reports on trial"}
                </p>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "var(--text-h)" }}>
                  {pricing.currency} {pricing.price_per_report} <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-dim)", fontFamily: "var(--font-sans)" }}>/ report after</span>
                </div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ marginTop: 20 }}>
                  <Link to={isLoggedIn() ? "/property-intel" : "/signup"} className="pc-price-cta">
                    {isLoggedIn() ? "Check A Property" : "Start Free"} <ArrowRight size={14} />
                  </Link>
                </motion.div>
              </div>
            </div>

            <div style={{ position: "relative", maxWidth: 780, margin: "0 auto" }}>
              <div style={{ position: "absolute", top: 22, left: 40, right: 40, height: 2, background: "var(--hairline)" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {STAGES.map((s, i) => (
                  <motion.div key={s.title} initial="hidden" whileInView="visible" viewport={VIEWPORT} variants={fadeUp} custom={i}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: 220, position: "relative" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--lime)", color: "#faf8ef", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, position: "relative", zIndex: 1 }}>
                      {s.icon}
                    </div>
                    <strong style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--text-h)" }}>{s.title}</strong>
                    <p style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 6 }}>{s.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <p style={{ textAlign: "center", marginTop: 50, fontSize: 13, color: "var(--text-dim)" }}>
              Need bulk pricing or an API key? <Link to="/contact" style={{ color: "var(--lime)", fontWeight: 600 }}>Talk to us</Link>.
            </p>
          </>
        </div>
      </section>
    </PageLayout>
  </>
  );
}