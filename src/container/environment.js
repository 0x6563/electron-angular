const http = require('http');
const path = require('path');
const UIUrl = 'http:localhost:4200';
const { Updates, Ready } = require(path.join(__dirname, '../services'));

module.exports.UIUrl = UIUrl;
module.exports.UIReady = async function () {
    while (!(await serverReady())) {
        await wait(2000);
    }
}
module.exports.ServicesUpdates = Updates;
module.exports.ServicesReady = () => Ready;

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