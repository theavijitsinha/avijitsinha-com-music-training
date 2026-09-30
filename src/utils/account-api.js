export const MUSIC_TRAINING_RETURN_PATH = "/music/training/intervals"

function record(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value
    : null
}

function nullableString(value, maximum) {
  if (value === null) return null
  return typeof value === "string" && value.length > 0 && value.length <= maximum
    ? value
    : undefined
}

function safePictureUrl(value) {
  const candidate = nullableString(value, 2048)
  if (candidate === null) return null
  if (candidate === undefined) return undefined
  try {
    const url = new URL(candidate)
    return url.protocol === "https:" && url.hostname === "lh3.googleusercontent.com"
      ? url.href
      : null
  } catch {
    return null
  }
}

export function parseCurrentAccount(value) {
  const body = record(value)
  const profile = record(body?.profile)
  const email = nullableString(profile?.email, 320)
  const displayName = nullableString(profile?.displayName, 200)
  const pictureUrl = safePictureUrl(profile?.pictureUrl)
  if (profile === null || email === undefined || displayName === undefined || pictureUrl === undefined) {
    return null
  }
  return { email, displayName, pictureUrl }
}

export function accountSignInUrl() {
  return `/account/?return=${encodeURIComponent(MUSIC_TRAINING_RETURN_PATH)}`
}

export function csrfFromCookie(cookie) {
  for (const pair of cookie.split(";")) {
    const [name, ...parts] = pair.trim().split("=")
    if (name === "__Host-avijit_csrf") {
      const value = parts.join("=")
      return value.length > 0 && value.length <= 256 ? value : null
    }
  }
  return null
}

async function responseJson(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

export async function fetchCurrentAccount(fetchImplementation = fetch, signal) {
  const response = await fetchImplementation(
    `/api/account/me?return=${encodeURIComponent(MUSIC_TRAINING_RETURN_PATH)}`,
    {
      cache: "no-store",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
      signal,
    },
  )
  if (response.status === 401) return null
  if (!response.ok) throw new Error("Account status is unavailable")
  const account = parseCurrentAccount(await responseJson(response))
  if (account === null) throw new Error("Account response is invalid")
  return account
}

export async function logoutCurrentAccount(csrfToken, fetchImplementation = fetch) {
  const response = await fetchImplementation("/api/account/logout", {
    method: "POST",
    credentials: "same-origin",
    headers: { "X-CSRF-Token": csrfToken },
  })
  if (!response.ok) throw new Error("Sign-out failed")
}
