# Music Training

Music Training is a React/Vite interval-training application served at `/music/training/` through the `avijitsinha.com` reverse proxy. Training options stay in browser-local storage.

The current Google sign-in UI uses the site's Firebase project and is not a backend authorization boundary. Credential and identity values are not logged. The approved next architecture replaces this app-specific Firebase state with the common `avijitsinha.com` account API.

Music Training requires only common identity. It does not request, receive, store or use Google Calendar or Tasks access. Those permissions remain optional and service-specific.

## Local development

```sh
npm ci
npm run dev
```

Verify changes with:

```sh
npm run lint
npm run build
```
