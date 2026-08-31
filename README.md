# NAS Broadcast Director

Desktop broadcast control surface built with Electron, React, TypeScript, Tailwind CSS, and shadcn/ui-compatible primitives.

## Stage 01

- Preview and Program monitors
- Sources and layout preset surfaces
- Lower Thirds, Transitions, and Rundown shells
- OBS connection placeholder
- Secure Electron main/preload boundary prepared for future OBS WebSocket integration

## OBS compatibility

- Targets the OBS WebSocket 5.x protocol bundled with OBS Studio 28 and newer.
- Uses the official default endpoint `ws://127.0.0.1:4455`.
- OBS authentication should remain enabled. The password is kept in process memory only and is never persisted by the application.
- Protocol reference: [obsproject/obs-websocket](https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md)

## Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npm run build
```
