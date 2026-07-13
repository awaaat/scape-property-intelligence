import { useState } from "react";
import { motion } from "framer-motion";
import PageLayout from "../../components/Layout/PageLayout";
import { fadeUp } from "../../styles/animations";
import styles from "./Cookies.module.css";
import SEO from "../../components/SEO/SEO";


export default function Cookies() {
  const [analytics, setAnalytics] = useState(true);

  return (
    
    <>
    <SEO title="Cookie Policy" description="How Scape Data Solutions uses cookies across our property intelligence platform." path="/cookies" />
    <PageLayout>
      <motion.section className="pc-hero" initial="hidden" animate="visible" variants={fadeUp}>
        <div className="pc-container">
          <span className="pc-eyebrow">LEGAL</span>
          <h1 className="pc-title">Cookie Policy</h1>
          <p className="pc-lead">See what each category does, and toggle what you're comfortable with.</p>
        </div>
      </motion.section>

      <section className="pc-section">
        <div className={styles.panel}>
          <div className={styles.row}>
            <div>
              <div className={styles.rowTitle}>Essential</div>
              <div className={styles.rowDesc}>Keeps you signed in and remembers your session. Can't be turned off.</div>
            </div>
            <div className={`${styles.switch} ${styles.switchLocked}`}>
              <motion.div className={styles.knob} animate={{ left: 22 }} />
            </div>
          </div>
          <div className={styles.row}>
            <div>
              <div className={styles.rowTitle}>Analytics</div>
              <div className={styles.rowDesc}>Helps us understand which pages people actually use.</div>
            </div>
            <div className={`${styles.switch} ${analytics ? styles.switchOn : ""}`} onClick={() => setAnalytics(!analytics)}>
              <motion.div className={styles.knob} animate={{ left: analytics ? 22 : 2 }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />
            </div>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-dim)", marginTop: 24 }}>
          Clearing cookies from your browser at any time will sign you out of your Scape account.
        </p>
      </section>
    </PageLayout>
  </>
  );
}
