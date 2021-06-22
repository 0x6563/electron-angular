const { Subject } = require('rxjs');
const Updates = new Subject();
let _Ready;
const Ready = new Promise(res => _Ready = res);
module.exports = { Updates, Ready };
const TscWatchClient = require('tsc-watch/client');
const watch = new TscWatchClient();

watch.on('first_success', () => {
    console.log('container compiled')
    _Ready();
});

watch.on('success', () => {
    Updates.next({});
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
