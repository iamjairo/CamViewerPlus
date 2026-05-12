/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/helpers/config.js"
/*!*******************************!*\
  !*** ./src/helpers/config.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_CONFIG: () => (/* binding */ DEFAULT_CONFIG)
/* harmony export */ });
// Default application configuration.
// This single source of truth is used by both the main process (getConfig)
// and the settings menu prompt functions.
const DEFAULT_CONFIG = {
  url: "http://example.com",
  autorefresh: "-1",
  grid: "-1",
  mediamtxUrl: ""
};

/***/ },

/***/ "./src/helpers/window.js"
/*!*******************************!*\
  !*** ./src/helpers/window.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fs_jetpack__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs-jetpack */ "fs-jetpack");
/* harmony import */ var fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs_jetpack__WEBPACK_IMPORTED_MODULE_1__);
// This helper remembers the size and position of your windows, and restores
// them in that place after app relaunch.
// Can be used for more than one window, just construct many
// instances of it and give each different name.



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((name, options) => {
  const userDataDir = fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default().cwd(electron__WEBPACK_IMPORTED_MODULE_0__.app.getPath("userData"));
  const stateStoreFile = `window-state-${name}.json`;
  const defaultSize = {
    width: options.width,
    height: options.height
  };
  let state = {};
  let win;
  const restore = () => {
    let restoredState = {};
    try {
      restoredState = userDataDir.read(stateStoreFile, "json");
    } catch (err) {
      // For some reason json can't be read (might be corrupted).
      // No worries, we have defaults.
    }
    return Object.assign({}, defaultSize, restoredState);
  };
  const getCurrentPosition = () => {
    const position = win.getPosition();
    const size = win.getSize();
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1]
    };
  };
  const windowWithinBounds = (windowState, bounds) => {
    return windowState.x >= bounds.x && windowState.y >= bounds.y && windowState.x + windowState.width <= bounds.x + bounds.width && windowState.y + windowState.height <= bounds.y + bounds.height;
  };
  const resetToDefaults = () => {
    const bounds = electron__WEBPACK_IMPORTED_MODULE_0__.screen.getPrimaryDisplay().bounds;
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2
    });
  };
  const ensureVisibleOnSomeDisplay = windowState => {
    const visible = electron__WEBPACK_IMPORTED_MODULE_0__.screen.getAllDisplays().some(display => {
      return windowWithinBounds(windowState, display.bounds);
    });
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults();
    }
    return windowState;
  };
  const saveState = () => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition());
    }
    userDataDir.write(stateStoreFile, state, {
      atomic: true
    });
  };
  state = ensureVisibleOnSomeDisplay(restore());
  win = new electron__WEBPACK_IMPORTED_MODULE_0__.BrowserWindow(Object.assign({}, options, state));
  win.on("close", saveState);
  return win;
});
(Object.getOwnPropertyDescriptor(__WEBPACK_DEFAULT_EXPORT__, "name") || {}).writable || Object.defineProperty(__WEBPACK_DEFAULT_EXPORT__, "name", { value: "default", configurable: true });

/***/ },

/***/ "./src/menu/app_menu_template.js"
/*!***************************************!*\
  !*** ./src/menu/app_menu_template.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);


const openAboutWindow = (__webpack_require__(/*! about-window */ "about-window")["default"]);
const aboutCss = __dirname + "/about.css";
const aboutIcon = __dirname + "/about.png";
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  label: "App",
  submenu: [{
    label: "Quit",
    accelerator: "CmdOrCtrl+Q",
    click: () => {
      electron__WEBPACK_IMPORTED_MODULE_0__.app.quit();
    }
  }, {
    label: "Reload",
    accelerator: "CmdOrCtrl+R",
    click: () => {
      electron__WEBPACK_IMPORTED_MODULE_0__.BrowserWindow.getFocusedWindow().webContents.reloadIgnoringCache();
    }
  }, {
    label: "About",
    accelerator: "CmdOrCtrl+A",
    click: () => openAboutWindow({
      icon_path: aboutIcon,
      homepage: "https://github.com/Fanman03/CamViewerPlus-Client",
      css_path: aboutCss
    })
  }]
});

