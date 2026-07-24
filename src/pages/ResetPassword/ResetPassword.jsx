import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import PageLayout from "../../components/Layout/PageLayout";
import { fadeUp } from "../../styles/animations";
import { confirmPasswordReset } from "../../api/auth";
import styles from "./ResetPassword.module.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" in window.HTMLElement.prototype ? "instant" : "auto" });
  }, []);

  const change = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const linkMissing = !uid || !token;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset({ uid, token, newPassword: form.newPassword });
      setSuccess(true);
    } catch (err) {
      const detail = err.response?.data?.detail;
      const data = err.response?.data;
      const firstError = data ? Object.values(data).flat()[0] : null;
      setError(detail || firstError || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className={styles.page}>
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className={styles.card}>
          {linkMissing ? (
            <>
              <AlertCircle size={40} color="#a6402e" className={styles.statusIcon} />
              <h2>Invalid reset link</h2>
              <p className={styles.sub}>This link is missing required information. Request a new one below.</p>
              <Link to="/forgot-password" className={styles.primaryBtn}>Request new link</Link>
            </>
          ) : success ? (
            <>
              <CheckCircle size={40} color="#2e7d32" className={styles.statusIcon} />
              <h2>Password updated</h2>
              <p className={styles.sub}>Your password has been changed. You can now sign in with your new password.</p>
              <Link to="/login" className={styles.primaryBtn}>Go to Sign In</Link>
            </>
          ) : (
            <>
              <h2>Set a new password</h2>
              <p className={styles.sub}>Choose a new password for your account.</p>

              {error && (
                <div className={styles.errBanner}>
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className={`${styles.field} ${styles.passwordWrap}`}>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={form.newPassword}
                    onChange={(e) => change("newPassword", e.target.value)}
                    placeholder="New password"
                  />
                  <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword((s) => !s)} tabIndex={-1}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <span className={styles.hint}>At least 8 characters.</span>
                </div>

                <div className={styles.field}>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={form.confirmPassword}
                    onChange={(e) => change("confirmPassword", e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>

                <motion.button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? "Updating..." : <>Update password <ArrowRight size={14} /></>}
                </motion.button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </PageLayout>
  );
}