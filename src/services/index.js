const fs = require('fs');
const ts = require('typescript');
const path = require('path');
const process = require('process');
const { ReplaySubject, Subject } = require('rxjs');
const { debounceTime } = require('rxjs/operators');
const Updates = new ReplaySubject(1);
let _Ready;
const Ready = new Promise(res => _Ready = res);
module.exports = { Updates, Ready };
const srcDir = path.join(__dirname, 'src');
let lock = false;
let pending = new Subject();
pending
    .pipe(debounceTime(2000))
    .subscribe(() => compile());
fs.watch(srcDir, { recursive: true }, () => pending.next());
compile();


function reportDiagnostics(diagnostics) {
    diagnostics.forEach(diagnostic => {
        let message = "Error";
        if (diagnostic.file) {
            const where = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            message += ' ' + diagnostic.file.fileName + ' ' + where.line + ', ' + where.character + 1;
        }
        message += ": " + ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        console.log(message);
    });
}

function readConfigFile(configFileName) {
    const configFileText = fs.readFileSync(configFileName).toString();
    const result = ts.parseConfigFileTextToJson(configFileName, configFileText);
    const configObject = result.config;
    if (!configObject) {
        reportDiagnostics([result.error]);
        process.exit(1);
    }

    const configParseResult = ts.parseJsonConfigFileContent(configObject, ts.sys, path.dirname(configFileName));
    if (configParseResult.errors.length > 0) {
        reportDiagnostics(configParseResult.errors);
        process.exit(1);
    }
    return configParseResult;
}


function compile() {
    if (!lock) {
        lock = true;
        try {
            const configFile = path.join(__dirname, 'tsconfig.json')
            const config = readConfigFile(configFile);
            const program = ts.createProgram(config.fileNames, config.options);
            program.emit();
            delete require.cache[require.resolve('./dist/index')];
            const services = require('./dist/index')
            Updates.next(services)
            _Ready();
        } catch (error) {
            console.log(error)
        }
        lock = false;
    } else {
        pending.next();
    }
}