# Music Training

Music Training is a React/Vite interval-training application served at `/music/training/` through the `avijitsinha.com` reverse proxy. Training options stay in browser-local storage.

**Deployment status:** production is returning to the application's standalone Firebase Google sign-in before the shared account service is retired. The app uses Firebase only for optional Music Training identity and never treats browser identity as a backend authorization boundary.

**Sign in with Google** uses the site's existing Firebase project and `music-training` OAuth client. Firebase owns its browser authentication state; Music Training does not send that identity to Routine Dashboard or any application database. Credential and token values are never logged.

Music Training requires only common identity. It does not request, receive, store or use Google Calendar or Tasks access. Those permissions remain optional and service-specific.

Only Google-hosted HTTPS profile pictures are rendered. Missing or untrusted profile pictures use a local fallback rather than sending identity data to another avatar service. The packaged application sets restrictive content, framing, referrer, MIME-sniffing and permissions headers.

Firebase's unused bundled Firestore dependency is pinned through an npm override to a patched compatible `@grpc/grpc-js` release. Music Training imports only Firebase Auth.

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

Repository-wide lint currently reports five pre-existing issues in the training option/quiz code; they are outside this authentication rollback.
