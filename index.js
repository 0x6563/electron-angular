const path = require('path');
const spawn = require('cross-spawn');
const container = require(path.join(__dirname, './modules/container/watch.js'));
const ui = require(path.join(__dirname, './modules/ui/watch.js'));
const services = require(path.join(__dirname, './modules/services/watch.js'));
const { merge } = require('rxjs');
const { throttleTime } = require('rxjs/operators');
const treekill = require('tree-kill');
let flag = false;
let uiProcess;
let containerProcess;

(async () => {
    uiProcess = npmStart('./modules/ui');
    await ui.Ready;
    await services.Ready;
    await container.Ready;
    containerProcess = npmStart('./modules/container');
    merge(container.Updates, services.Updates)
        .pipe(throttleTime(5000))
        .subscribe(() => startContainer())
})()

async function startContainer() {
    if (flag)
        return;
    flag = true;
        await kill(containerProcess.pid);
    containerProcess = npmStart('./modules/container');
    flag = false;
}

function npmStart(subpath) {
    return spawn('npm', ['start'], {
        stdio: "inherit",
        cwd: path.join(process.cwd(), subpath)
    });
}
function kill(...args) {
    return new Promise(resolve => treekill(...args, resolve))
}