/***/ },

/***/ "./src/menu/dev_menu_template.js"
/*!***************************************!*\
  !*** ./src/menu/dev_menu_template.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);


const fs = __webpack_require__(/*! fs */ "fs");
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  label: "Development",
  submenu: [{
    label: "Toggle DevTools",
    accelerator: "Shift+CmdOrCtrl+I",
    click: () => {
      electron__WEBPACK_IMPORTED_MODULE_0__.BrowserWindow.getFocusedWindow().toggleDevTools();
    }
  }, {
    label: "Nuke Config",
    accelerator: "Shift+CmdOrCtrl+D",
    click: () => {
      let path = electron__WEBPACK_IMPORTED_MODULE_0__.app.getPath("userData") + "/config.json";
      fs.unlink(path, () => {});
      electron__WEBPACK_IMPORTED_MODULE_0__.app.relaunch();
      electron__WEBPACK_IMPORTED_MODULE_0__.app.exit();
    }
  }]
});

/***/ },

/***/ "./src/menu/settings_menu_template.js"
/*!********************************************!*\
  !*** ./src/menu/settings_menu_template.js ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _helpers_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/config */ "./src/helpers/config.js");




const prompt = __webpack_require__(/*! electron-prompt */ "electron-prompt");
const fs = __webpack_require__(/*! fs */ "fs");
const fetch = __webpack_require__(/*! node-fetch */ "node-fetch");
const promptCss = __dirname + "/prompt.css";
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  label: "Configuration",
  submenu: [{
    label: "Set Instance URL",
    accelerator: "CmdOrCtrl+I",
    click: () => {
      openInstancePrompt();
    }
  }, {
    label: "Set MediaMTX Server URL",
    accelerator: "CmdOrCtrl+M",
    click: () => {
      openMediaMTXPrompt();
    }
  }, {
    label: "Set Auto-Refresh Delay",
    accelerator: "CmdOrCtrl+D",
    click: () => {
      openAutoRefreshPrompt();
    }
  }, {
    label: "Set Default Grid Override",
    accelerator: "CmdOrCtrl+G",
    click: () => {
      openGridPrompt();
    }
  }, {
    label: "Open Settings",
    accelerator: "CmdOrCtrl+S",
    click: () => {
      openSettings();
    }
  }]
});
const DEFAULT_CONFIG_STR = JSON.stringify(_helpers_config__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_CONFIG);
function readConfig() {
  const configPath = electron__WEBPACK_IMPORTED_MODULE_0__.app.getPath("userData") + "/config.json";
  let rawdata = DEFAULT_CONFIG_STR;
  try {
    rawdata = fs.readFileSync(configPath);
  } catch {
    // Config doesn't exist yet; defaults will be used.
  }
  return {
    path: configPath,
    data: Object.assign({}, _helpers_config__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_CONFIG, JSON.parse(rawdata))
  };
}
function saveConfigAndRelaunch(configPath, data) {
  fs.writeFileSync(configPath, JSON.stringify(data));
  electron__WEBPACK_IMPORTED_MODULE_0__.app.relaunch();
  electron__WEBPACK_IMPORTED_MODULE_0__.app.exit();
}
function openInstancePrompt() {
  const {
    path: configPath,
    data
  } = readConfig();
  prompt({
    title: 'Set Instance URL',
    label: 'Instance URL:',
    value: data.url,
    customStylesheet: promptCss,
    height: 175,
    inputAttrs: {
      type: 'url'
    },
    type: 'input'
  }).then(r => {
    if (r === null) {
      console.log('user cancelled');
    } else {
      data.url = r;
      saveConfigAndRelaunch(configPath, data);
    }
  }).catch(console.error);
}
function openMediaMTXPrompt() {
  const {
    path: configPath,
    data
  } = readConfig();
  prompt({
    title: 'Set MediaMTX Server URL',
    label: 'MediaMTX Server URL (e.g. http://192.168.1.10:8889):',
    value: data.mediamtxUrl || '',
    customStylesheet: promptCss,
    height: 175,
    inputAttrs: {
      type: 'url',
      placeholder: 'http://192.168.1.10:8889'
    },
    type: 'input'
  }).then(r => {
    if (r === null) {
      console.log('user cancelled');
    } else {
      data.mediamtxUrl = r;
      saveConfigAndRelaunch(configPath, data);
    }
  }).catch(console.error);
}
function openAutoRefreshPrompt() {
  const {
    path: configPath,
    data
  } = readConfig();
  prompt({
    title: 'Set Auto-Refresh Delay',
    label: 'Auto-Refresh Delay:',
    customStylesheet: promptCss,
    height: 175,
    value: data.autorefresh,
    type: 'select',
    selectOptions: {
      "-1": "Disabled",
      "* * * * *": "1 minute",
      "*/15 * * * *": "15 minutes",
      "0 * * * *": "1 hour",
      "0 */4 * * *": "4 hours",
      "0 */8 * * *": "8 hours"
    }
  }).then(r => {
    if (r === null) {
      console.log('user cancelled');
    } else {
      data.autorefresh = r;
      saveConfigAndRelaunch(configPath, data);
    }
  }).catch(console.error);
}
function openGridPrompt() {
  const {
    path: configPath,
    data
  } = readConfig();
  const gridUrl = data.url + "/getGrids";
  fetch(gridUrl).then(res => {
    if (!res.ok) {
      throw new Error("Invalid response status");
    }
    return res.json();
  }).then(body => {
    if (body == undefined || body.length === 0) {
      throw new Error("No grids returned");
    }
    const selectOptions = {
      "-1": "Server default"
    };
    body.forEach(e => {
      selectOptions[e] = e;
    });
    prompt({
      title: 'Set Default Grid Override',
      label: 'Grid for this client:',
      customStylesheet: promptCss,
      height: 175,
      value: data.grid,
      type: 'select',
      selectOptions
    }).then(r => {
      if (r === null) {
        console.log('user cancelled');
      } else {
        data.grid = r;
        saveConfigAndRelaunch(configPath, data);
      }
    }).catch(() => {
      new electron__WEBPACK_IMPORTED_MODULE_0__.Notification({
        title: "Error!",
        body: "Unable to fetch available grids."
      }).show();
    });
  }).catch(() => {
    new electron__WEBPACK_IMPORTED_MODULE_0__.Notification({
      title: "Error!",
      body: "Unable to fetch available grids."
    }).show();
  });
}
function openSettings() {
  electron__WEBPACK_IMPORTED_MODULE_0__.BrowserWindow.getFocusedWindow().webContents.executeJavaScript('$("#settings").show();0');
}

