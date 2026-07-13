import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PageLayout from "../../components/Layout/PageLayout";
import styles from "./Blog.module.css";
import SEO from "../../components/SEO/SEO";


const FULL_TEXT = "Market data and product updates";
const CHIPS = ["Market Trends", "Scoring Model", "Case Studies", "Product Updates"];

export default function Blog() {
  const [typed, setTyped] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setTyped(FULL_TEXT.slice(0, i + 1));
      i++;
      if (i >= FULL_TEXT.length) clearInterval(t);
    }, 45);
    return () => clearInterval(t);
  }, []);

  return (
    
    <>
    <SEO title="Blog" description="Analysis and updates on Kenyan land values, infrastructure growth corridors, and property market trends." path="/blog" />
    <PageLayout>
      <section className={styles.hero}>
        <div className="pc-container">
          <span className={styles.kicker}>BLOG — COMING SOON</span>
          <h1 className={styles.title}>
            {typed}<motion.span className={styles.cursor} animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} style={{ height: "0.9em" }} />
          </h1>
          <div className={styles.chips}>
            {CHIPS.map((c) => <span key={c} className={styles.chip}>{c}</span>)}
          </div>
        </div>
      </section>

      <section className={styles.subscribeWrap}>
        <div className={styles.card}>
          {sent ? (
            <>
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--lime)" }}>You're on the list</h3>
              <p style={{ color: "var(--text-dim)", fontSize: 14, marginTop: 8 }}>We'll email you the moment the first post is live.</p>
            </>
          ) : (
            <>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--text-h)" }}>Get notified at launch</h3>
              <p style={{ color: "var(--text-dim)", fontSize: 13.5, marginTop: 6 }}>Real market data from Nairobi and Kiambu, plus notes on how scoring works.</p>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => email.includes("@") && setSent(true)}>
                Notify Me
              </motion.button>
            </>
          )}
        </div>
      </section>
    </PageLayout>
  </>
  );
}
