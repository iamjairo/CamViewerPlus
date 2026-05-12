const fs = require('fs');
const path = require('path');

const appRoot = path.join(__dirname, "..");
const confDir = path.join(appRoot, "conf");
const confPath = path.join(confDir, "config.json");
const defaultConfPath = path.join(appRoot, "config.default.json");

function ensureConfDir() {
    fs.mkdirSync(confDir, { recursive: true });
}

function get() {
    ensureConfDir();
    let data;
    try {
        let rawFile = fs.readFileSync(confPath);
        data = JSON.parse(rawFile);
    } catch {
        let rawFile = fs.readFileSync(defaultConfPath);
        fs.copyFileSync(defaultConfPath, confPath);
        data = JSON.parse(rawFile);
    }
    return data;
}

async function getAsync() {
    ensureConfDir();
    let data;
    try {
        let rawFile = await fs.promises.readFile(confPath);
        data = JSON.parse(rawFile);
    } catch {
        let rawFile = await fs.promises.readFile(defaultConfPath);
        await fs.promises.copyFile(defaultConfPath, confPath);
        data = JSON.parse(rawFile);
    }
    return data;
}

async function getGrids() {
    const gridsPath = path.join(__dirname, '../views');
    const files = await fs.promises.readdir(gridsPath);
    return files
        .filter((file) => file.includes("-grid.hbs"))
        .map((file) => file.replace("-grid.hbs", ""));
}

function getGridsSync() {
    let grids = [];
    var files = fs.readdirSync(path.join(__dirname, '../views'));
    files.forEach(file => {
        if(file.includes("-grid.hbs")) {
            grids.push(file.replace("-grid.hbs",""));
        }
    });
    grids = grids.sort(function (a, b) {
        if (a === Infinity)
            return 1;
        else if (isNaN(a))
            return -1;
        else
            return a - b;
    });
    return grids;
}

function setGridType(grid) {
    let content = JSON.parse(fs.readFileSync(confPath, 'utf8'));

    content.settings.gridType = grid;

    fs.writeFileSync(confPath, JSON.stringify(content));
}

function setKeepAwake(state) {
    let content = JSON.parse(fs.readFileSync(confPath, 'utf8'));

    content.settings.keepAwake = state;

    fs.writeFileSync(confPath, JSON.stringify(content));
}

function setTransportProtocol(protocol) {
    let content = JSON.parse(fs.readFileSync(confPath, 'utf8'));

    content.settings.transportProtocol = protocol;

    fs.writeFileSync(confPath, JSON.stringify(content));
}

function setQuality(quality) {
    let content = JSON.parse(fs.readFileSync(confPath, 'utf8'));

    content.settings.quality = quality;

    fs.writeFileSync(confPath, JSON.stringify(content));
}

function setStreamMode(mode) {
    let content = JSON.parse(fs.readFileSync(confPath, 'utf8'));

    content.settings.streamMode = mode;

    fs.writeFileSync(confPath, JSON.stringify(content));
}

module.exports = { get, getAsync, getGrids, getGridsSync, setGridType, setKeepAwake, setTransportProtocol, setQuality, setStreamMode }
