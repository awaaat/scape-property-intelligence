import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import PageLayout from "../../components/Layout/PageLayout";
import { fadeUp } from "../../styles/animations";
import { signup } from "../../api/auth";
import styles from "./SignUp.module.css";

const REDIRECT_DELAY_MS = 3000;

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", consentGiven: false });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [socialNote, setSocialNote] = useState(false);

  const change = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSocialClick = () => {
    setSocialNote(true);
    setTimeout(() => setSocialNote(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.consentGiven) {
      setError("Please accept the privacy policy to continue.");
      return;
    }

    setLoading(true);
    try {
      await signup(form);
      setSuccess(true);
    } catch (err) {
      const data = err.response?.data;
      const firstError = data ? Object.values(data).flat()[0] : null;
      setError(firstError || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!success) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" in window.HTMLElement.prototype ? "instant" : "auto" });
    const t = setTimeout(() => {
      navigate("/login", { state: { justSignedUp: true } });
    }, REDIRECT_DELAY_MS);
    return () => clearTimeout(t);
  }, [success, navigate]);

  return (
    <PageLayout>
      <div className={styles.page}>
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className={styles.card}>
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 12 }}
            >
              <CheckCircle size={40} color="#2e7d32" />
              <h2>Account created!</h2>
              <p className={styles.sub}>Taking you to sign in…</p>
            </motion.div>
          ) : (
            <>
              <h2>Create your account</h2>
              <p className={styles.sub}>Start using Scape for free.</p>

              {error && (
                <div className={styles.errBanner}>
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className={styles.field}>
                  <input type="text" required value={form.fullName} onChange={(e) => change("fullName", e.target.value)} placeholder="Full Name" />
                </div>
                <div className={styles.field}>
                  <input type="email" required value={form.email} onChange={(e) => change("email", e.target.value)} placeholder="Email Address" />
                </div>
                <div className={styles.field}>
                  <input type="tel" required value={form.phone} onChange={(e) => change("phone", e.target.value)} placeholder="Phone (+254712345678)" />
                </div>
                <div className={`${styles.field} ${styles.passwordWrap}`}>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={form.password}
                    onChange={(e) => change("password", e.target.value)}
                    placeholder="Password"
                  />
                  <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword((s) => !s)} tabIndex={-1}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <span className={styles.hint}>At least 8 characters.</span>
                </div>

                <label className={styles.consent}>
                  <input type="checkbox" checked={form.consentGiven} onChange={(e) => change("consentGiven", e.target.checked)} />
                  I agree to the privacy policy and consent to my data being stored.
                </label>

                <motion.button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? "Creating account..." : <>Create Account <ArrowRight size={14} /></>}
                </motion.button>
              </form>

              <div className={styles.divider}><span>OR</span></div>

              <button type="button" className={`${styles.socialBtn} ${styles.socialApple}`} onClick={handleSocialClick}>
                Sign up with Apple
              </button>
              <button type="button" className={`${styles.socialBtn} ${styles.socialOutline}`} onClick={handleSocialClick}>
                Sign up with Google
              </button>
              <button type="button" className={`${styles.socialBtn} ${styles.socialOutline}`} onClick={handleSocialClick}>
                Sign up with Facebook
              </button>
              <div className={`${styles.socialNote} ${socialNote ? styles.socialNoteShow : ""}`}>
                Social sign-up is coming soon — please use email for now.
              </div>

              <p className={styles.switchLine}>
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </PageLayout>
  );
}
