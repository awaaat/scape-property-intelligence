import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Landmark, ArrowRight, Star } from "lucide-react";
import PageLayout from "../../../components/Layout/PageLayout";
import { fadeUp, VIEWPORT } from "../../../styles/animations";
import { SOLUTIONS } from "../solutionsData";
import SolutionsNav from "../shared/SolutionsNav";
import styles from "./Lenders.module.css";
import SEO from "../../../components/SEO/SEO";


const data = SOLUTIONS.lenders;
const RADIUS = 70;
const CIRC = 2 * Math.PI * RADIUS;

const BATCH_ROWS = [
  { addr: "Ruiru, Kiambu — Plot 14B", score: 84, risk: "Low", color: "#3f9e6d" },
  { addr: "Juja, Kiambu — Plot 7A", score: 61, risk: "Moderate", color: "#c98a2c" },
  { addr: "Thika Rd — Plot 22", score: 91, risk: "Low", color: "#3f9e6d" },
  { addr: "Ruiru East — Plot 3C", score: 44, risk: "High", color: "#c0503a" },
];

export default function Lenders() {
  const [gaugeVal] = useState(87);
  const offset = CIRC * (1 - gaugeVal / 100);

  return (
    
    <>
    <SEO title="Solutions for Lenders" description="Collateral and location risk data to support faster, better-informed lending decisions." path="/solutions/lenders" />
    <PageLayout>
      <section className={styles.hero}>
        <div className="pc-container">
          <span className={styles.kicker}><Landmark size={12} style={{ verticalAlign: "-2px", marginRight: 6 }} />{data.eyebrow}</span>
          <h1 className={styles.title}>{data.title}</h1>
          <p className={styles.lead}>{data.lead}</p>
          <SolutionsNav current="lenders" />
        </div>
      </section>

      <div className={styles.dashRow}>
        <div className={styles.gaugeWrap}>
          <svg width={180} height={180} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={90} cy={90} r={RADIUS} fill="none" stroke="var(--hairline)" strokeWidth={12} />
            <motion.circle cx={90} cy={90} r={RADIUS} fill="none" stroke="#3f9e6d" strokeWidth={12} strokeDasharray={CIRC} strokeLinecap="round"
              initial={{ strokeDashoffset: CIRC }} whileInView={{ strokeDashoffset: offset }} viewport={VIEWPORT} transition={{ duration: 1.2 }} />
          </svg>
          <div className={styles.gaugeNum}>{gaugeVal}</div>
          <div className={styles.gaugeLabel}>Avg. Collateral Score</div>
        </div>
        <div className={styles.metricsGrid}>
          {data.stats.map((s) => (
            <motion.div key={s.label} className={styles.metricCard} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT}>
              <div className={styles.metricVal}>{s.val}</div>
              <div className={styles.metricLabel}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.section className="pc-section pc-section-grey" initial="hidden" whileInView="visible" viewport={VIEWPORT} variants={fadeUp}>
        <div className="pc-container">
          <h2 className="pc-heading2" style={{ textAlign: "center" }}>Score a batch of applications at once</h2>
          <p className="pc-body" style={{ textAlign: "center", maxWidth: 520, margin: "0 auto 32px" }}>Upload a spreadsheet of pending applications and get every collateral score back in one pass.</p>
          <div className={styles.batchPanel}>
            {BATCH_ROWS.map((r) => (
              <div key={r.addr} className={styles.batchRow}>
                <span>{r.addr}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <strong style={{ color: "#f4f9f6" }}>{r.score}</strong>
                  <span className={styles.riskTag} style={{ background: `${r.color}22`, color: r.color }}>{r.risk} risk</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section className="pc-section" initial="hidden" whileInView="visible" viewport={VIEWPORT} variants={fadeUp}>
        <div className="pc-container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {data.benefits.map((item) => (
              <motion.div key={item.title} whileHover={{ y: -6 }} style={{ background: "var(--bg-raised)", padding: 24, borderRadius: 12, border: "1px solid var(--hairline)" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--text-h)", marginBottom: 6 }}>{item.title}</h3>
                <p style={{ fontSize: 13.5, color: "var(--text)", margin: 0 }}>{item.text}</p>
              </motion.div>
            ))}
          </div>
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
    </PageLayout>
  </>
  );
}
