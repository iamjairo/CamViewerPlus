# CamViewerPlus Server App

Native Electron launcher for CamViewerPlus server on macOS and Linux.

## What it does

- Runs CamViewerPlus server (`app.js`)
- Downloads MediaMTX for the local platform on first run
- Starts MediaMTX and the server automatically
- Provides tray actions: open web UI, restart server, show/hide status, quit

## Development

```bash
npm install
npm run start
```

## Build

```bash
npm run release
```
