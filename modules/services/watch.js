const { Subject } = require('rxjs');
const Updates = new Subject(1);
let _Ready;
const Ready = new Promise(res => _Ready = res);
module.exports = { Updates, Ready };
const TscWatchClient = require('tsc-watch/client');
const watch = new TscWatchClient();

watch.on('first_success', () => {
    console.log('first');
    _Ready();
});

watch.on('success', () => {
    console.log('update');
    Updates.next();
});

watch.on('compile_errors', (e) => {
    console.log(e)
});

watch.start('--project', __dirname);

try {
    // do something...
} catch (e) {
    watch.kill(); // Fatal error, kill the compiler instance.
}
