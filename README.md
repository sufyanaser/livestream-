# NAS Broadcast Director

Offline-first broadcast production control for Windows and macOS. Built with Electron, React, strict TypeScript, Tailwind CSS, and a secure preload boundary.

## V1 scope

- Director workspace with Preview/Program state, sources, transitions, TAKE, and streaming/recording telemetry
- Offline layout presets with persistent OBS source mapping and exact canvas geometry
- Local graphics engine for lower thirds, logo bug, ticker, clock, countdown, and sponsor overlays
- Rundown, guests, macros, project profiles, autosave, backup, and portable `.nasbroadcast` import/export
- Optional role-based LAN operator surface, disabled by default
- OBS WebSocket 5.x adapter with reconnect backoff and in-memory credentials
- Structured local logging, crash recovery, single-instance protection, and packaged update checks

## Platform targets

- Windows 10/11 x64: NSIS installer
- macOS 12+ on Intel and Apple Silicon: DMG and ZIP

GitHub Actions validates linting, tests, production builds, and platform packaging on both Windows and macOS. Public production distribution still requires the appropriate Windows code-signing certificate and Apple Developer signing/notarization credentials.

## OBS compatibility

- Targets the OBS WebSocket 5.x protocol bundled with OBS Studio 28 and newer.
- Uses `ws://127.0.0.1:4455` by default.
- Authentication should remain enabled. The password is retained in process memory only and is never stored in project files or logs.
- The local graphics browser source binds to loopback only.

## Development

```bash
npm ci
npm run dev
```

## Validation

```bash
npm run lint
npm test
npm run build
```

## Packaging

```bash
npm run dist:win
npm run dist:mac
```

Run the platform-specific command on its native operating system. Release tags matching `v*` invoke the GitHub release workflow.
