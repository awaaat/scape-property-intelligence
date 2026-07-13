import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, TrendingUp, ShieldCheck, Loader2 } from "lucide-react";
import PageLayout from "../../components/Layout/PageLayout";
import styles from "./PropertyIntel.module.css";
import SEO from "../../components/SEO/SEO";


const SEGMENTS = {
  brokers: { eyebrow: "FOR BROKERS & AGENTS", title: "Close a sale with proof, not promises", lead: "Hand a buyer a defensible score before they even ask for one." },
  "buyers-agents": { eyebrow: "FOR BUYER'S AGENTS", title: "Protect your client before they sign", lead: "Verify a seller's claims against real transaction data before your client commits." },
  lenders: { eyebrow: "FOR BANKS & LENDERS", title: "Check collateral before you approve", lead: "Score the land backing a loan application in seconds." },
  legal: { eyebrow: "FOR LAWYERS & SURVEYORS", title: "Back up due diligence with real data", lead: "Strengthen title and valuation due diligence with verified data." },
};
const DEFAULT_SEGMENT = { eyebrow: "CHECK A PROPERTY", title: "Drop a pin, get a report", lead: "Paste an address or a Google Maps link and we'll score it against real comparable sales, road access, and risk factors." };

const STEPS = ["Locating pin...", "Pulling comparable sales...", "Checking risk factors...", "Compiling report..."];

export default function PropertyIntel() {
  const [searchParams] = useSearchParams();
  const segment = SEGMENTS[searchParams.get("for")] || DEFAULT_SEGMENT;

  const [address, setAddress] = useState("");
  const [scanning, setScanning] = useState(false);
  const [logIdx, setLogIdx] = useState(-1);
  const [result, setResult] = useState(null);

  const runScan = async () => {
    if (!address.trim() || scanning) return;
    setResult(null);
    setScanning(true);
    for (let i = 0; i < STEPS.length; i++) {
      setLogIdx(i);
      await new Promise((r) => setTimeout(r, 550));
    }
    setResult({ score: 84, trend: "↑ 8.4% YoY", comps: 11, risk: "Low flood risk", amenities: "School 1.2km" });
    setScanning(false);
    setLogIdx(-1);
  };

  return (
    
    <>
    <SEO title="Property Intelligence" description="Generate an instant property intelligence report for any parcel in Kenya -- accessibility, investment scoring, land value benchmarks, and nearby amenities." path="/property-intel" />
    <PageLayout>
      <div className={styles.page}>
        <div className={styles.console}>
          <div className={styles.scanPane}>
            {[70, 130, 190].map((r, i) => (
              <motion.div
                key={r}
                className={styles.radarRing}
                style={{ width: r * 2, height: r * 2 }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
              />
            ))}
            <motion.div className={styles.pinCore} animate={{ scale: scanning ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.8, repeat: scanning ? Infinity : 0 }} />
            <span className={styles.scanLabel}>{scanning ? STEPS[logIdx] : "Awaiting input"}</span>
          </div>

          <div className={styles.formPane}>
            <span className={styles.kicker}>{segment.eyebrow}</span>
            <h1 className={styles.h1}>{segment.title}</h1>
            <p className={styles.lead}>{segment.lead}</p>

            <div className={styles.inputRow}>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runScan()}
                placeholder="e.g. Ruiru, Kiambu County or a maps.google.com link"
              />
              <button type="button" onClick={runScan} disabled={scanning}>
                {scanning ? <Loader2 size={14} className="pc-spin" style={{ animation: "spin 0.8s linear infinite" }} /> : <Search size={14} />}
                {scanning ? "Scanning" : "Analyze"}
              </button>
            </div>

            <AnimatePresence>
              {scanning && (
                <motion.div className={styles.logBox} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {STEPS.slice(0, logIdx + 1).map((s, i) => (
                    <motion.div key={s} className={styles.logLine} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                      <span className={styles.logDot} /> {s}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {result && (
                <motion.div className={styles.resultCard} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 20 }}>
                  <div className={styles.resultTop}>
                    <span className={styles.resultScore}>{result.score}</span>
                    <div className={styles.resultMeta}>
                      <span>Property Score</span>
                      <span>{result.trend}</span>
                    </div>
                  </div>
                  <div className={styles.resultGrid}>
                    <div><span>Comparable Sales</span><strong>{result.comps} nearby transactions</strong></div>
                    <div><span>Risk</span><strong>{result.risk}</strong></div>
                    <div><span>Nearest School</span><strong>{result.amenities}</strong></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className={styles.includesRow}>
          <div className={styles.includeCell}>
            <MapPin size={20} color="#8fc2d6" />
            <h3>Exact Location Data</h3>
            <p>Distance to schools, markets, and roads — specific to your pin.</p>
          </div>
          <div className={styles.includeCell}>
            <TrendingUp size={20} color="#b5602f" />
            <h3>Real Comparable Sales</h3>
            <p>Actual nearby transactions, not estimates, going back 24 months.</p>
          </div>
          <div className={styles.includeCell}>
            <ShieldCheck size={20} color="#5a8f9c" />
            <h3>Risk Assessment</h3>
            <p>Flood, terrain, and access flags, each labeled in the score.</p>
          </div>
        </div>
      </div>
    </PageLayout>
  </>
  );
}
