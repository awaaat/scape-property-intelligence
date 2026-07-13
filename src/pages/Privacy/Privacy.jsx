import { motion } from "framer-motion";
import { Database, ShieldCheck, UserCheck } from "lucide-react";
import PageLayout from "../../components/Layout/PageLayout";
import { fadeUp, staggerContainer, VIEWPORT } from "../../styles/animations";
import styles from "./Privacy.module.css";
import SEO from "../../components/SEO/SEO";


const CARDS = [
  { icon: <Database size={22} color="var(--lime)" />, h: "What we collect", base: "Name, email, phone, and the property details you submit.", why: "We need this to generate the exact report you're asking for and keep your account secure." },
  { icon: <ShieldCheck size={22} color="var(--amber)" />, h: "How we use it", base: "To generate reports, verify accounts, and improve accuracy.", why: "We never sell personal data to third parties — it's used to run the product, nothing else." },
  { icon: <UserCheck size={22} color="var(--cyan)" />, h: "Your rights", base: "Request a copy of your data, or delete your account, anytime.", why: "Email info@scapedatasolutions.com and we'll action it within a reasonable timeframe." },
];

export default function Privacy() {
  return (
    
    <>
    <SEO title="Privacy Policy" description="How Scape Data Solutions collects, uses, and protects data across our property intelligence platform." path="/privacy" />
    <PageLayout>
      <motion.section className="pc-hero" initial="hidden" animate="visible" variants={fadeUp}>
        <div className="pc-container">
          <span className="pc-eyebrow">LEGAL</span>
          <h1 className="pc-title">Privacy Policy</h1>
          <p className="pc-lead">Last updated: July 2026 — hover a card for the "why".</p>
        </div>
      </motion.section>
      <motion.section className="pc-section" initial="hidden" whileInView="visible" viewport={VIEWPORT} variants={staggerContainer}>
        <div className={styles.grid}>
          {CARDS.map((c) => (
            <motion.div key={c.h} className={styles.card} variants={fadeUp} whileHover="hover" initial="rest">
              {c.icon}
              <h3>{c.h}</h3>
              <p className={styles.cardBase}>{c.base}</p>
              <motion.div className={styles.cardWhy} variants={{ rest: { opacity: 0, y: 10 }, hover: { opacity: 1, y: 0 } }} transition={{ duration: 0.25 }}>
                {c.why}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </PageLayout>
  </>
  );
}
