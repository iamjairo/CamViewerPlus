const { app, BrowserWindow, shell, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const https = require("https");
const { spawn } = require("child_process");
const { createTray } = require("./tray");

const MEDIAMTX_VERSION = process.env.MEDIAMTX_VERSION || "v1.18.1";
const ROOT_DIR = path.resolve(__dirname, "..");
const MEDIAMTX_DIR = path.join(app.getPath("userData"), "mediamtx");
const MEDIAMTX_BIN = path.join(MEDIAMTX_DIR, "mediamtx");

let tray = null;
let statusWindow = null;
let serverProcess = null;
let mediamtxProcess = null;
let state = { server: "stopped", mediamtx: "stopped", message: "Idle" };

function setState(next) {
  state = { ...state, ...next };
  if (statusWindow && !statusWindow.isDestroyed()) {
    const payload = JSON.stringify(state).replace(/</g, "\\u003c");
    statusWindow.webContents.executeJavaScript(`window.setStatus(${payload})`).catch(() => {});
  }
  if (tray) {
    tray.setToolTip(`CamViewerPlus Server (${state.server}/${state.mediamtx})`);
  }
}

function getAssetName() {
  const arch = process.arch;
  const platform = process.platform;
  if (platform === "darwin" && arch === "arm64") return `mediamtx_${MEDIAMTX_VERSION}_darwin_arm64.tar.gz`;
  if (platform === "darwin" && arch === "x64") return `mediamtx_${MEDIAMTX_VERSION}_darwin_amd64.tar.gz`;
  if (platform === "linux" && arch === "arm64") return `mediamtx_${MEDIAMTX_VERSION}_linux_arm64.tar.gz`;
  if (platform === "linux" && arch === "x64") return `mediamtx_${MEDIAMTX_VERSION}_linux_amd64.tar.gz`;
  throw new Error(`Unsupported platform/arch: ${platform}/${arch}`);
}

function downloadFile(url, outPath) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(downloadFile(res.headers.location, outPath));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Download failed (${res.statusCode})`));
      }
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      const file = fs.createWriteStream(outPath);
      res.pipe(file);
      file.on("finish", () => file.close(() => resolve()));
      file.on("error", reject);
    });
    request.on("error", reject);
  });
}

function extractTarGz(archivePath, outDir) {
  return new Promise((resolve, reject) => {
    const tar = spawn("tar", ["-xzf", archivePath, "-C", outDir]);
    tar.on("exit", (code) => {
      if (code === 0) return resolve();
      reject(new Error(`tar exited with ${code}`));
    });
    tar.on("error", reject);
  });
}

async function ensureMediaMTX() {
  if (fs.existsSync(MEDIAMTX_BIN)) return;
  setState({ message: "Downloading MediaMTX..." });
  fs.mkdirSync(MEDIAMTX_DIR, { recursive: true });
  const assetName = getAssetName();
  const url = `https://github.com/bluenviron/mediamtx/releases/download/${MEDIAMTX_VERSION}/${assetName}`;
  const archivePath = path.join(MEDIAMTX_DIR, assetName);
  await downloadFile(url, archivePath);
  await extractTarGz(archivePath, MEDIAMTX_DIR);
  fs.chmodSync(MEDIAMTX_BIN, 0o755);
}

function startMediaMTX() {
  if (mediamtxProcess) return;
  const configPath = path.join(ROOT_DIR, "mediamtx.yml");
  mediamtxProcess = spawn(MEDIAMTX_BIN, ["--config", configPath], {
    cwd: ROOT_DIR,
    stdio: "ignore"
  });
  mediamtxProcess.on("exit", () => {
    mediamtxProcess = null;
    setState({ mediamtx: "stopped" });
  });
  setState({ mediamtx: "running" });
}

function startServer() {
  if (serverProcess) return;
  serverProcess = spawn(process.execPath, ["app.js"], {
    cwd: ROOT_DIR,
    stdio: "ignore",
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: "1"
    }
  });
  serverProcess.on("exit", () => {
    serverProcess = null;
    setState({ server: "stopped" });
  });
  setState({ server: "running", message: "Server started" });
}

function stopAll() {
  if (serverProcess) {
    serverProcess.kill("SIGTERM");
    serverProcess = null;
  }
  if (mediamtxProcess) {
    mediamtxProcess.kill("SIGTERM");
    mediamtxProcess = null;
  }
  setState({ server: "stopped", mediamtx: "stopped", message: "Stopped" });
}

function restartServer() {
  if (serverProcess) serverProcess.kill("SIGTERM");
  serverProcess = null;
  startServer();
}

function readUiPort() {
  const configPath = path.join(ROOT_DIR, "conf", "config.json");
  try {
    const json = JSON.parse(fs.readFileSync(configPath, "utf8"));
    const uiPortValue = json?.settings?.uiPort;
    if (uiPortValue === undefined || uiPortValue === null || uiPortValue === "") {
      return 6980;
    }
    const parsed = Number.parseInt(uiPortValue, 10);
    if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 65535) {
      return 6980;
    }
    return parsed;
  } catch {
    return 6980;
  }
}

function openUi() {
  shell.openExternal(`http://localhost:${readUiPort()}`);
}

function createStatusWindow() {
  statusWindow = new BrowserWindow({
    width: 350,
    height: 200,
    resizable: false,
    show: false,
    title: "CamViewerPlus Server Status",
    webPreferences: {
      contextIsolation: true
    }
  });
  statusWindow.loadFile(path.join(__dirname, "status.html"));
}

async function bootstrap() {
  try {
    createStatusWindow();
    tray = createTray({
      iconPath: path.join(__dirname, "resources", "icon.png"),
      onOpenUi: openUi,
      onRestartServer: restartServer,
      onToggleStatus: () => {
        if (!statusWindow) return;
        if (statusWindow.isVisible()) statusWindow.hide();
        else statusWindow.show();
      },
      onQuit: () => app.quit()
    });
    await ensureMediaMTX();
    startMediaMTX();
    startServer();
  } catch (error) {
    setState({ message: "Startup failed" });
    dialog.showErrorBox("CamViewerPlus Server App", error.message);
  }
}

app.whenReady().then(bootstrap);
app.on("window-all-closed", (event) => event.preventDefault());
app.on("before-quit", stopAll);
