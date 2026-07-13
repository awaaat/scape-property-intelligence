import FingerprintJS from "@fingerprintjs/fingerprintjs";

const STORAGE_KEY = "scape_device_fingerprint";

let fpPromise = null;

/**
 * Returns a stable device fingerprint hash. Computed once via
 * FingerprintJS's visitorId (a real fingerprint based on canvas, fonts,
 * hardware signals, etc — not just a random localStorage value that
 * resets whenever storage is cleared), then cached in localStorage so
 * repeat visits don't re-run the (slightly expensive) computation.
 *
 * NOTE: clearing localStorage/incognito WILL still change the cached
 * value, but FingerprintJS's underlying signals mean the recomputed
 * visitorId is often the SAME hash for the same physical device even
 * after storage is cleared — that's the whole point of using it over a
 * self-generated random token.
 */
export async function getDeviceFingerprint() {
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) return cached;

  if (!fpPromise) {
    fpPromise = FingerprintJS.load();
  }

  try {
    const fp = await fpPromise;
    const result = await fp.get();
    localStorage.setItem(STORAGE_KEY, result.visitorId);
    return result.visitorId;
  } catch (err) {
    console.error("Fingerprint generation failed:", err);
    // Last-resort fallback so the request isn't blocked entirely — but
    // this is intentionally NOT persisted, so it doesn't silently become
    // a shared "fallback-hash" across every failed-fingerprint visitor.
    // The backend's fraud scoring (fraud.py) should treat a fingerprint
    // this short/unfamiliar-looking as lower trust, not equal trust.
    return `fp-fallback-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}
