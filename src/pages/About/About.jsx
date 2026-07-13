import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageLayout from "../../components/Layout/PageLayout";
import { fadeUp, scaleIn, staggerContainer, VIEWPORT } from "../../styles/animations";
import styles from "./About.module.css";
import SEO from "../../components/SEO/SEO";


const TIMELINE = [
  { year: "2024", text: "Founded in Nairobi after one too many stalled land deals" },
  { year: "2025", text: "Scoring model validated across Kiambu, first paying customers" },
  { year: "2026", text: "12+ data sources, thousands of reports generated" },
];

export default function About() {
  return (
    
    <>
    <SEO title="About Us" description="Scape Data Solutions turns public geospatial, infrastructure, and market data into clear property investment reports for Kenyan real estate." path="/about" />
    <PageLayout>
      <motion.section className={styles.hero} initial="hidden" animate="visible" variants={staggerContainer}>
        <div className="pc-container">
          <motion.span className={styles.kicker} variants={fadeUp}>ABOUT US</motion.span>
          <motion.p className={styles.quote} variants={fadeUp}>
            "We got tired of watching land deals stall over a question nobody could answer cleanly: is this plot actually worth what's being asked?"
          </motion.p>
        </div>
      </motion.section>

      <motion.div className={styles.collage} initial="hidden" whileInView="visible" viewport={VIEWPORT} variants={staggerContainer}>
        <motion.img className={styles.cell1} variants={scaleIn} src="/site-images/37025.jpeg" alt="Property review" />
        <motion.img className={styles.cell2} variants={scaleIn} src="/site-images/real-estate-im-1.jpeg" alt="Land plot" />
        <motion.img className={styles.cell3} variants={scaleIn} src="/site-images/gallery-2.jpeg" alt="Field verification" />
        <motion.img className={styles.cell4} variants={scaleIn} src="/site-images/image-1-hero.png" alt="Scored report" />
      </motion.div>

      <div className={styles.timelineWrap}>
        <div className={styles.timeline}>
          {TIMELINE.map((t, i) => (
            <motion.div key={t.year} className={styles.tItem} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ delay: i * 0.15 }}>
              <div className={styles.tDot} />
              <div className={styles.tYear}>{t.year}</div>
              <p className={styles.tText}>{t.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.section className="pc-section" style={{ textAlign: "center" }} initial="hidden" whileInView="visible" viewport={VIEWPORT} variants={fadeUp}>
        <div className="pc-container">
          <h2 className="pc-heading2" style={{ textAlign: "center" }}>A score anyone can defend</h2>
          <p className="pc-body" style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 28px" }}>
            Scape pulls real comparable sales, access data, and risk factors for one specific pin, turning it into a score a buyer, bank, or lawyer can stand behind.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: "inline-block" }}>
            <Link to="/signup" className="pc-price-cta">Get Started <ArrowRight size={14} /></Link>
          </motion.div>
        </div>
      </motion.section>
    </PageLayout>
  </>
  );
}
