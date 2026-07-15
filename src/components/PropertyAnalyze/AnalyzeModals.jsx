import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle } from "lucide-react";

// Theme-neutral email-capture + OTP modals shared by every page that uses
// usePropertyAnalyze(). Spread the hook's return value into this component.
export default function AnalyzeModals({
  emailModal, setEmailModal, submitEmailModal, closeEmailModal,
  otpModal, setOtpModal, otpCode, setOtpCode, otpSubmitting, otpError,
  handleOtpRequestCode, handleOtpVerifyCode, closeOtpModal,
}) {
  return (
    <AnimatePresence>
      {emailModal && (
        <ModalShell key="email-modal" onClose={closeEmailModal}>
          <h3 style={modalTitleStyle}>Where should we send this?</h3>
          <p style={modalSubStyle}>One quick step before we pull your report — enter your email to unlock it.</p>
          <form onSubmit={submitEmailModal} style={{ marginTop: 16 }}>
            <input
              type="email"
              autoFocus
              required
              placeholder="you@example.com"
              value={emailModal.value}
              onChange={(e) => setEmailModal((m) => ({ ...m, value: e.target.value }))}
              style={modalInputStyle}
            />
            <button type="submit" style={modalPrimaryBtnStyle}>Continue</button>
          </form>
        </ModalShell>
      )}

      {otpModal && (
        <ModalShell key="otp-modal" onClose={closeOtpModal}>
          {otpModal.step === "phone" ? (
            <>
              <h3 style={modalTitleStyle}>Quick verification needed</h3>
              <p style={modalSubStyle}>We need to confirm this device with an SMS code before generating this report.</p>
              <form onSubmit={handleOtpRequestCode} style={{ marginTop: 16 }}>
                <input
                  type="tel"
                  autoFocus
                  required
                  placeholder="0712345678"
                  value={otpModal.phoneNumber}
                  onChange={(e) => setOtpModal((m) => ({ ...m, phoneNumber: e.target.value }))}
                  style={modalInputStyle}
                />
                {otpError && <div style={modalErrorStyle}><AlertCircle size={14} /> {otpError}</div>}
                <button type="submit" disabled={otpSubmitting} style={modalPrimaryBtnStyle}>
                  {otpSubmitting ? "Sending..." : "Send Code"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h3 style={modalTitleStyle}>Enter the code</h3>
              <p style={modalSubStyle}>We sent a code to {otpModal.phoneNumber}.</p>
              <form onSubmit={handleOtpVerifyCode} style={{ marginTop: 16 }}>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  style={modalInputStyle}
                />
                {otpError && <div style={modalErrorStyle}><AlertCircle size={14} /> {otpError}</div>}
                <button type="submit" disabled={otpSubmitting} style={modalPrimaryBtnStyle}>
                  {otpSubmitting ? "Verifying..." : "Verify"}
                </button>
              </form>
            </>
          )}
        </ModalShell>
      )}
    </AnimatePresence>
  );
}

function ModalShell({ children, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(20,22,24,0.72)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.97 }}
        style={{ background: "#fff", color: "#181818", borderRadius: 10, padding: "28px 26px", width: "100%", maxWidth: 380, position: "relative", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.5)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer", color: "#888" }}>
          <X size={18} />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}

const modalTitleStyle = { fontFamily: "var(--font-display)", fontSize: 19, margin: 0, paddingRight: 20 };
const modalSubStyle = { fontSize: 13.5, color: "#666", marginTop: 8, lineHeight: 1.5 };
const modalInputStyle = { width: "100%", padding: "12px 14px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14, outline: "none", boxSizing: "border-box" };
const modalPrimaryBtnStyle = { width: "100%", marginTop: 12, padding: "12px 14px", background: "#181818", color: "#fff", border: "none", borderRadius: 6, fontWeight: 700, fontSize: 13.5, cursor: "pointer" };
const modalErrorStyle = { marginTop: 10, fontSize: 12.5, color: "#b3261e", display: "flex", alignItems: "center", gap: 6 };
