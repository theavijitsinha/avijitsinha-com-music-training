# Music Training

Music Training is a React/Vite interval-training application served at `/music/training/` through the `avijitsinha.com` reverse proxy. Training options stay in browser-local storage.

The application reads sign-in state from the common `avijitsinha.com` account API. **Sign in with Google** opens `/account/`, and sign-out revokes the current shared browser session. Music Training does not persist Firebase identity state or handle Google credentials. The common session remains in secure host-only cookies owned by the account service.

Music Training requires only common identity. It does not request, receive, store or use Google Calendar or Tasks access. Those permissions remain optional and service-specific.

The account client accepts only a bounded display name, email and Google-hosted HTTPS picture URL from `/api/account/me`; it never receives a site user ID or Google provider identifier. Missing or untrusted profile pictures render locally rather than sending identity data to an avatar service. The packaged application sets restrictive content, framing, referrer, MIME-sniffing and permissions headers.

## Local development

```sh
npm ci
npm run dev
```

Verify changes with:

```sh
npm run lint
npm test
npm run build
```

The account-integration files pass lint. Repository-wide lint currently also reports five pre-existing issues in the training option/quiz code; they are outside this authentication slice.
