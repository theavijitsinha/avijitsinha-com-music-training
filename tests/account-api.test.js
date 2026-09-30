import assert from "node:assert/strict"
import test from "node:test"

import {
  accountSignInUrl,
  csrfFromCookie,
  fetchCurrentAccount,
  logoutCurrentAccount,
  parseCurrentAccount,
} from "../src/utils/account-api.js"

test("parses only the bounded browser profile", () => {
  assert.deepEqual(parseCurrentAccount({
    profile: {
      email: "person@example.test",
      displayName: "Example Person",
      pictureUrl: "https://lh3.googleusercontent.com/person.jpg",
    },
    siteUserId: "must-not-cross-browser-boundary",
  }), {
    email: "person@example.test",
    displayName: "Example Person",
    pictureUrl: "https://lh3.googleusercontent.com/person.jpg",
  })
  assert.deepEqual(parseCurrentAccount({
    profile: { email: null, displayName: null, pictureUrl: "javascript:alert(1)" },
  }), { email: null, displayName: null, pictureUrl: null })
})

test("loads the common account with a fixed Music return path", async () => {
  let request
  const account = await fetchCurrentAccount(async (url, options) => {
    request = { url, options }
    return new Response(JSON.stringify({
      profile: { email: null, displayName: "Musician", pictureUrl: null },
    }), { status: 200, headers: { "Content-Type": "application/json" } })
  })

  assert.deepEqual(account, { email: null, displayName: "Musician", pictureUrl: null })
  assert.equal(request.url, "/api/account/me?return=%2Fmusic%2Ftraining%2Fintervals")
  assert.equal(request.options.credentials, "same-origin")
  assert.equal(request.options.cache, "no-store")
  assert.equal(accountSignInUrl(), "/account/?return=%2Fmusic%2Ftraining%2Fintervals")
})

test("treats unauthorized as signed out and rejects malformed success", async () => {
  assert.equal(await fetchCurrentAccount(async () => new Response(null, { status: 401 })), null)
  await assert.rejects(
    fetchCurrentAccount(async () => new Response(JSON.stringify({ userId: "browser-controlled" }), { status: 200 })),
    /invalid/,
  )
})

test("reads the host CSRF cookie and forwards it only to common logout", async () => {
  assert.equal(csrfFromCookie("other=value; __Host-avijit_csrf=csrf-value; third=value"), "csrf-value")
  assert.equal(csrfFromCookie("other=value"), null)

  let request
  await logoutCurrentAccount("csrf-value", async (url, options) => {
    request = { url, options }
    return new Response(null, { status: 204 })
  })
  assert.equal(request.url, "/api/account/logout")
  assert.equal(request.options.method, "POST")
  assert.deepEqual(request.options.headers, { "X-CSRF-Token": "csrf-value" })
})
