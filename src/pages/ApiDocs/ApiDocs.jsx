import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PageLayout from "../../components/Layout/PageLayout";
import styles from "./ApiDocs.module.css";
import SEO from "../../components/SEO/SEO";


const ENDPOINTS = [
  { method: "POST", path: "/api/property-intel/score/", desc: "Score a single pin.", json: '{\n  "score": 84,\n  "trend": "+8.4% YoY",\n  "comps": 11\n}' },
  { method: "POST", path: "/api/property-intel/bulk/", desc: "Score a batch upload.", json: '{\n  "job_id": "b_9f21",\n  "status": "queued"\n}' },
  { method: "GET", path: "/api/property-intel/reports/:id/", desc: "Fetch a generated report.", json: '{\n  "id": "r_1a02",\n  "score": 84,\n  "risk": "Low"\n}' },
];

const CMD = "curl -X POST https://api.scapeintel.com/v1/property-intel/score/";

export default function ApiDocs() {
  const [typed, setTyped] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => { setTyped(CMD.slice(0, i + 1)); i++; if (i >= CMD.length) clearInterval(t); }, 22);
    return () => clearInterval(t);
  }, []);

  return (
    
    <>
    <SEO title="API Documentation" description="Integrate parcel-level property intelligence -- accessibility scores, investment scores, and land value benchmarks -- into your own systems via the Scape Data Solutions API." path="/api-docs" />
    <PageLayout>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className="pc-container">
            <span className={styles.kicker}>DEVELOPERS</span>
            <h1 className={styles.title}>API Documentation</h1>
            <p className={styles.lead}>Pull the same scoring data behind every Scape report into your own app.</p>
          </div>
        </section>

        <div className={styles.terminal}>
          <div className={styles.termBar}>
            <span className={styles.termDot} style={{ background: "#ff5f56" }} />
            <span className={styles.termDot} style={{ background: "#ffbd2e" }} />
            <span className={styles.termDot} style={{ background: "#27c93f" }} />
          </div>
          <div className={styles.termBody}>{typed}<motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }}>▍</motion.span></div>
        </div>

        <div className={styles.tabs}>
          {ENDPOINTS.map((e, i) => (
            <div key={e.path} className={`${styles.tab} ${active === i ? styles.tabOn : ""}`} onClick={() => setActive(i)}>
              {e.method} {e.path.split("/").slice(-2)[0]}
            </div>
          ))}
        </div>
        <motion.div key={active} className={styles.panel} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div><span className={styles.panelMethod}>{ENDPOINTS[active].method}</span><span className={styles.panelPath}>{ENDPOINTS[active].path}</span></div>
          <p className={styles.panelDesc}>{ENDPOINTS[active].desc}</p>
          <div className={styles.jsonBlock}>{ENDPOINTS[active].json}</div>
        </motion.div>
      </div>
    </PageLayout>
  </>
  );
}
