import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, FileSpreadsheet, Webhook } from "lucide-react";
import PageLayout from "../../components/Layout/PageLayout";
import { fadeUp, VIEWPORT } from "../../styles/animations";
import styles from "./Integrations.module.css";
import SEO from "../../components/SEO/SEO";


const NODES = [
  { icon: <Database size={26} color="var(--lime)" />, name: "REST API", desc: "Pull scored reports directly into your own product or CRM.", pos: { top: "6%", left: "50%", transform: "translateX(-50%)" } },
  { icon: <FileSpreadsheet size={26} color="var(--amber)" />, name: "CSV Upload", desc: "Bulk-score a portfolio without writing any code.", pos: { bottom: "6%", left: "12%" } },
  { icon: <Webhook size={26} color="var(--cyan)" />, name: "Webhooks", desc: "Get notified the moment a portfolio re-check finds a change.", pos: { bottom: "6%", right: "12%" } },
];

export default function Integrations() {
  const [active, setActive] = useState(null);
  return (
    
    <>
    <SEO title="Integrations" description="Connect Scape Data Solutions property intelligence data to the CRMs, GIS tools, and workflows you already use." path="/integrations" />
    <PageLayout>
      <section className={styles.hero}>
        <div className="pc-container">
          <span className="pc-eyebrow">INTEGRATIONS</span>
          <h1 className="pc-title">Get Scape data where you already work</h1>
          <p className="pc-lead">Click a node to see how it connects.</p>
        </div>
      </section>

      <div className={styles.diagram}>
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <line x1="50%" y1="16%" x2="50%" y2="50%" stroke="var(--hairline)" strokeWidth={2} strokeDasharray="4 6" />
          <line x1="20%" y1="84%" x2="50%" y2="50%" stroke="var(--hairline)" strokeWidth={2} strokeDasharray="4 6" />
          <line x1="80%" y1="84%" x2="50%" y2="50%" stroke="var(--hairline)" strokeWidth={2} strokeDasharray="4 6" />
        </svg>
        <div className={styles.centerNode}>Scape API</div>
        {NODES.map((n, i) => (
          <motion.div key={n.name} className={styles.node} style={n.pos} onClick={() => setActive(active === i ? null : i)}
            whileHover={{ scale: 1.08 }} initial={{ opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }} viewport={VIEWPORT} transition={{ delay: i * 0.15 }}>
            {n.icon}
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {active !== null && (
          <motion.div key={active} className={styles.detailCard} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text-h)", marginBottom: 8 }}>{NODES[active].name}</h3>
            <p style={{ fontSize: 14, color: "var(--text-dim)" }}>{NODES[active].desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
      {active === null && (
        <motion.p variants={fadeUp} initial="hidden" animate="visible" style={{ textAlign: "center", color: "var(--text-dim)", fontSize: 13 }}>
          ↑ Click any connector above
        </motion.p>
      )}
    </PageLayout>
  </>
  );
}
