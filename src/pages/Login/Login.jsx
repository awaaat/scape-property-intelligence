import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";
import PageLayout from "../../components/Layout/PageLayout";
import { fadeUp } from "../../styles/animations";
import { login } from "../../api/auth";
import styles from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [socialNote, setSocialNote] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" in window.HTMLElement.prototype ? "instant" : "auto" });
  }, []);

  const change = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSocialClick = () => {
    setSocialNote(true);
    setTimeout(() => setSocialNote(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        setError("Invalid email or password.");
      } else {
        const data = err.response?.data;
        const firstError = data ? Object.values(data).flat()[0] : null;
        setError(firstError || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className={styles.page}>
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className={styles.card}>
          <h2>Welcome back! Please sign in.</h2>
          <p className={styles.sub}>Sign in to your Scape account.</p>

          {error && (
            <div className={styles.errBanner}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <input type="email" required value={form.email} onChange={(e) => change("email", e.target.value)} placeholder="Email Address" />
            </div>
            <div className={`${styles.field} ${styles.passwordWrap}`}>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => change("password", e.target.value)}
                placeholder="Password"
              />
              <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword((s) => !s)} tabIndex={-1}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <span className={styles.hint}>Password should be between 6-16 characters.</span>
            </div>

            <Link to="/forgot-password" className={styles.forgotLink}>Forgot your password?</Link>

            <motion.button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Signing in..." : <>Sign In <ArrowRight size={14} /></>}
            </motion.button>
          </form>

          <div className={styles.divider}><span>OR</span></div>

          <button type="button" className={`${styles.socialBtn} ${styles.socialApple}`} onClick={handleSocialClick}>
            Sign in with Apple
          </button>
          <button type="button" className={`${styles.socialBtn} ${styles.socialOutline}`} onClick={handleSocialClick}>
            Sign in with Google
          </button>
          <button type="button" className={`${styles.socialBtn} ${styles.socialOutline}`} onClick={handleSocialClick}>
            Sign in with Facebook
          </button>
          <div className={`${styles.socialNote} ${socialNote ? styles.socialNoteShow : ""}`}>
            Social sign-in is coming soon — please use email for now.
          </div>

          <p className={styles.switchLine}>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </PageLayout>
  );
}