/***/ },

/***/ "about-window"
/*!*******************************!*\
  !*** external "about-window" ***!
  \*******************************/
(module) {

module.exports = require("about-window");

/***/ },

/***/ "electron"
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
(module) {

module.exports = require("electron");

/***/ },

/***/ "electron-prompt"
/*!**********************************!*\
  !*** external "electron-prompt" ***!
  \**********************************/
(module) {

module.exports = require("electron-prompt");

/***/ },

/***/ "fs-jetpack"
/*!*****************************!*\
  !*** external "fs-jetpack" ***!
  \*****************************/
(module) {

module.exports = require("fs-jetpack");

/***/ },

/***/ "node-cron"
/*!****************************!*\
  !*** external "node-cron" ***!
  \****************************/
(module) {

module.exports = require("node-cron");

/***/ },

/***/ "node-fetch"
/*!*****************************!*\
  !*** external "node-fetch" ***!
  \*****************************/
(module) {

module.exports = require("node-fetch");

/***/ },

/***/ "fs"
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
(module) {

module.exports = require("fs");

/***/ },

/***/ "path"
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
(module) {

module.exports = require("path");

/***/ },

/***/ "url"
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
(module) {

module.exports = require("url");

/***/ },

/***/ "./config/env_test.json"
/*!******************************!*\
  !*** ./config/env_test.json ***!
  \******************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"name":"test","description":"Add here any environment specific stuff you like."}');

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! url */ "url");
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _menu_app_menu_template__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./menu/app_menu_template */ "./src/menu/app_menu_template.js");
/* harmony import */ var _menu_settings_menu_template__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./menu/settings_menu_template */ "./src/menu/settings_menu_template.js");
/* harmony import */ var _menu_dev_menu_template__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./menu/dev_menu_template */ "./src/menu/dev_menu_template.js");
/* harmony import */ var _helpers_window__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./helpers/window */ "./src/helpers/window.js");
/* harmony import */ var _helpers_config__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./helpers/config */ "./src/helpers/config.js");
/* harmony import */ var env__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! env */ "./config/env_test.json");








