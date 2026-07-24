import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import PageLayout from "../../components/Layout/PageLayout";
import { fadeUp } from "../../styles/animations";
import { requestPasswordReset } from "../../api/auth";
import styles from "./ForgotPassword.module.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" in window.HTMLElement.prototype ? "instant" : "auto" });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await requestPasswordReset(email);
      // Backend always returns 202 regardless of whether the account
      // exists — same "don't reveal whether the email exists" posture
      // as resendVerification, so the UI shows one message either way.
      setSent(true);
    } catch (err) {
      const data = err.response?.data;
      const firstError = data ? Object.values(data).flat()[0] : null;
      setError(firstError || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className={styles.page}>
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className={styles.card}>
          {sent ? (
            <>
              <CheckCircle size={40} color="#2e7d32" className={styles.statusIcon} />
              <h2>Check your email</h2>
              <p className={styles.sub}>
                If an account exists for <strong>{email}</strong>, we've sent a link to reset your password.
                It expires in 24 hours.
              </p>
              <Link to="/login" className={styles.primaryBtn}>Back to Sign In</Link>
            </>
          ) : (
            <>
              <h2>Forgot your password?</h2>
              <p className={styles.sub}>Enter your email and we'll send you a link to reset it.</p>

              {error && (
                <div className={styles.errBanner}>
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className={styles.field}>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                  />
                </div>

                <motion.button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? "Sending..." : <>Send reset link <ArrowRight size={14} /></>}
                </motion.button>
              </form>

              <p className={styles.switchLine}>
                Remembered it? <Link to="/login">Sign in</Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </PageLayout>
  );
}