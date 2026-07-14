import client from "./client";

/**
 * Expected shape from GET /api/billing/pricing/ :
 * {
 *   free_reports: 3,
 *   price_per_report: 300,
 *   currency: "KES"
 * }
 *
 * ADJUST THE URL / FIELD NAMES to match your actual backend endpoint if
 * this one doesn't exist yet — it's not part of property_intel/payments
 * as built so far in this conversation; wire it up separately if needed.
 */
export async function fetchPricing() {
  const { data } = await client.get("/billing/pricing/");
  return data;
}

/**
 * GET /api/property/reports/ — the dashboard's "My Reports" list.
 * Requires login (401 if not authenticated) — caller should redirect to
 * /login on that, not treat it as a generic error.
 */
export async function fetchReports() {
  const { data } = await client.get("/property/reports/");
  return data;
}

/**
 * POST /api/property/pins/ — submit a location for analysis.
 * Backend can respond with several distinct outcomes, all handled by the
 * caller (Dashboard.jsx) rather than here, so the UI can react
 * appropriately to each:
 *   201 - report queued (free tier consumed)
 *   200 - requires_otp: true (phone verification needed first)
 *   202 - held for manual review
 *   402 - payment required, checkout_url provided
 *   403 - device blocked
 */
export async function submitPin({ rawInput, email, fingerprintHash }) {
  const response = await client.post("/property/pins/", {
    raw_input: rawInput,
    email,
    fingerprint_hash: fingerprintHash,
  });
  return response; // full response, not just .data — caller needs .status
}

/**
 * GET /api/payments/verify/<reference>/ — asks Paystack directly via the
 * backend and confirms locally if successful. This is what the
 * /payment/callback page polls after Paystack redirects the browser back.
 */
export async function verifyPayment(reference) {
  const { data } = await client.get(`/payments/verify/${reference}/`);
  return data;
}

/**
 * GET /api/property/reports/<id>/ — poll a single report's status
 * (used after payment succeeds, to watch it go pending -> generating -> ready).
 */
export async function fetchReportStatus(reportId) {
  const { data } = await client.get(`/property/reports/${reportId}/`);
  return data;
}

/**
 * GET /api/property/usage/ — free-tier usage for the logged-in user.
 * Requires login (401 if not authenticated) — Pricing.jsx already guards
 * this call behind isLoggedIn() and swallows failures silently, so no
 * special error handling needed here.
 * Returns: { freeReportsRemaining: number, freeReportsUsedTotal: number }
 */
export async function fetchMyUsage() {
  const { data } = await client.get("/property/usage/");
  return data;
}

/**
 * GET /api/payments/wallet/ — the logged-in user's wallet balance + ledger.
 * Requires login (401 if not authenticated).
 * Returns: { balance: "0.00", transactions: [...] }  (see WalletSerializer)
 */
export async function fetchWallet() {
  const { data } = await client.get("/payments/wallet/");
  return data;
}

/**
 * POST /api/payments/wallet/topup/ — starts a Paystack checkout to add
 * funds to the logged-in user's wallet balance, independent of any report
 * purchase. Requires login.
 * Returns: same shape as a PaystackTransaction (includes authorization_url,
 * exposed here as checkout_url for consistency with submitPin's 402 flow).
 */
export async function topUpWallet({ amount }) {
  const { data } = await client.post("/payments/wallet/topup/", {
    amount,
    callback_url: `${window.location.origin}/payment/callback`,
  });
  return { ...data, checkout_url: data.authorization_url };
}

/**
 * POST /api/property/otp/request/ — sends an SMS code to the given
 * phone number for a flagged device. Backend accepts any of the Kenyan
 * phone formats (0712345678, +254712345678, 254712345678) — no need to
 * normalize client-side.
 */
export async function requestOTP({ fingerprintHash, phoneNumber }) {
  const { data } = await client.post("/property/otp/request/", {
    fingerprint_hash: fingerprintHash,
    phone_number: phoneNumber,
  });
  return data;
}

/**
 * POST /api/property/otp/verify/ — verifies the code and resumes the
 * specific report that triggered the OTP requirement. Returns the
 * report on success (200), or a 402 body with checkout_url if free
 * reports ran out during verification (caller should handle both).
 */
export async function verifyOTP({ fingerprintHash, phoneNumber, code, reportId }) {
  const response = await client.post("/property/otp/verify/", {
    fingerprint_hash: fingerprintHash,
    phone_number: phoneNumber,
    code,
    report_id: reportId,
  });
  return response; // full response — caller needs .status for the 402 case
}
