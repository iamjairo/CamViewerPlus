const { Tray, Menu, nativeImage } = require("electron");

function createTray({ iconPath, onOpenUi, onRestartServer, onToggleStatus, onQuit }) {
  const icon = nativeImage.createFromPath(iconPath);
  const tray = new Tray(icon);

  const menu = Menu.buildFromTemplate([
    { label: "Open Web UI", click: onOpenUi },
    { label: "Restart Server", click: onRestartServer },
    { label: "Show/Hide Status", click: onToggleStatus },
    { type: "separator" },
    { label: "Quit", click: onQuit }
  ]);

  tray.setContextMenu(menu);
  tray.setToolTip("CamViewerPlus Server");
  tray.on("click", onOpenUi);
  return tray;
}

module.exports = { createTray };