const fs = __webpack_require__(/*! fs */ "fs");
const cron = __webpack_require__(/*! node-cron */ "node-cron");

// Special module holding environment variables which you declared
// in config/env_xxx.json file.


// Performance and memory flags
electron__WEBPACK_IMPORTED_MODULE_2__.app.commandLine.appendSwitch('js-flags', '--max-old-space-size=4096');
electron__WEBPACK_IMPORTED_MODULE_2__.app.commandLine.appendSwitch('max-active-webgl-contexts=16');

// WebRTC and streaming optimisations
electron__WEBPACK_IMPORTED_MODULE_2__.app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
electron__WEBPACK_IMPORTED_MODULE_2__.app.commandLine.appendSwitch('enable-accelerated-video-decode');
electron__WEBPACK_IMPORTED_MODULE_2__.app.commandLine.appendSwitch('enable-accelerated-mjpeg-decode');
electron__WEBPACK_IMPORTED_MODULE_2__.app.commandLine.appendSwitch('disable-frame-rate-limit');
electron__WEBPACK_IMPORTED_MODULE_2__.app.commandLine.appendSwitch('enable-features', 'WebRTCPipeWireCapturer,WebRTC-H264WithOpenH264FFmpeg,PlatformHEVCDecoderSupport,WebCodecs,MediaCapabilitiesQueryGpuFactories');
electron__WEBPACK_IMPORTED_MODULE_2__.app.commandLine.appendSwitch('enable-hardware-overlays', 'single-fullscreen,single-on-top,underlay');
electron__WEBPACK_IMPORTED_MODULE_2__.app.commandLine.appendSwitch('enable-gpu-rasterization');

// IP cameras commonly use self-signed TLS certificates.  Allow those in
// non-production environments; in production the flag is intentionally
// omitted so the OS certificate store is respected.
if (env__WEBPACK_IMPORTED_MODULE_8__.name !== "production") {
  electron__WEBPACK_IMPORTED_MODULE_2__.app.commandLine.appendSwitch('ignore-certificate-errors');
}

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env__WEBPACK_IMPORTED_MODULE_8__.name !== "production") {
  const userDataPath = electron__WEBPACK_IMPORTED_MODULE_2__.app.getPath("userData");
  electron__WEBPACK_IMPORTED_MODULE_2__.app.setPath("userData", `${userDataPath} (${env__WEBPACK_IMPORTED_MODULE_8__.name})`);
}
if (process.platform === 'win32') {
  electron__WEBPACK_IMPORTED_MODULE_2__.app.setAppUserModelId(electron__WEBPACK_IMPORTED_MODULE_2__.app.name);
}
const setApplicationMenu = () => {
  const menus = [_menu_app_menu_template__WEBPACK_IMPORTED_MODULE_3__["default"], _menu_settings_menu_template__WEBPACK_IMPORTED_MODULE_4__["default"]];
  if (env__WEBPACK_IMPORTED_MODULE_8__.name !== "production") {
    menus.push(_menu_dev_menu_template__WEBPACK_IMPORTED_MODULE_5__["default"]);
  }
  electron__WEBPACK_IMPORTED_MODULE_2__.Menu.setApplicationMenu(electron__WEBPACK_IMPORTED_MODULE_2__.Menu.buildFromTemplate(menus));
};

