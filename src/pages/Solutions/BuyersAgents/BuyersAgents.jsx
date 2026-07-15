import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck, CheckCircle2, ArrowRight, Star } from "lucide-react";
import PageLayout from "../../../components/Layout/PageLayout";
import { fadeUp, staggerContainer, VIEWPORT } from "../../../styles/animations";
import { SOLUTIONS } from "../solutionsData";
import SolutionsNav from "../shared/SolutionsNav";
import AnalyzeTool from "../shared/AnalyzeTool";
import styles from "./BuyersAgents.module.css";
import SEO from "../../../components/SEO/SEO";


const data = SOLUTIONS["buyers-agents"];

const COMPARISON = [
  { claim: "\"It's priced right for the area\"", verified: "Checked against 11 real comparable sales in the last 24 months" },
  { claim: "\"No flooding issues here\"", verified: "Flood zone data pulled from independent risk sources" },
  { claim: "\"Easy access, good road\"", verified: "Road access verified against mapping data, not a walkthrough" },
];

export default function BuyersAgents() {
  return (
    
    <>
    <SEO title="Solutions for Buyers Agents" description="Due diligence data on land values, accessibility, and nearby amenities in minutes, not days." path="/solutions/buyers-agents" />
    <PageLayout>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className="pc-container">
            <span className={styles.kicker}><ShieldCheck size={12} style={{ verticalAlign: "-2px", marginRight: 6 }} />{data.eyebrow}</span>
            <h1 className={styles.title}>{data.title}</h1>
            <p className={styles.lead}>{data.lead}</p>
            <SolutionsNav current="buyers-agents" />
          </div>
        </section>

        <div className={styles.compareWrap}>
          <h2 style={{ fontFamily: "var(--font-display)", color: "#f2f7f8", fontSize: 24, textAlign: "center", marginBottom: 30 }}>What sellers say vs. what we verify</h2>
          <div className={styles.compareHead}><div>Seller's claim</div><div>Scape verifies</div></div>
          {COMPARISON.map((row) => (
            <motion.div key={row.claim} className={styles.compareRow} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT}>
              <div className={styles.claimCell}>{row.claim}</div>
              <div className={styles.verifiedCell}>{row.verified}</div>
            </motion.div>
          ))}
        </div>

        <div className={styles.statsBar}>
          {data.stats.map((s) => (
            <motion.div key={s.label} className={styles.statCell} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VIEWPORT}>
              <div className={styles.statVal}>{s.val}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className={styles.checklistWrap}>
          <div className="pc-container">
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "#16262c", textAlign: "center", marginBottom: 30 }}>Before your client signs</h2>
            {data.benefits.map((item, i) => (
              <motion.div key={item.title} className={styles.checklistItem} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={VIEWPORT} transition={{ delay: i * 0.1 }}>
                <div className={styles.checkIcon}><CheckCircle2 size={16} /></div>
                <div>
                  <strong style={{ display: "block", fontFamily: "var(--font-display)", color: "#16262c" }}>{item.title}</strong>
                  <p style={{ fontSize: 13.5, color: "#4a5d61", margin: "4px 0 0" }}>{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.section className="pc-section" initial="hidden" whileInView="visible" viewport={VIEWPORT} variants={fadeUp} style={{ background: "#0f1a1e" }}>
          <div className="pc-container">
            <h2 style={{ fontFamily: "var(--font-display)", color: "#f2f7f8", textAlign: "center", fontSize: 24, marginBottom: 24 }}>Verify a listing right now</h2>
            <AnalyzeTool render={({ address, setAddress, isSearching, result, statusMessage, errorMessage, run, Search, Loader2, motion: M, AnimatePresence }) => (
              <div style={{ maxWidth: 560, margin: "0 auto" }}>
                <div style={{ display: "flex", border: "1px solid rgba(111,179,194,0.3)", background: "rgba(255,255,255,0.03)" }}>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} onKeyDown={(e) => e.key === "Enter" && run()}
                    placeholder="Paste listing address or maps link"
                    style={{ flex: 1, background: "transparent", border: "none", color: "#f2f7f8", padding: "14px 18px", outline: "none" }} />
                  <button type="button" onClick={run} disabled={isSearching}
                    style={{ background: "#1d4a52", color: "#f2f7f8", border: "none", padding: "0 24px", fontFamily: "var(--font-mono)", fontWeight: 700, cursor: "pointer" }}>
                    {isSearching ? "Verifying..." : "Verify"}
                  </button>
                </div>
                {isSearching && statusMessage && (
                  <div style={{ marginTop: 14, fontSize: 13, color: "#a8d3db" }}>{statusMessage}</div>
                )}
                {errorMessage && (
                  <div style={{ marginTop: 14, fontSize: 13, color: "#e0897a" }}>{errorMessage}</div>
                )}
                <AnimatePresence>
                  {result?.pdfUrl && (
                    <M.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ marginTop: 20, padding: 24, background: "rgba(111,179,194,0.08)", border: "1px solid rgba(111,179,194,0.25)" }}>
                      <a href={result.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#6fb3c2", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>Download Report</a>
                    </M.div>
                  )}
                </AnimatePresence>
              </div>
            )} />
          </div>
        </motion.section>

        <motion.section className="pc-section" initial="hidden" whileInView="visible" viewport={VIEWPORT} variants={fadeUp}>
          <div className="pc-container" style={{ maxWidth: 640, textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 2, marginBottom: 16 }}>{[...Array(5)].map((_, i) => <Star key={i} size={16} fill="var(--amber)" color="var(--amber)" />)}</div>
            <blockquote style={{ fontFamily: "var(--font-display)", fontSize: 22, fontStyle: "italic", color: "var(--text-h)" }}>"{data.testimonial.quote}"</blockquote>
            <strong style={{ display: "block", marginTop: 16 }}>{data.testimonial.name}</strong>
            <span style={{ fontSize: 13, color: "var(--text-dim)" }}>{data.testimonial.role}</span>
            <div style={{ marginTop: 28 }}>
              <Link to="/signup" className="pc-price-cta">Get Started <ArrowRight size={14} /></Link>
            </div>
          </div>
        </motion.section>
      </div>
    </PageLayout>
  </>
  );
}
