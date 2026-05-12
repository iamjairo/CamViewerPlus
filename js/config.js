const fs = require('fs');
const path = require('path');

function get() {
    let data;
    try {
        let rawFile = fs.readFileSync('./conf/config.json');
        data = JSON.parse(rawFile);
    } catch {
        let rawFile = fs.readFileSync('./config.default.json');
        fs.copyFileSync('./config.default.json', './conf/config.json')
        data = JSON.parse(rawFile);
    }
    return data;
}

async function getAsync() {
    let data;
    try {
        let rawFile = await fs.promises.readFile('./conf/config.json');
        data = JSON.parse(rawFile);
    } catch {
        let rawFile = await fs.promises.readFile('./config.default.json');
        await fs.promises.copyFile('./config.default.json', './conf/config.json');
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
    let content = JSON.parse(fs.readFileSync('./conf/config.json', 'utf8'));

    content.settings.gridType = grid;

    fs.writeFileSync('./conf/config.json', JSON.stringify(content));
}

function setKeepAwake(state) {
    let content = JSON.parse(fs.readFileSync('./conf/config.json', 'utf8'));

    content.settings.keepAwake = state;

    fs.writeFileSync('./conf/config.json', JSON.stringify(content));
}

function setTransportProtocol(protocol) {
    let content = JSON.parse(fs.readFileSync('./conf/config.json', 'utf8'));

    content.settings.transportProtocol = protocol;

    fs.writeFileSync('./conf/config.json', JSON.stringify(content));
}

function setQuality(quality) {
    let content = JSON.parse(fs.readFileSync('./conf/config.json', 'utf8'));

    content.settings.quality = quality;

    fs.writeFileSync('./conf/config.json', JSON.stringify(content));
}

function setStreamMode(mode) {
    let content = JSON.parse(fs.readFileSync('./conf/config.json', 'utf8'));

    content.settings.streamMode = mode;

    fs.writeFileSync('./conf/config.json', JSON.stringify(content));
}

module.exports = { get, getAsync, getGrids, getGridsSync, setGridType, setKeepAwake, setTransportProtocol, setQuality, setStreamMode }