// We can communicate with our window (the renderer process) via messages.
const initIpc = () => {
  electron__WEBPACK_IMPORTED_MODULE_2__.ipcMain.on("need-app-path", (event, arg) => {
    event.reply("app-path", electron__WEBPACK_IMPORTED_MODULE_2__.app.getAppPath());
  });
  electron__WEBPACK_IMPORTED_MODULE_2__.ipcMain.on("open-external-link", (event, href) => {
    electron__WEBPACK_IMPORTED_MODULE_2__.shell.openExternal(href);
  });
};
function getConfig() {
  const configPath = electron__WEBPACK_IMPORTED_MODULE_2__.app.getPath("userData") + "/config.json";
  let data = Object.assign({}, _helpers_config__WEBPACK_IMPORTED_MODULE_7__.DEFAULT_CONFIG);
  try {
    data = Object.assign(data, JSON.parse(fs.readFileSync(configPath)));
  } catch {
    // Config doesn't exist yet; defaults will be used.
  }
  let appurl = {};
  if (!data.url || data.url === _helpers_config__WEBPACK_IMPORTED_MODULE_7__.DEFAULT_CONFIG.url) {
    appurl.name = __dirname + "/no-url.html";
    appurl.protocol = "file:";
  } else {
    try {
      const parsed = new URL(data.url);
      appurl.name = parsed.host + parsed.pathname.replace(/\/$/, "");
      appurl.protocol = parsed.protocol;
    } catch {
      // Fallback for malformed URLs
      appurl.name = data.url.replace(/^https?:\/\//, "");
      appurl.protocol = "http:";
    }
  }
  return {
    url: appurl,
    autorefresh: data.autorefresh,
    grid: data.grid,
    mediamtxUrl: data.mediamtxUrl || ""
  };
}
electron__WEBPACK_IMPORTED_MODULE_2__.app.on("ready", () => {
  setApplicationMenu();
  initIpc();
  let config = getConfig();
  const mainWindow = (0,_helpers_window__WEBPACK_IMPORTED_MODULE_6__["default"])("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      allowRunningInsecureContent: true,
      // webSecurity is disabled so that the CamViewerPlus web UI (loaded from
      // a configured server origin) can make cross-origin requests to MediaMTX
      // WHEP endpoints.  This is intentional for a dedicated camera-viewer
      // desktop client that only ever loads known, user-configured servers.
      webSecurity: false
    }
  });

  // Permissions required for WebRTC (WHEP/camera streams) and notifications.
  // Only the specific capabilities needed by live-streaming are granted.
  const ALLOWED_PERMISSIONS = ['media', 'display-capture', 'fullscreen', 'notifications', 'pointerLock', 'mediaKeySystem'];
  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    callback(ALLOWED_PERMISSIONS.includes(permission));
  });
  mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission) => ALLOWED_PERMISSIONS.includes(permission));
  if (config.autorefresh && config.autorefresh !== "-1") {
    cron.schedule(config.autorefresh, () => {
      console.log("reloading...");
      mainWindow.webContents.reloadIgnoringCache();
    });
  }
  const buildLoadURL = pathname => url__WEBPACK_IMPORTED_MODULE_1___default().format({
    pathname,
    protocol: config.url.protocol,
    slashes: true,
    query: {
      cl: "cvpc"
    }
  });
  if (config.grid && config.grid !== "-1") {
    mainWindow.loadURL(buildLoadURL(config.url.name + "/grids/" + config.grid));
  } else {
    mainWindow.loadURL(buildLoadURL(config.url.name));
  }
  mainWindow.webContents.on("did-fail-load", () => {
    new electron__WEBPACK_IMPORTED_MODULE_2__.Notification({
      title: "Error!",
      body: "Unable to connect to CamViewerPlus Server. Please double-check your instance URL."
    }).show();
    mainWindow.loadURL(url__WEBPACK_IMPORTED_MODULE_1___default().format({
      pathname: __dirname + "/error.html",
      protocol: "file:",
      slashes: true
    }));
  });
});
electron__WEBPACK_IMPORTED_MODULE_2__.app.on("window-all-closed", () => {
  electron__WEBPACK_IMPORTED_MODULE_2__.app.quit();
});
})();

/******/ })()
;
//# sourceMappingURL=main.js.map