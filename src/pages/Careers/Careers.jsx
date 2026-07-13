import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, Users, Target, ChevronDown } from "lucide-react";
import PageLayout from "../../components/Layout/PageLayout";
import { fadeUp, staggerContainer, VIEWPORT } from "../../styles/animations";
import styles from "./Careers.module.css";
import SEO from "../../components/SEO/SEO";


const VALUES = [
  { icon: <Zap size={22} color="#e8a166" />, title: "Move fast", text: "Small team, real ownership, no committee-by-consensus." },
  { icon: <Target size={22} color="#e8a166" />, title: "Data first", text: "Every decision traces back to a verifiable number." },
  { icon: <Users size={22} color="#e8a166" />, title: "Built for trust", text: "The product only works if people believe the score." },
];

const ROLES = [
  { title: "Backend Engineer (Django)", location: "Nairobi / Remote", type: "Full-time" },
  { title: "Data Partnerships Lead", location: "Nairobi", type: "Full-time" },
];

export default function Careers() {
  const [open, setOpen] = useState(null);
  return (
    
    <>
    <SEO title="Careers" description="Careers at Scape Data Solutions -- join a team building property intelligence tools for the Kenyan real estate market." path="/careers" />
    <PageLayout>
      <section className={styles.hero}>
        <div className={styles.heroImg} style={{ backgroundImage: "url(/site-images/FI-open-house-apps.jpg)" }} />
        <motion.div className={styles.heroInner} initial="hidden" animate="visible" variants={staggerContainer}>
          <div className="pc-container">
            <motion.span className={styles.kicker} variants={fadeUp}>CAREERS</motion.span>
            <motion.h1 className={styles.title} variants={fadeUp}>Join the team building Scape</motion.h1>
            <motion.p className={styles.lead} variants={fadeUp}>Small team, real data problems, and a product people rely on before signing for land.</motion.p>
          </div>
        </motion.div>
      </section>

      <div className={styles.valuesRow}>
        {VALUES.map((v, i) => (
          <motion.div key={v.title} className={styles.valueCard} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ delay: i * 0.1 }} whileHover={{ rotate: 0, y: -6, scale: 1.03 }}>
            {v.icon}
            <h3>{v.title}</h3>
            <p>{v.text}</p>
          </motion.div>
        ))}
      </div>

      <div className={styles.rolesWrap}>
        <div className="pc-container">
          <h2 style={{ fontFamily: "var(--font-display)", color: "#fff8ec", fontSize: 26, marginBottom: 20 }}>Open roles</h2>
          {ROLES.map((r, i) => {
            const isOpen = open === i;
            return (
              <div key={r.title} className={styles.roleItem} onClick={() => setOpen(isOpen ? null : i)}>
                <div className={styles.roleTop}>
                  <div>
                    <div className={styles.roleTitle}>{r.title}</div>
                    <div className={styles.roleMeta}>{r.location} · {r.type}</div>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><ChevronDown color="#e8a166" size={18} /></motion.div>
                </div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
                      <p style={{ color: "rgba(255,248,236,0.6)", fontSize: 13.5, marginTop: 14, maxWidth: 520 }}>
                        Reach out through the contact page with a short note on what you'd bring — no formal application needed yet.
                      </p>
                      <Link to="/contact" className={styles.roleTag} style={{ display: "inline-block", marginTop: 10, textDecoration: "none" }}>Apply →</Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  </>
  );
}
