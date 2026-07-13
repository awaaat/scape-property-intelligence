import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import PageLayout from "../../components/Layout/PageLayout";
import { confirmVerification } from "../../api/auth";
import styles from "./VerifyEmail.module.css";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); // verifying | success | failed
  const [message, setMessage] = useState("Confirming your email…");

  const id = searchParams.get("id");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!id || !token) {
      setStatus("failed");
      setMessage("This verification link is missing required information.");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        await confirmVerification({ id, token });
        if (cancelled) return;
        setStatus("success");
        setMessage("Your email is verified. You're all set.");
      } catch (err) {
        if (cancelled) return;
        const detail = err.response?.data?.detail;
        setStatus("failed");
        setMessage(detail || "This verification link is invalid or has expired.");
      }
    })();

    return () => { cancelled = true; };
  }, [id, token]);

  return (
    <PageLayout>
      <div className={styles.page}>
        <div className={styles.card}>
          {status === "verifying" && <Loader2 size={40} className={styles.spin} />}
          {status === "success" && <CheckCircle size={40} color="#2e7d32" />}
          {status === "failed" && <AlertCircle size={40} color="#a6402e" />}

          <h2>
            {status === "verifying" && "Verifying your email…"}
            {status === "success" && "Email verified!"}
            {status === "failed" && "Verification issue"}
          </h2>
          <p className={styles.sub}>{message}</p>

          {status !== "verifying" && (
            <Link to={status === "success" ? "/login" : "/signup"} className={styles.primaryBtn}>
              {status === "success" ? "Go to Sign In" : "Back to Sign Up"}
            </Link>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
