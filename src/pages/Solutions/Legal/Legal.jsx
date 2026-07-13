import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Award, ArrowRight, Star } from "lucide-react";
import PageLayout from "../../../components/Layout/PageLayout";
import { VIEWPORT } from "../../../styles/animations";
import { SOLUTIONS } from "../solutionsData";
import SolutionsNav from "../shared/SolutionsNav";
import AnalyzeTool from "../shared/AnalyzeTool";
import styles from "./Legal.module.css";
import SEO from "../../../components/SEO/SEO";


const data = SOLUTIONS.legal;

const TABS = [
  { label: "Overview", body: data.lead },
  { label: "Process", body: data.process.map((p) => p.title).join(" → ") },
  { label: "Benefits", body: data.benefits.map((b) => b.title).join(" · ") },
];

export default function Legal() {
  const [active, setActive] = useState(0);

  return (
    
    <>
    <SEO title="Solutions for Legal Teams" description="Location and land value data to support due diligence and conveyancing." path="/solutions/legal" />
    <PageLayout>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className="pc-container">
            <span className={styles.kicker}><Award size={12} style={{ verticalAlign: "-2px", marginRight: 6 }} />{data.eyebrow}</span>
            <h1 className={styles.title}>{data.title}</h1>
            <p className={styles.lead}>{data.lead}</p>
          </div>
        </section>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <div style={{ filter: "invert(1)" }}><SolutionsNav current="legal" /></div>
        </div>

        <div className={styles.fileWrap}>
          <div className={styles.tabRow}>
            {TABS.map((t, i) => (
              <div key={t.label} className={`${styles.tab} ${active === i ? styles.tabOn : ""}`} onClick={() => setActive(i)}>{t.label}</div>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={active} className={styles.tabBody} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3>{TABS[active].label}</h3>
              <p>{TABS[active].body}</p>
              {active === 1 && (
                <ol style={{ paddingLeft: 20, color: "#4a4130", fontSize: 15, lineHeight: 1.9 }}>
                  {data.process.map((p) => <li key={p.title}><strong>{p.title}.</strong> {p.desc}</li>)}
                </ol>
              )}
              {active === 2 && (
                <div style={{ display: "grid", gap: 14, marginTop: 10 }}>
                  {data.benefits.map((b) => (
                    <div key={b.title} style={{ borderLeft: "3px solid #7a5a2e", paddingLeft: 14 }}>
                      <strong style={{ display: "block", fontFamily: "var(--font-display)", color: "#2b2418" }}>{b.title}</strong>
                      <span style={{ fontSize: 13.5 }}>{b.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <section style={{ maxWidth: 700, margin: "0 auto 90px", padding: "0 24px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "#2b2418", textAlign: "center", marginBottom: 20 }}>Attach a report to your file</h2>
          <AnalyzeTool render={({ address, setAddress, isSearching, result, run, Search, Loader2 }) => (
            <>
              <div style={{ display: "flex", border: "1px solid #2b2418", background: "#fffdf7" }}>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} onKeyDown={(e) => e.key === "Enter" && run()}
                  placeholder="Title deed reference or map location" style={{ flex: 1, border: "none", padding: "14px 18px", fontFamily: "Georgia, serif", outline: "none", background: "transparent" }} />
                <button type="button" onClick={run} disabled={isSearching} style={{ background: "#2b2418", color: "#fffdf7", border: "none", padding: "0 24px", fontFamily: "var(--font-mono)", fontWeight: 700, cursor: "pointer" }}>
                  {isSearching ? "Pulling..." : "Attach Report"}
                </button>
              </div>
              {result && (
                <div style={{ marginTop: 18, padding: "20px 24px", background: "#f0e8d2", border: "1px solid #d8cba8", fontFamily: "Georgia, serif" }}>
                  Score <strong>{result.score}/100</strong> · {result.risk}
                </div>
              )}
            </>
          )} />
        </section>

        <section style={{ maxWidth: 640, margin: "0 auto 90px", textAlign: "center", padding: "0 24px" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 2, marginBottom: 16 }}>{[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#7a5a2e" color="#7a5a2e" />)}</div>
          <blockquote style={{ fontFamily: "var(--font-display)", fontSize: 22, fontStyle: "italic", color: "#2b2418" }}>"{data.testimonial.quote}"</blockquote>
          <div className={styles.sigLine}>{data.testimonial.name} — {data.testimonial.role}</div>
          <div style={{ marginTop: 30 }}>
            <Link to="/signup" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#2b2418", color: "#fffdf7", padding: "12px 26px", textDecoration: "none", fontWeight: 700, fontFamily: "var(--font-mono)", fontSize: 13 }}>
              Get Started <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  </>
  );
}
