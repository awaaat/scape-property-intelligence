import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, TrendingUp, ShieldCheck, ArrowRight, MousePointerClick, ScanSearch, FileCheck2 } from "lucide-react";
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

const HOW_IT_WORKS_STEPS = [
  {
    icon: MousePointerClick,
    title: "Drop a pin or paste a link",
    text: "Give us an address, a dropped pin, or a Google Maps link -- whatever you have on hand for the plot.",
  },
  {
    icon: ScanSearch,
    title: "We check comps, roads, and risk",
    text: "We pull real nearby sale prices, road and access data, school and hospital proximity, and flood/terrain risk for that exact location.",
  },
  {
    icon: FileCheck2,
    title: "Get your report in seconds",
    text: "A plain, evidence-backed report lands with a score you can show a buyer, bank, or lawyer -- not a guess.",
  },
];

export default function PropertyIntel() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const segment = SEGMENTS[searchParams.get("for")] || DEFAULT_SEGMENT;

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
            <motion.div
              className={styles.pinCore}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className={styles.scanLabel}>Live property scan</span>
          </div>

          <div className={styles.formPane}>
            <span className={styles.kicker}>{segment.eyebrow}</span>
            <h1 className={styles.h1}>{segment.title}</h1>
            <p className={styles.lead}>{segment.lead}</p>

            <div className={styles.howItWorksSteps}>
              {HOW_IT_WORKS_STEPS.map((step, i) => (
                <motion.div
                  key={step.title}
                  className={styles.howItWorksStep}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                >
                  <span className={styles.howItWorksStepNum}>{i + 1}</span>
                  <step.icon size={20} />
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </motion.div>
              ))}
            </div>

            <button
              type="button"
              className={styles.howItWorksCta}
              onClick={() => navigate("/", { state: { scrollToPin: true } })}
            >
              Click here to check a property <ArrowRight size={16} />
            </button>
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
