# CamViewerPlus

### A customizable browser-based IP camera viewer with HLS, WebRTC and legacy JSMpeg streaming.

CamViewerPlus is a self-hosted web UI for viewing RTSP camera streams.  It
supports three streaming back-ends:

| Mode | Latency | Requires | Notes |
|------|---------|----------|-------|
| **HLS** (default) | 2–5 s | MediaMTX | Recommended. Works in all modern browsers. |
| **WebRTC** | < 1 s | MediaMTX | Lowest latency. Uses WHEP. |
| **JSMpeg** | 3–8 s | built-in | Legacy mode, no extra services needed. |

---

## Getting Started

### Option A – Docker Compose (recommended)

This is the easiest way to run CamViewerPlus together with
[MediaMTX](https://github.com/bluenviron/mediamtx) for HLS/WebRTC streaming.

1. **Clone** the repository:
   ```bash
   git clone https://github.com/iamjairo/CamViewerPlus
   cd CamViewerPlus
   ```
2. **Edit** `mediamtx.yml` – replace the example camera URLs under `paths:`
   with your real RTSP stream URLs.
3. **Start** the stack:
   ```bash
   docker compose up -d
   ```
4. Open `http://server-ip:6980` in your browser.
5. The config file is stored in the `camviewerplus-config` Docker volume.
   You can also edit `conf/config.json` directly:
   ```bash
   sudo nano /var/lib/docker/volumes/camviewerplus_camviewerplus-config/_data/config.json
   ```

### Option B – Docker (standalone, JSMpeg mode only)

```yaml
version: '3'
services:
  camviewerplus:
    container_name: camviewerplus
    image: 'fanman03/camviewerplus:2.0.0'
    restart: unless-stopped
    ports:
      - '6900:6900'
      - '6980:6980'
      - '3000:3000'
    volumes:
      - config:/usr/src/camviewerplus/conf
volumes:
  config:
```

### Option C – Node.js (bare metal)

1. Ensure **Node.js 20+**, **npm** and **ffmpeg** are installed.
2. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/iamjairo/CamViewerPlus
   cd CamViewerPlus
   npm install
   ```
3. Start the server:
   ```bash
   npm run start-prod
   ```
4. Open `http://localhost:6980`.
5. For HLS/WebRTC mode, run MediaMTX separately and point it at your cameras
   (see `mediamtx.yml` for a configuration template).

---

## Configuration (`conf/config.json`)

Key settings:

| Field | Default | Description |
|-------|---------|-------------|
| `streamMode` | `hls` | Streaming back-end: `hls`, `webrtc` or `jsmpeg` |
| `mediamtxApiUrl` | `http://localhost:9997` | MediaMTX management API (server-side) |
| `mediamtxHlsPort` | `8888` | MediaMTX HLS port (browser-accessible) |
| `mediamtxWebRTCPort` | `8889` | MediaMTX WebRTC port (browser-accessible) |
| `cameras[].source` | – | RTSP URL of the camera |
| `cameras[].position` | – | Zero-based slot index (maps to MediaMTX path `cam{N}`) |
| `uiPort` | `6980` | Web UI port |
| `streamPort` | `6900` | JSMpeg WebSocket port (only used in `jsmpeg` mode) |
| `gridType` | `4` | Default grid layout |
| `transportProtocol` | `tcp` | JSMpeg mode only: RTSP transport (`tcp`/`udp`) |
| `quality` | `3` | JSMpeg mode only: ffmpeg `-q` value (1 = best) |

After changing config, use **Settings → Restart Server** or restart the
container.

---

## MediaMTX integration

CamViewerPlus automatically registers camera paths with MediaMTX on startup
via its HTTP API.  If MediaMTX is not reachable, a warning is logged and only
JSMpeg mode will work.

You can also configure paths statically in `mediamtx.yml` – see the comments
in that file for details.

---

## Client app

For the best experience (especially WebRTC mode), use the dedicated desktop
client: [CamViewerPlus Client](https://github.com/iamjairo/CamViewerPlus-Client/)

---

## Feature Tracker

- [x] Customizable grid views
- [x] HLS streaming via MediaMTX (low latency)
- [x] WebRTC streaming via MediaMTX (ultra-low latency, WHEP)
- [x] Legacy JSMpeg / WebSocket streaming (built-in, no MediaMTX required)
- [x] Pan / Zoom (digital)
- [x] Kiosk mode
- [x] Docker Compose setup with MediaMTX
- [ ] Multiple streams per camera
