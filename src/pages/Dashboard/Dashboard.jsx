// src/pages/dashboard/Dashboard.jsx
import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Home, BarChart2, Users, Settings, LogOut,
  ChevronLeft, ChevronRight, Search, Bell, MessageSquare,
  User, Plus, ArrowUp, ArrowDown, Eye, Download, Filter,
  Calendar, Clock, CheckCircle, AlertCircle, X, Menu,
  MapPin, TrendingUp, TrendingDown, DollarSign, Activity,
  PieChart, LineChart, FileText, Star, Zap, Shield, Award,
  Briefcase, Landmark, Building2, ChevronDown, ChevronUp,
  Loader2, RefreshCw, ExternalLink, Copy, Share2, MoreVertical, Phone, Gift
} from "lucide-react";
import styles from "./Dashboard.module.css";
import api, { tokenStorage } from "../../api/client";
import { logout as apiLogout } from "../../api/auth";
import { fetchReports as fetchReportsApi, submitPin, fetchMyUsage, fetchWallet, topUpWallet, requestOTP, verifyOTP } from "../../api/billing";
import { getDeviceFingerprint } from "../../utils/deviceId";
import { getViewedReportIds, markReportViewed } from "../../utils/viewedReports";

// ─── ANIMATION VARIANTS (same as before) ──────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, type: "spring", stiffness: 200 } }
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

// ─── SUB-COMPONENTS ─────────────────────────────────────────────────────
const StatCard = ({ stat }) => (
  <motion.div className={styles.statCard} variants={scaleIn}>
    <div className={styles.statIconRow}>
      <div className={styles.statIcon} style={{ color: stat.color }}>
        {stat.icon}
      </div>
      <span className={styles.statLabel}>{stat.label}</span>
    </div>
    <div className={styles.statContent}>
      <span className={styles.statValue}>{stat.value}</span>
      {stat.change && (
        <div className={`${styles.statChange} ${stat.change.startsWith('+') ? styles.statChangePositive : styles.statChangeNegative}`}>
          {stat.change}
        </div>
      )}
    </div>
  </motion.div>
);

