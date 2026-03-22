const config = require("../js/config");
const express = require('express');
const app = express();
const { proxy, scriptUrl } = require('rtsp-relay')(app);

async function configureMediamtxPaths(cameras, apiUrl) {
    for (const camera of cameras) {
        const pathName = 'cam' + camera.position;
        try {
            const res = await fetch(apiUrl + '/v3/config/paths/add/' + pathName, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ source: camera.source })
            });
            if (res.ok) {
                console.log(`MediaMTX: registered path ${pathName} -> ${camera.source}`);
            } else if (res.status === 400) {
                // Path already exists – patch it instead
                const patchRes = await fetch(apiUrl + '/v3/config/paths/patch/' + pathName, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ source: camera.source })
                });
                if (patchRes.ok) {
                    console.log(`MediaMTX: updated path ${pathName} -> ${camera.source}`);
                } else {
                    console.warn(`MediaMTX: failed to update path ${pathName}: HTTP ${patchRes.status}`);
                }
            } else {
                console.warn(`MediaMTX: unexpected status ${res.status} for path ${pathName}`);
            }
        } catch (err) {
            console.warn(`MediaMTX: could not configure path ${pathName}: ${err.message}`);
            console.warn('Make sure MediaMTX is running and the API is accessible at ' + apiUrl);
        }
    }
}

function start() {
    process.setMaxListeners(0);
    let configData = config.get();
    const streamMode = configData.settings.streamMode || 'jsmpeg';

    if (streamMode === 'hls' || streamMode === 'webrtc') {
        // MEDIAMTX_API_URL env var takes precedence over config (useful in Docker Compose)
        const apiUrl = process.env.MEDIAMTX_API_URL || configData.settings.mediamtxApiUrl || 'http://localhost:9997';
        configureMediamtxPaths(configData.settings.cameras, apiUrl)
            .then(() => {
                console.log(`Stream mode: ${streamMode} via MediaMTX at ${apiUrl}`);
            });
    } else {
        // Legacy JSMpeg mode: proxy RTSP -> MPEG-1 over WebSocket
        for (let i = 0; i < configData.settings.cameras.length; i++) {
            let thisHandler = proxy({
                url: configData.settings.cameras[i].source,
                verbose: false,
                additionalFlags: ['-q', configData.settings.quality],
                transport: configData.settings.transportProtocol
            });
            app.ws('/api/stream/' + configData.settings.cameras[i].position, thisHandler);
        }
        app.listen(configData.settings.streamPort);
        console.log("Started " + configData.settings.cameras.length + " JSMpeg stream(s) on port " + configData.settings.streamPort);
    }
}

module.exports = { start }
