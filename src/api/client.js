import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// No request should be allowed to hang indefinitely — this matters a lot
// during `vite build && node prerender.js`, where the API backend usually
// isn't running at all. Without a timeout, a dead/unreachable BASE_URL can
// leave a request pending forever, which stalls Puppeteer's `networkidle0`
// wait until it hits its own (much longer) navigation timeout.
const REQUEST_TIMEOUT_MS = 8000;

const ACCESS_KEY = "scape_access_token";
const REFRESH_KEY = "scape_refresh_token";

export const tokenStorage = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (access, refresh) => {
    localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

const client = axios.create({ baseURL: BASE_URL, timeout: REQUEST_TIMEOUT_MS });

client.interceptors.request.use((config) => {
  const access = tokenStorage.getAccess();
  if (access) config.headers.Authorization = `Bearer ${access}`;
  return config;
});

let refreshPromise = null;

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    // Don't try to refresh on the login/refresh calls themselves
    const isAuthEndpoint = original?.url?.includes("/users/login/") || original?.url?.includes("/users/token/refresh/");

    if (status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      const refresh = tokenStorage.getRefresh();
      if (!refresh) {
        tokenStorage.clear();
        return Promise.reject(error);
      }

      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post(`${BASE_URL}/users/token/refresh/`, { refresh }, { timeout: REQUEST_TIMEOUT_MS })
            .finally(() => { refreshPromise = null; });
        }
        const { data } = await refreshPromise;
        tokenStorage.set(data.access, refresh);
        original.headers.Authorization = `Bearer ${data.access}`;
        return client(original);
      } catch (refreshErr) {
        tokenStorage.clear();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default client;