const ReportRow = ({ report, onClick, onRetry, onCancel, isUnviewed }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'ready': return '#2e7d32';
      case 'pending': return '#ed6c02';
      case 'generating': return '#0288d1';
      case 'failed': return '#d32f2f';
      default: return '#757575';
    }
  };

  return (
    <motion.div
      className={styles.propertyRow}
      variants={fadeUp}
      whileHover={{ backgroundColor: "#f8f9fa" }}
      onClick={() => onClick(report)}
      style={isUnviewed ? {
        background: "rgba(138,69,34,0.06)",
        borderLeft: "3px solid #8a4522",
      } : { borderLeft: "3px solid transparent" }}
    >
      <div className={styles.propertyCell}>
        <div className={styles.propertyAddress}>
          <MapPin size={14} className={styles.propertyPin} />
          <span>{report.address}</span>
          {isUnviewed && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: "#8a4522", letterSpacing: 0.5 }}>NEW</span>}
        </div>
      </div>
      <div className={styles.propertyCell}>
        <div className={styles.propertyScore}>
          <span className={styles.scoreNumber}>{report.score ?? "—"}</span>
        </div>
      </div>
      <div className={styles.propertyCell}>
        <span className={styles.propertyStatus} style={{ color: getStatusColor(report.status) }}>
          {(report.status === "pending" || report.status === "generating") && (
            <Loader2 size={13} className={styles.spinIcon} style={{ marginRight: 6, verticalAlign: "-2px" }} />
          )}
          {report.status_display}
        </span>
      </div>
      <div className={styles.propertyCell}>
        <span className={styles.propertyDate}>{report.created_at_display}</span>
      </div>
      <div className={styles.propertyCell}>
        <button className={styles.viewBtn} onClick={(e) => { e.stopPropagation(); onClick(report); }}>
          <Eye size={16} />
        </button>
        {report.status === "failed" && (
          <button className={styles.viewBtn} title="Retry" onClick={(e) => { e.stopPropagation(); onRetry(report); }}>
            <RefreshCw size={16} />
          </button>
        )}
        {(report.status === "pending" || report.status === "generating") && (
          <button className={styles.viewBtn} title="Cancel" onClick={(e) => { e.stopPropagation(); onCancel(report); }}>
            <X size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [userName, setUserName] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [usage, setUsage] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [wallet, setWallet] = useState(null);
  const [topUpModal, setTopUpModal] = useState(null); // { amount: string, submitting: bool, error: string }
  const [viewedReportIds, setViewedReportIds] = useState(() => getViewedReportIds());
  const [userProfile, setUserProfile] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [passwordForm, setPasswordForm] = useState({ current_password: "", new_password: "", confirm: "" });
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  // ─── OTP modal state ────────────────────────────────────────────
  const [otpModal, setOtpModal] = useState(null); // { reportId, fingerprintHash, step: "phone"|"code", phoneNumber }
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState(null);
  const [otpSubmitting, setOtpSubmitting] = useState(false);

  // ─── Fetch reports ──────────────────────────────────────────────────
  const fetchReports = async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await fetchReportsApi();
      setReports(data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }
      setError(err.response?.data?.detail || "Failed to load reports.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication
    const token = tokenStorage.getAccess();
    if (!token) {
      navigate("/login");
      return;
    }
    fetchReports();
    fetchMyUsage().then(setUsage).catch(() => {});
    fetchWallet().then(setWallet).catch(() => {});
    // Fetch user info (optional)
    api.get("/users/me/").then(({ data }) => {
      setUserName(data.full_name || "User");
      setUserProfile(data);
    }).catch(() => {});
  }, []);

  // ─── Live polling — always keeps reports + usage/balance in sync.
  // Faster (4s) while something is actively pending/generating so the
  // user sees status flip quickly; slower (15s) otherwise so cancels,
  // retries, or changes from another tab/device still surface without
  // the user needing to hit refresh manually. ───────────────────────
  useEffect(() => {
    const hasPending = reports.some(
      (r) => r.status === "pending" || r.status === "generating"
    );
    const pollMs = hasPending ? 4000 : 15000;

    const interval = setInterval(async () => {
      setIsRefreshing(true);
      await fetchReports({ silent: true });
      await fetchMyUsage().then(setUsage).catch(() => {});
      await fetchWallet().then(setWallet).catch(() => {});
      setIsRefreshing(false);
    }, pollMs);

    return () => clearInterval(interval);
  }, [reports]);

  // ─── Stats ──────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const now = Date.now();
    const cutoff = now - 24 * 60 * 60 * 1000; // 24 hours ago
    const recent = reports.filter(r => new Date(r.created_at).getTime() >= cutoff);

    const total = recent.length;
    const scores = reports.map(r => r.score).filter(s => s !== null);
    const avgScore = scores.length ? Math.round(scores.reduce((a,b) => a+b, 0) / scores.length) : 0;
    const ready = recent.filter(r => r.status === "ready").length;
    const pending = reports.filter(r => r.status === "pending" || r.status === "generating").length;
    const failed = reports.filter(r => r.status === "failed").length;
    return { total, avgScore, ready, pending, failed };
  }, [reports]);

  // ─── Filtered reports ──────────────────────────────────────────────
  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) return reports;
    return reports.filter(r =>
      r.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reports, searchQuery]);

  // ─── Handlers ──────────────────────────────────────────────────────
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchReports({ silent: true });
    setIsRefreshing(false);
  };

  const handleLogout = async () => {
    await apiLogout();
    navigate("/login");
  };

  const [checkStatusMessage, setCheckStatusMessage] = useState(null);
  const [checkSubmitting, setCheckSubmitting] = useState(false);

  const handleQuickCheck = async (address) => {
    setCheckSubmitting(true);
    setCheckStatusMessage(null);
    try {
      const fingerprintHash = await getDeviceFingerprint();
      // Logged-in dashboard user's own email, never a placeholder — the
      // backend links this submission to the logged-in Broker/User via
      // the JWT already attached by api/client.js's interceptor.
      let email = localStorage.getItem("user_email");
      if (!email) {
        try {
          const { data } = await api.get("/users/me/");
          email = data.email;
          if (email) localStorage.setItem("user_email", email);
        } catch {
          // fall through — backend will reject with 400 if email truly missing
        }
      }

      const response = await submitPin({ rawInput: address, email, fingerprintHash });
      const body = response.data;

      if (response.status === 201) {
        setCheckStatusMessage({ type: "success", text: "Report queued — it'll appear below shortly." });
        fetchReports({ silent: true });
        setTimeout(() => setCheckStatusMessage(null), 6000);
      } else if (response.status === 200 && body.requires_otp) {
        setOtpModal({ reportId: body.report_id, fingerprintHash, step: "phone", phoneNumber: "" });
        setCheckStatusMessage(null);
      } else if (response.status === 202) {
        setCheckStatusMessage({ type: "info", text: body.message || "Held for manual review." });
      }
    } catch (err) {
      const status = err.response?.status;
      const body = err.response?.data;

      if (status === 402 && body?.checkout_url) {
        // Free tier exhausted — send the browser to Paystack's checkout.
        // Persist the report id so /payment/callback can poll the right
        // report once the payer returns.
        sessionStorage.setItem("pending_report_id", body.report_id);
        window.location.href = body.checkout_url;
        return;
      } else if (status === 403) {
        setCheckStatusMessage({ type: "error", text: body?.error || "This device has been blocked." });
      } else {
        setCheckStatusMessage({ type: "error", text: body?.error || "Submission failed. Please try again." });
      }
    } finally {
      setCheckSubmitting(false);
    }
  };

  // ─── OTP handlers ──────────────────────────────────────────────────
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
      if (response.status === 402) {
        const body = response.data;
        if (body.checkout_url) {
          sessionStorage.setItem("pending_report_id", body.report_id);
          window.location.href = body.checkout_url;
          return;
        }
      }
      setOtpModal(null);
      setOtpCode("");
      setCheckStatusMessage({ type: "success", text: "Verified! Your report is being generated." });
      fetchReports();
    } catch (err) {
      const status = err.response?.status;
      const body = err.response?.data;
      if (status === 402 && body?.checkout_url) {
        sessionStorage.setItem("pending_report_id", body.report_id);
        window.location.href = body.checkout_url;
        return;
      }
      setOtpError(body?.error || "Incorrect code. Please try again.");
    } finally {
      setOtpSubmitting(false);
    }
  };

  const handleOpenReport = (report) => {
    setViewedReportIds(markReportViewed(report.id));
    setSelectedReport(report);
  };

  const closeOtpModal = () => {
    setOtpModal(null);
    setOtpCode("");
    setOtpError(null);
  };

  // ─── Top-up handlers ────────────────────────────────────────────────
  const closeTopUpModal = () => setTopUpModal(null);

  const handleTopUpSubmit = async (e) => {
    e.preventDefault();
    const amount = Number(topUpModal.amount);
    if (!amount || amount <= 0) {
      setTopUpModal((m) => ({ ...m, error: "Enter a valid amount greater than 0." }));
      return;
    }
    setTopUpModal((m) => ({ ...m, submitting: true, error: "" }));
    try {
      const { checkout_url } = await topUpWallet({ amount });
      if (checkout_url) {
        window.location.href = checkout_url;
      } else {
        setTopUpModal((m) => ({ ...m, submitting: false, error: "Could not start top-up right now — please try again." }));
      }
    } catch (err) {
      setTopUpModal((m) => ({ ...m, submitting: false, error: err?.response?.data?.error || "Could not start top-up right now — please try again." }));
    }
  };

  // ─── Report action handlers ─────────────────────────────────────────
  const handleViewPdf = (report) => {
    if (report.pdf_storage_path) {
      window.open(report.pdf_storage_path, "_blank", "noopener,noreferrer");
    }
  };

  const handleShare = async (report) => {
    const shareUrl = `${window.location.origin}/dashboard?report=${report.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCheckStatusMessage({ type: "success", text: "Link copied to clipboard." });
    } catch {
      setCheckStatusMessage({ type: "error", text: "Could not copy link." });
    }
  };

  const handleExport = () => {
    if (filteredReports.length === 0) return;
    const headers = ["Address", "Score", "Status", "Free Tier", "Paid", "Created"];
    const rows = filteredReports.map((r) => [
      r.address, r.score ?? "", r.status_display, r.is_free_tier ? "Yes" : "No", r.is_paid ? "Yes" : "No", r.created_at_display,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `scape-reports-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (activeTab === "settings") {
      api.get("/payments/history/").then(({ data }) => setPaymentHistory(data)).catch(() => {});
    }
  }, [activeTab]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordStatus(null);
    if (passwordForm.new_password !== passwordForm.confirm) {
      setPasswordStatus({ type: "error", text: "New passwords don't match." });
      return;
    }
    setPasswordSubmitting(true);
    try {
      await api.post("/users/change-password/", {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      setPasswordStatus({ type: "success", text: "Password updated successfully." });
      setPasswordForm({ current_password: "", new_password: "", confirm: "" });
    } catch (err) {
      setPasswordStatus({ type: "error", text: err.response?.data?.detail || "Could not update password." });
    } finally {
      setPasswordSubmitting(false);
    }
  };

  // ─── Retry / Cancel handlers ─────────────────────────────────────
  const [actionBusy, setActionBusy] = useState(null); // report id currently being retried/cancelled

  const handleRetryReport = async (report) => {
    setActionBusy(report.id);
    try {
      await api.post(`/property/reports/${report.id}/retry/`);
      setCheckStatusMessage({ type: "success", text: "Retrying report generation." });
      await fetchReports({ silent: true });
    } catch (err) {
      setCheckStatusMessage({ type: "error", text: err.response?.data?.error || "Could not retry this report." });
    } finally {
      setActionBusy(null);
    }
  };

  const handleCancelReport = async (report) => {
    setActionBusy(report.id);
    try {
      await api.post(`/property/reports/${report.id}/cancel/`);
      setCheckStatusMessage({ type: "success", text: "Report cancelled — your free report was credited back." });
      await fetchReports({ silent: true });
      await fetchMyUsage().then(setUsage).catch(() => {});
    } catch (err) {
      setCheckStatusMessage({ type: "error", text: err.response?.data?.error || "Could not cancel this report." });
    } finally {
      setActionBusy(null);
    }
  };

  // ─── RENDER ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className={styles.loadingOverlay}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <Loader2 size={40} color="#b5602f" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* ─── SIDEBAR ─── */}
      <motion.aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -220 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.sidebarBrand}>
          <Link to="/" className={styles.sidebarLogo}>
            <span>Scape</span>
            <em>Property Intelligence</em>
          </Link>
          <button className={styles.sidebarToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          {[
            { icon: <LayoutDashboard size={20} />, label: "Overview", id: "overview" },
            { icon: <Home size={20} />, label: "Reports", id: "reports" },
            { icon: <BarChart2 size={20} />, label: "Analytics", id: "analytics" },
            { icon: <Settings size={20} />, label: "Settings", id: "settings" },
          ].map((item) => (
            <motion.button
              key={item.id}
              className={`${styles.sidebarLink} ${activeTab === item.id ? styles.sidebarLinkActive : ''}`}
              onClick={() => setActiveTab(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
            >
              {item.icon}
              <span className={styles.sidebarLabel}>{item.label}</span>
            </motion.button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.sidebarLink} onClick={handleLogout}>
            <LogOut size={20} />
            <span className={styles.sidebarLabel}>Logout</span>
          </button>
          <div className={styles.sidebarUser}>
            <div className={styles.userAvatar}>{userName.charAt(0).toUpperCase()}</div>
            {sidebarOpen && (
              <div className={styles.userInfo}>
                <span className={styles.userName}>{userName}</span>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* ─── MAIN CONTENT ─── */}
      <motion.main
        className={`${styles.mainContent} ${!sidebarOpen ? styles.mainContentFull : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* ─── TOP BAR ─── */}
        <header className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <button className={styles.menuBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={22} />
            </button>
            <h1 className={styles.pageTitle}>
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "reports" && "My Reports"}
              {activeTab === "analytics" && "Analytics"}
              {activeTab === "profile" && "Profile"}
              {activeTab === "settings" && "Settings"}
            </h1>
          </div>
          <div className={styles.topBarRight}>
            <div className={styles.searchBar}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <button className={styles.refreshBtn} onClick={handleRefresh} disabled={isRefreshing}>
              <motion.div
                animate={{ rotate: isRefreshing ? 360 : 0 }}
                transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : { duration: 0.2 }}
              >
                <RefreshCw size={18} />
              </motion.div>
            </button>
            <div className={styles.userMenu} ref={profileMenuRef}>
              <button
                className={styles.userAvatarSmall}
                onClick={() => setProfileMenuOpen((open) => !open)}
                style={{ border: "none", padding: 0 }}
              >
                {userName.charAt(0).toUpperCase()}
              </button>
              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    className={styles.profileDropdown}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className={styles.profileDropdownHeader}>
                      <span className={styles.profileDropdownName}>{userName}</span>
                      <span className={styles.profileDropdownEmail}>{userProfile?.email || ""}</span>
                    </div>
                    <button className={styles.profileDropdownItem} onClick={() => { setActiveTab("profile"); setProfileMenuOpen(false); }}>
                      <User size={16} /> Profile
                    </button>
                    <button className={styles.profileDropdownItem} onClick={() => { setActiveTab("settings"); setProfileMenuOpen(false); }}>
                      <Settings size={16} /> Settings
                    </button>
                    <div className={styles.profileDropdownDivider} />
                    <button className={styles.profileDropdownItem} onClick={handleLogout}>
                      <LogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ─── OVERVIEW TAB ─── */}
        {activeTab === "overview" && (
          <motion.div className={styles.tabContent} initial="hidden" animate="visible" variants={staggerContainer}>
            {/* Stats Grid */}
            <div className={styles.statsGrid}>
              <div>
                <StatCard stat={{ label: "My Balance", value: wallet ? `KES ${Number(wallet.balance).toLocaleString()}` : "—", icon: <DollarSign size={14} />, color: "#8a4522" }} />
                <button
                  type="button"
                  onClick={() => setTopUpModal({ amount: "", submitting: false, error: "" })}
                  style={{
                    display: "block", width: "calc(100% - 32px)", margin: "0 16px 12px",
                    fontSize: 11, fontWeight: 600, padding: "5px 10px", borderRadius: 999,
                    border: "1px solid #8a4522", background: "transparent", color: "#8a4522",
                    cursor: "pointer",
                  }}
                >
                  Top Up
                </button>
              </div>
              <StatCard stat={{ label: "Free Reports Left", value: usage ? usage.freeReportsRemaining : "—", icon: <Gift size={14} />, color: "#8a4522" }} />
              <StatCard stat={{ label: "Reports (24h)", value: stats.total, icon: <FileText size={14} />, color: "#35606e" }} />
              <StatCard stat={{ label: "Average Score", value: stats.avgScore, icon: <BarChart2 size={14} />, color: "#b5602f" }} />
              <StatCard stat={{ label: "Ready (24h)", value: stats.ready, icon: <CheckCircle size={14} />, color: "#2e7d32" }} />
              <StatCard stat={{ label: "Pending", value: stats.pending, icon: <Clock size={14} />, color: "#ed6c02" }} />
            </div>

            {/* Quick Check */}
            <motion.div className={styles.quickCheck} variants={fadeUp}>
              <div className={styles.quickCheckContent}>
                <div className={styles.quickCheckText}>
                  <h3>Check a new property</h3>
                  <p>Enter an address or paste a Google Maps link</p>
                </div>
                <div className={styles.quickCheckInput}>
                  <input
                    type="text"
                    placeholder="Enter address or Google Maps link..."
                    className={styles.quickCheckField}
                    id="quickCheckInput"
                  />
                  <motion.button
                    className={styles.quickCheckBtn}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={checkSubmitting}
                    onClick={() => {
                      const input = document.getElementById("quickCheckInput");
                      if (input.value.trim()) handleQuickCheck(input.value.trim());
                    }}
                  >
                    <Search size={16} />
                    <span>{checkSubmitting ? "Checking..." : "Analyze"}</span>
                  </motion.button>
                </div>
                {checkStatusMessage && (
                  <p className={`${styles.checkStatus} ${
                    checkStatusMessage.type === "error" ? styles.checkStatusError :
                    checkStatusMessage.type === "success" ? styles.checkStatusSuccess :
                    styles.checkStatusInfo
                  }`}>
                    {checkStatusMessage.text}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Recent Reports */}
            <motion.div className={styles.activityCard} variants={fadeUp}>
              <div className={styles.cardHeader}>
                <h4>Recent Reports</h4>
                <button className={styles.viewAllBtn} onClick={() => setActiveTab("reports")}>View All</button>
              </div>
              {reports.length === 0 ? (
                <p className={styles.emptyState}>No reports yet. Check a property to get started.</p>
              ) : (
                <div className={styles.activityList}>
                  {reports.slice(0, 5).map((report) => {
                    const isUnviewed = !viewedReportIds.has(report.id);
                    return (
                      <div
                        key={report.id}
                        className={styles.activityItem}
                        onClick={() => handleOpenReport(report)}
                        style={isUnviewed ? {
                          background: "rgba(138,69,34,0.06)",
                          borderLeft: "3px solid #8a4522",
                        } : { borderLeft: "3px solid transparent" }}
                      >
                        <div className={styles.activityIcon}>
                          {(report.status === "pending" || report.status === "generating")
                            ? <Loader2 size={14} className={styles.spinIcon} />
                            : <FileText size={14} />}
                        </div>
                        <div className={styles.activityContent}>
                          <span className={styles.activityText}>
                            <strong>{report.address}</strong> – {report.status_display}
                            {isUnviewed && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: "#8a4522", letterSpacing: 0.5 }}>NEW</span>}
                          </span>
                          <span className={styles.activityTime}>{report.created_at_display}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* ─── REPORTS TAB ─── */}
        {activeTab === "reports" && (
          <motion.div className={styles.tabContent} initial="hidden" animate="visible" variants={staggerContainer}>
            <div className={styles.propertiesHeader}>
              <div className={styles.propertiesHeaderLeft}>
                <h2 className={styles.propertiesTitle}>My Reports</h2>
                <span className={styles.propertiesCount}>{filteredReports.length} reports</span>
              </div>
              <div className={styles.propertiesHeaderRight}>
                <button className={styles.exportBtn} onClick={handleExport}><Download size={16} /> Export</button>
              </div>
            </div>
            <div className={styles.propertiesTable}>
              <div className={styles.tableHeader}>
                <span>Property</span>
                <span>Score</span>
                <span>Status</span>
                <span>Date</span>
                <span>Action</span>
              </div>
              <div className={styles.tableBody}>
                {filteredReports.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>No reports found.</p>
                  </div>
                ) : (
                  filteredReports.map((report) => (
                    <ReportRow key={report.id} report={report} isUnviewed={!viewedReportIds.has(report.id)} onClick={handleOpenReport} onRetry={handleRetryReport} onCancel={handleCancelReport} />
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Placeholder tab */}
        {activeTab === "analytics" && (
          <div className={styles.placeholderContent}>
            <div className={styles.placeholderIcon}><PieChart size={48} /></div>
            <h3>Analytics</h3>
            <p>This section is under development. Check back soon!</p>
          </div>
        )}

        {/* ─── PROFILE TAB ─── */}
        {activeTab === "profile" && (
          <motion.div className={styles.tabContent} initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div className={styles.activityCard} variants={fadeUp} style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "8px 4px 20px" }}>
                <div className={styles.userAvatar} style={{ width: 56, height: 56, fontSize: 22 }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <strong style={{ fontSize: 18, display: "block" }}>{userName}</strong>
                  <span style={{ fontSize: 13, color: "#8c826a" }}>{userProfile?.email || "—"}</span>
                </div>
              </div>
              <div className={styles.cardHeader}><h4>Account details</h4></div>
              <div style={{ padding: "8px 4px", display: "grid", gap: 14 }}>
                <div><span style={{ fontSize: 12, color: "#8c826a", display: "block" }}>Full name</span><strong>{userProfile?.full_name || "—"}</strong></div>
                <div><span style={{ fontSize: 12, color: "#8c826a", display: "block" }}>Email</span><strong>{userProfile?.email || "—"}</strong> {userProfile?.email_verified ? <span style={{ color: "#2e7d32", fontSize: 12, marginLeft: 8 }}>Verified</span> : <span style={{ color: "#ed6c02", fontSize: 12, marginLeft: 8 }}>Not verified</span>}</div>
                <div><span style={{ fontSize: 12, color: "#8c826a", display: "block" }}>Phone</span><strong>{userProfile?.phone || "—"}</strong></div>
                <div><span style={{ fontSize: 12, color: "#8c826a", display: "block" }}>Member since</span><strong>{userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : "—"}</strong></div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ─── SETTINGS TAB ─── */}
        {activeTab === "settings" && (
          <motion.div className={styles.tabContent} initial="hidden" animate="visible" variants={staggerContainer}>

            {/* Change password */}
            <motion.div className={styles.activityCard} variants={fadeUp} style={{ marginBottom: 24 }}>
              <div className={styles.cardHeader}><h4>Change password</h4></div>
              <form onSubmit={handlePasswordSubmit} style={{ padding: "8px 4px", display: "grid", gap: 12, maxWidth: 380 }}>
                {passwordStatus && (
                  <p style={{ fontSize: 13, color: passwordStatus.type === "error" ? "#d32f2f" : "#2e7d32", margin: 0 }}>{passwordStatus.text}</p>
                )}
                <input type="password" required placeholder="Current password" value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm(f => ({ ...f, current_password: e.target.value }))}
                  style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e9ecef", fontSize: 14 }} />
                <input type="password" required placeholder="New password" value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm(f => ({ ...f, new_password: e.target.value }))}
                  style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e9ecef", fontSize: 14 }} />
                <input type="password" required placeholder="Confirm new password" value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm(f => ({ ...f, confirm: e.target.value }))}
                  style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e9ecef", fontSize: 14 }} />
                <button type="submit" disabled={passwordSubmitting} className={styles.quickCheckBtn} style={{ justifyContent: "center", background: "#b5602f", width: "fit-content" }}>
                  {passwordSubmitting ? "Updating..." : "Update password"}
                </button>
              </form>
            </motion.div>

            {/* Billing & usage */}
            <motion.div className={styles.activityCard} variants={fadeUp} style={{ marginBottom: 24 }}>
              <div className={styles.cardHeader}><h4>Billing & usage</h4></div>
              <div style={{ padding: "8px 4px 16px", display: "flex", gap: 32 }}>
                <div><span style={{ fontSize: 12, color: "#8c826a", display: "block" }}>Free reports left</span><strong style={{ fontSize: 20 }}>{usage?.freeReportsRemaining ?? "—"}</strong></div>
                <div><span style={{ fontSize: 12, color: "#8c826a", display: "block" }}>Free reports used</span><strong style={{ fontSize: 20 }}>{usage?.freeReportsUsedTotal ?? "—"}</strong></div>
              </div>
              {paymentHistory.length === 0 ? (
                <p className={styles.emptyState}>No payments yet.</p>
              ) : (
                <div className={styles.propertiesTable}>
                  <div className={styles.tableHeader}>
                    <span>Reference</span><span>Amount</span><span>Status</span><span>Date</span><span></span>
                  </div>
                  <div className={styles.tableBody}>
                    {paymentHistory.map((txn) => (
                      <div key={txn.reference} className={styles.propertyRow}>
                        <div className={styles.propertyCell}>{txn.reference}</div>
                        <div className={styles.propertyCell}>{txn.amount} {txn.currency}</div>
                        <div className={styles.propertyCell} style={{ color: txn.status === "success" ? "#2e7d32" : txn.status === "failed" ? "#d32f2f" : "#ed6c02" }}>{txn.status}</div>
                        <div className={styles.propertyCell}>{txn.paid_at ? new Date(txn.paid_at).toLocaleDateString() : new Date(txn.created_at).toLocaleDateString()}</div>
                        <div className={styles.propertyCell}></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

          </motion.div>
        )}
      </motion.main>

      {/* ─── REPORT DETAIL SIDEBAR ─── */}
      <AnimatePresence>
        {selectedReport && (
          <motion.aside
            className={styles.detailSidebar}
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.detailHeader}>
              <h4>Report Details</h4>
              <button className={styles.detailClose} onClick={() => setSelectedReport(null)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.detailBody}>
              <div className={styles.detailAddress}>
                <MapPin size={18} className={styles.detailPin} />
                <span>{selectedReport.address}</span>
              </div>
              <div className={styles.detailScoreSection}>
                <div className={styles.detailScoreBig}>{selectedReport.score ?? "—"}</div>
                <div className={styles.detailScoreLabel}>Investment Score</div>
              </div>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Status</span>
                  <span className={styles.detailValue}>{selectedReport.status_display}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Free Tier</span>
                  <span className={styles.detailValue}>{selectedReport.is_free_tier ? "Yes" : "No"}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Paid</span>
                  <span className={styles.detailValue}>{selectedReport.is_paid ? "Yes" : "No"}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Created</span>
                  <span className={styles.detailValue}>{selectedReport.created_at_display}</span>
                </div>
              </div>
              <div className={styles.detailActions}>
                {selectedReport.status === "ready" && selectedReport.pdf_storage_path && (
                  <button className={styles.detailActionBtn} onClick={() => handleViewPdf(selectedReport)}>
                    <Eye size={16} /> View PDF
                  </button>
                )}
                <button className={styles.detailActionBtn} onClick={() => handleShare(selectedReport)}>
                  <Share2 size={16} /> Share
                </button>
                {selectedReport.status === "failed" && (
                  <button
                    className={styles.detailActionBtn}
                    disabled={actionBusy === selectedReport.id}
                    onClick={() => handleRetryReport(selectedReport)}
                  >
                    <RefreshCw size={16} /> {actionBusy === selectedReport.id ? "Retrying..." : "Retry"}
                  </button>
                )}
                {(selectedReport.status === "pending" || selectedReport.status === "generating") && (
                  <button
                    className={styles.detailActionBtn}
                    disabled={actionBusy === selectedReport.id}
                    onClick={() => handleCancelReport(selectedReport)}
                  >
                    <X size={16} /> {actionBusy === selectedReport.id ? "Cancelling..." : "Cancel"}
                  </button>
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ─── OTP VERIFICATION MODAL ─── */}
      <AnimatePresence>
        {otpModal && (
          <motion.div
            style={{ position: "fixed", inset: 0, background: "rgba(15,32,39,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOtpModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: 16, padding: 32, maxWidth: 380, width: "90%" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Phone size={20} color="#b5602f" />
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Verify your phone</h3>
              </div>
              <p style={{ fontSize: 13, color: "#6c757d", marginBottom: 20 }}>
                {otpModal.step === "phone"
                  ? "We need to confirm your number before generating this report."
                  : `Enter the code sent to ${otpModal.phoneNumber}.`}
              </p>

              {otpError && (
                <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "10px 14px", background: "rgba(211,47,47,0.08)", border: "1px solid #d32f2f", color: "#d32f2f", fontSize: 13, borderRadius: 8, marginBottom: 16 }}>
                  <AlertCircle size={16} /> {otpError}
                </div>
              )}

              {otpModal.step === "phone" ? (
                <form onSubmit={handleOtpRequestCode}>
                  <input
                    type="tel"
                    required
                    autoFocus
                    placeholder="0712345678"
                    value={otpModal.phoneNumber}
                    onChange={(e) => setOtpModal((m) => ({ ...m, phoneNumber: e.target.value }))}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #e9ecef", fontSize: 14, marginBottom: 16, boxSizing: "border-box" }}
                  />
                  <button type="submit" disabled={otpSubmitting} className={styles.quickCheckBtn} style={{ width: "100%", justifyContent: "center", background: "#b5602f" }}>
                    {otpSubmitting ? "Sending..." : "Send code"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOtpVerifyCode}>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    autoFocus
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #e9ecef", fontSize: 18, letterSpacing: 4, textAlign: "center", marginBottom: 16, boxSizing: "border-box" }}
                  />
                  <button type="submit" disabled={otpSubmitting} className={styles.quickCheckBtn} style={{ width: "100%", justifyContent: "center", background: "#b5602f" }}>
                    {otpSubmitting ? "Verifying..." : "Verify"}
                  </button>
                </form>
              )}

              <button onClick={closeOtpModal} style={{ display: "block", margin: "16px auto 0", background: "none", border: "none", color: "#6c757d", fontSize: 13, cursor: "pointer" }}>
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── TOP UP MODAL ─── */}
      <AnimatePresence>
        {topUpModal && (
          <motion.div
            style={{ position: "fixed", inset: 0, background: "rgba(15,32,39,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeTopUpModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: 16, padding: 32, maxWidth: 380, width: "90%" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <DollarSign size={20} color="#8a4522" />
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Top up your balance</h3>
              </div>
              <p style={{ fontSize: 13, color: "#6c757d", marginBottom: 20 }}>
                Add funds via M-Pesa or card. You'll be redirected to Paystack to complete payment.
              </p>

              {topUpModal.error && (
                <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "10px 14px", background: "rgba(211,47,47,0.08)", border: "1px solid #d32f2f", color: "#d32f2f", fontSize: 13, borderRadius: 8, marginBottom: 16 }}>
                  <AlertCircle size={16} /> {topUpModal.error}
                </div>
              )}

              <form onSubmit={handleTopUpSubmit}>
                <div style={{ position: "relative", marginBottom: 12 }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#6c757d", fontWeight: 600 }}>KES</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="1"
                    required
                    autoFocus
                    placeholder="0"
                    value={topUpModal.amount}
                    onChange={(e) => setTopUpModal((m) => ({ ...m, amount: e.target.value, error: "" }))}
                    style={{ width: "100%", padding: "12px 14px 12px 52px", borderRadius: 10, border: "1px solid #e9ecef", fontSize: 18, fontWeight: 600, boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                  {[500, 1000, 2500, 5000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTopUpModal((m) => ({ ...m, amount: String(preset), error: "" }))}
                      style={{
                        flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                        border: topUpModal.amount === String(preset) ? "1px solid #8a4522" : "1px solid #e9ecef",
                        background: topUpModal.amount === String(preset) ? "rgba(138,69,34,0.08)" : "transparent",
                        color: topUpModal.amount === String(preset) ? "#8a4522" : "#495057",
                      }}
                    >
                      {preset.toLocaleString()}
                    </button>
                  ))}
                </div>

                <button type="submit" disabled={topUpModal.submitting} className={styles.quickCheckBtn} style={{ width: "100%", justifyContent: "center", background: "#8a4522" }}>
                  {topUpModal.submitting ? "Redirecting..." : "Continue to payment"}
                </button>
              </form>

              <button onClick={closeTopUpModal} style={{ display: "block", margin: "16px auto 0", background: "none", border: "none", color: "#6c757d", fontSize: 13, cursor: "pointer" }}>
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}