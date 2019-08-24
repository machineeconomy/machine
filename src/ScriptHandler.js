const ps = require('python-shell');
const sh = require('shelljs');

const runJavascript = function () {
    return new Promise((resolve, reject) => {

        const js = require('../hello_scripts/hello_javascript.js');

        resolve(js.run())

    });
}

const runPython = function () {
    return new Promise((resolve, reject) => {
        ps.PythonShell.run('./hello_scripts/hello_python.py', {}, (err, results) => {
            if (err) reject(err);
            resolve(results[0])
        });
    })
}

const runShell = function () {
    return new Promise((resolve, reject) => {
        const { stdout, stderr, code } = sh.exec('./hello_scripts/hello_shell.sh', { silent: true })
        console.log("stdout", stdout)
        console.log("stderr", stderr)
        console.log("code", code)

        resolve(stdout)
    })
}

const runRust = function () {
    return new Promise((resolve, reject) => {
        const { stdout, stderr, code } = sh.exec('./hello_scripts/hello_rust', { silent: true })
        console.log("stdout", stdout)
        console.log("stderr", stderr)
        console.log("code", code)

        resolve(stdout)
    })
}

const runCustomScript = function () {
    return new Promise((resolve, reject) => {

        const js = require('../custom/index.js');

        resolve(js.run())

    });
}

module.exports = {
    runJavascript,
    runPython,
    runShell,
    runRust
}