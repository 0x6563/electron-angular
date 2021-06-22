const http = require('http');
const UIUrl = 'http:localhost:4200';
let _ready;

module.exports.UIUrl = UIUrl;
module.exports.Ready = new Promise(res => _ready = res);
(async () => {
    while (!(await serverReady())) {
        await wait(2000);
    }
    _ready();
})()
function serverReady() {
    return new Promise((res) => {
        http.get(UIUrl, (resp) => {
            resp.on("data", () => res(true));
        }).on('error', () => res(false));

    });
}

function wait(ms) {
    return new Promise(r => setTimeout(() => r(), ms));
}