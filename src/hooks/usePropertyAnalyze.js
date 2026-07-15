import { useState, useEffect, useRef } from "react";
import { submitPin, initiateReportCheckout, fetchReportStatus, requestOTP, verifyOTP } from "../api/billing";
import { getDeviceFingerprint } from "../utils/deviceId";

const GUEST_EMAIL_KEY = "scape_guest_email";
const PENDING_REPORT_KEY = "pending_report_id";
const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 40; // ~2 minutes

// Real pin-submission flow: submitPin -> poll report status, handling the
// requires_otp / manual_review / payment_required / blocked branches the
// backend can return. Used by every public page that lets a visitor run a
// live property check (homepage hero, Solutions pages), so the flow only
// lives in one place instead of being re-simulated per page.
export default function usePropertyAnalyze() {
  const [address, setAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null); // { pdfUrl } once ready
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [emailModal, setEmailModal] = useState(null); // { pendingAddress, value }
  const [otpModal, setOtpModal] = useState(null); // { reportId, fingerprintHash, step, phoneNumber }
  const [otpCode, setOtpCode] = useState("");
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [otpError, setOtpError] = useState(null);

  const pollRef = useRef(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, []);

  // Resume polling if we're bouncing back from a Paystack redirect that
  // happened on a public page (no dashboard to land on afterwards).
  useEffect(() => {
    const pendingId = sessionStorage.getItem(PENDING_REPORT_KEY);
    if (pendingId) {
      sessionStorage.removeItem(PENDING_REPORT_KEY);
      setIsSearching(true);
      setStatusMessage("Generating your report...");
      pollReport(pendingId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pollReport = (reportId, attempt = 0) => {
    if (cancelledRef.current) return;
    fetchReportStatus(reportId)
      .then((report) => {
        if (cancelledRef.current) return;
        if (report.status === "ready") {
          setResult({ pdfUrl: report.pdf_storage_path });
          setStatusMessage(null);
          setIsSearching(false);
          return;
        }
        if (report.status === "failed") {
          setErrorMessage("Report generation failed. Please try again.");
          setIsSearching(false);
          return;
        }
        if (attempt >= MAX_POLL_ATTEMPTS) {
          setErrorMessage("This is taking longer than expected. Check back shortly.");
          setIsSearching(false);
          return;
        }
        pollRef.current = setTimeout(() => pollReport(reportId, attempt + 1), POLL_INTERVAL_MS);
      })
      .catch(() => {
        if (cancelledRef.current) return;
        if (attempt >= MAX_POLL_ATTEMPTS) {
          setErrorMessage("Could not confirm report status. Check back shortly.");
          setIsSearching(false);
          return;
        }
        pollRef.current = setTimeout(() => pollReport(reportId, attempt + 1), POLL_INTERVAL_MS);
      });
  };

  const startCheckout = async (reportId) => {
    try {
      const response = await initiateReportCheckout(reportId);
      const body = response.data;
      if (body?.checkout_url) {
        sessionStorage.setItem(PENDING_REPORT_KEY, reportId);
        window.location.href = body.checkout_url;
        return;
      }
      setErrorMessage(body?.message || "Could not start checkout. Please try again.");
      setIsSearching(false);
    } catch (err) {
      const body = err.response?.data;
      if (body?.checkout_url) {
        sessionStorage.setItem(PENDING_REPORT_KEY, body.report_id || reportId);
        window.location.href = body.checkout_url;
        return;
      }
      setErrorMessage(body?.error || body?.message || "Could not start checkout. Please try again.");
      setIsSearching(false);
    }
  };

  const doSubmit = async (addressValue, email) => {
    setIsSearching(true);
    setResult(null);
    setErrorMessage(null);
    setStatusMessage("Submitting...");
    try {
      const fingerprintHash = await getDeviceFingerprint();
      const response = await submitPin({ rawInput: addressValue, email, fingerprintHash });
      const body = response.data;

      if (response.status === 201) {
        setStatusMessage("Generating your report...");
        pollReport(body.id || body.report_id);
      } else if (response.status === 200 && body.requires_otp) {
        setIsSearching(false);
        setStatusMessage(null);
        setOtpModal({ reportId: body.report_id, fingerprintHash, step: "phone", phoneNumber: "" });
      } else if (response.status === 202) {
        setStatusMessage(null);
        setIsSearching(false);
        setErrorMessage(body.message || "Submitted for manual review — you'll be notified once it's ready.");
      } else {
        setStatusMessage("Generating your report...");
        pollReport(body.id || body.report_id);
      }
    } catch (err) {
      const status = err.response?.status;
      const body = err.response?.data;
      if (status === 402 && body?.report_id) {
        setStatusMessage("Starting checkout...");
        await startCheckout(body.report_id);
        return;
      } else if (status === 403) {
        setErrorMessage(body?.error || body?.message || "This device has been blocked.");
        setIsSearching(false);
      } else {
        setErrorMessage(body?.error || body?.message || "Submission failed. Please try again.");
        setIsSearching(false);
      }
    }
  };

  const run = () => {
    if (!address.trim() || isSearching) return;
    const storedEmail = localStorage.getItem(GUEST_EMAIL_KEY);
    if (!storedEmail) {
      setEmailModal({ pendingAddress: address, value: "" });
      return;
    }
    doSubmit(address, storedEmail);
  };

  const submitEmailModal = (e) => {
    e.preventDefault();
    const email = emailModal.value.trim();
    if (!email || !email.includes("@")) return;
    localStorage.setItem(GUEST_EMAIL_KEY, email);
    const pendingAddress = emailModal.pendingAddress;
    setEmailModal(null);
    doSubmit(pendingAddress, email);
  };

  const closeEmailModal = () => setEmailModal(null);

  const closeOtpModal = () => {
    setOtpModal(null);
    setOtpCode("");
    setOtpError(null);
  };

  const handleOtpRequestCode = async (e) => {
    e.preventDefault();
    setOtpError(null);
    setOtpSubmitting(true);
    try {
      await requestOTP({ fingerprintHash: otpModal.fingerprintHash, phoneNumber: otpModal.phoneNumber });
      setOtpModal((m) => ({ ...m, step: "code" }));
    } catch (err) {
      setOtpError(err.response?.data?.error || "Could not send code. Please try again.");
    } finally {
      setOtpSubmitting(false);
    }
  };

  const handleOtpVerifyCode = async (e) => {
    e.preventDefault();
    setOtpError(null);
    setOtpSubmitting(true);
    try {
      const response = await verifyOTP({
        fingerprintHash: otpModal.fingerprintHash,
        phoneNumber: otpModal.phoneNumber,
        code: otpCode,
        reportId: otpModal.reportId,
      });
      const body = response.data;
      const reportId = otpModal.reportId;
      if (body?.checkout_url) {
        sessionStorage.setItem(PENDING_REPORT_KEY, body.report_id || reportId);
        window.location.href = body.checkout_url;
        return;
      }
      setOtpModal(null);
      setOtpCode("");
      setIsSearching(true);
      setStatusMessage("Verified! Generating your report...");
      pollReport(reportId);
    } catch (err) {
      const body = err.response?.data;
      if (body?.checkout_url) {
        sessionStorage.setItem(PENDING_REPORT_KEY, body.report_id || otpModal.reportId);
        window.location.href = body.checkout_url;
        return;
      }
      setOtpError(body?.error || "Incorrect code. Please try again.");
    } finally {
      setOtpSubmitting(false);
    }
  };

  return {
    address, setAddress, isSearching, result, statusMessage, errorMessage, run,
    emailModal, setEmailModal, submitEmailModal, closeEmailModal,
    otpModal, setOtpModal, otpCode, setOtpCode, otpSubmitting, otpError,
    handleOtpRequestCode, handleOtpVerifyCode, closeOtpModal,
  };
}
