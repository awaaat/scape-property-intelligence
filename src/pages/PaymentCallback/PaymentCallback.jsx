import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyPayment, fetchReportStatus } from "../../api/billing";
import styles from "./PaymentCallback.module.css";

// Paystack redirects back with ?reference=... or ?trxref=... depending
// on integration path — checking both, since either can show up.
const POLL_INTERVAL_MS = 2500;
const MAX_POLL_ATTEMPTS = 24; // ~60s total, matches M-Pesa's own 180s prompt window with margin to spare on the shorter card-payment path

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying | success | failed | timeout
  const [message, setMessage] = useState("Confirming your payment...");
  const attemptsRef = useRef(0);

  const reference = searchParams.get("reference") || searchParams.get("trxref");

  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      setMessage("No payment reference found in the URL.");
      return;
    }

    let cancelled = false;

    const poll = async () => {
      try {
        const txn = await verifyPayment(reference);

        if (cancelled) return;

        if (txn.status === "success") {
          setStatus("success");
          setMessage("Payment confirmed. Your report is now being generated.");

          // Also poll the actual report status briefly, so we can route
          // straight to it once ready rather than dumping the user back
          // on a static success screen.
          const reportId = sessionStorage.getItem("pending_report_id");
          if (reportId) {
            sessionStorage.removeItem("pending_report_id");
            try {
              const report = await fetchReportStatus(reportId);
              if (report.status === "ready") {
                setMessage("Your report is ready.");
              }
            } catch {
              // non-fatal — dashboard will show it once it's ready regardless
            }
          }
          return;
        }

        if (txn.status === "failed" || txn.status === "abandoned") {
          setStatus("failed");
          setMessage("This payment was not successful. You can try again from your dashboard.");
          return;
        }

        // Still pending — keep polling up to MAX_POLL_ATTEMPTS.
        attemptsRef.current += 1;
        if (attemptsRef.current >= MAX_POLL_ATTEMPTS) {
          setStatus("timeout");
          setMessage(
            "We haven't confirmed this payment yet. If money left your account, it will be reflected shortly — check your dashboard in a few minutes."
          );
          return;
        }
        setTimeout(poll, POLL_INTERVAL_MS);
      } catch (err) {
        if (cancelled) return;
        setStatus("failed");
        setMessage(err.response?.data?.error || "Could not verify this payment right now.");
      }
    };

    poll();
    return () => { cancelled = true; };
  }, [reference]);

  return (
    <div className={styles.callbackPage}>
      <div className={styles.callbackCard}>
        {status === "verifying" && <div className={styles.spinner} />}
        {status === "success" && <div className={`${styles.icon} ${styles.iconSuccess}`}>✓</div>}
        {(status === "failed" || status === "timeout") && <div className={`${styles.icon} ${styles.iconError}`}>!</div>}

        <h2>
          {status === "verifying" && "Confirming payment"}
          {status === "success" && "Payment successful"}
          {status === "failed" && "Payment issue"}
          {status === "timeout" && "Still confirming"}
        </h2>
        <p>{message}</p>

        {status !== "verifying" && (
          <button className={styles.dashboardBtn} onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}
