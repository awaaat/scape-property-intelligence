import client, { tokenStorage } from "./client";

export async function signup({ fullName, email, phone, password, consentGiven }) {
  const { data } = await client.post("/users/signup/", {
    full_name: fullName,
    email,
    phone,
    password,
    consent_given: consentGiven,
  });
  return data;
}

export async function login({ email, password }) {
  const { data } = await client.post("/users/login/", { email, password });
  tokenStorage.set(data.access, data.refresh);
  return data.user;
}

export async function logout() {
  const refresh = tokenStorage.getRefresh();
  try {
    if (refresh) await client.post("/users/logout/", { refresh });
  } finally {
    tokenStorage.clear();
  }
}

export async function fetchMe() {
  const { data } = await client.get("/users/me/");
  return data;
}

export async function resendVerification(email) {
  await client.post("/users/verify-email/resend/", { email });
}

export async function confirmVerification({ id, token }) {
  const { data } = await client.post("/users/verify-email/confirm/", { id, token });
  return data;
}

export async function requestPasswordReset(email) {
  await client.post("/users/password-reset/request/", { email });
}

export async function confirmPasswordReset({ uid, token, newPassword }) {
  const { data } = await client.post("/users/password-reset/confirm/", {
    uid,
    token,
    new_password: newPassword,
  });
  return data;
}

export function isLoggedIn() {
  return Boolean(tokenStorage.getAccess());
}