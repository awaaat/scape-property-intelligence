import { useState } from "react";
import { motion } from "framer-motion";
import PageLayout from "../../components/Layout/PageLayout";
import { fadeUp, VIEWPORT } from "../../styles/animations";
import styles from "./Terms.module.css";
import SEO from "../../components/SEO/SEO";


const SECTIONS = [
  { h: "Using Scape", p: "Reports are generated from third-party and public data sources cross-referenced at the time of your request. Scores are an evidence-based estimate, not a legal valuation or survey." },
  { h: "Payment", p: "Every account gets 5 free reports. After that, reports are billed at a flat KES 300 each via Paystack, with no subscription required." },
  { h: "Limitation of liability", p: "Scape is a decision-support tool. Final due diligence — including legal title verification — remains the responsibility of the buyer, agent, or institution acting on a report." },
];

export default function Terms() {
  const [active, setActive] = useState(0);
  return (
    
    <>
    <SEO title="Terms of Service" description="Terms of service governing use of the Scape Data Solutions property intelligence platform and reports." path="/terms" />
    <PageLayout>
      <motion.section className="pc-hero" initial="hidden" animate="visible" variants={fadeUp}>
        <div className="pc-container">
          <span className="pc-eyebrow">LEGAL</span>
          <h1 className="pc-title">Terms of Service</h1>
          <p className="pc-lead">Last updated: July 2026</p>
        </div>
      </motion.section>
      <section className="pc-section">
        <div className={styles.layout}>
          <nav className={styles.toc}>
            {SECTIONS.map((s, i) => (
              <button key={s.h} className={`${styles.tocItem} ${active === i ? styles.tocItemOn : ""}`} onClick={() => setActive(i)}>
                <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>{s.h}
              </button>
            ))}
          </nav>
          <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="pc-heading2"><span className={styles.num}>{String(active + 1).padStart(2, "0")}</span>{SECTIONS[active].h}</h2>
            <p className="pc-body">{SECTIONS[active].p}</p>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  </>
  );
}
