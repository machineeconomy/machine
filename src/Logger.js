const log = function (message) {
    var today = new Date();
    var date = today.getFullYear() + '-' + fixTimeFormat((today.getMonth()) + 1) + '-' + fixTimeFormat(today.getDate());
    var time = fixTimeFormat(today.getHours()) + ":" + fixTimeFormat(today.getMinutes()) + ":" + fixTimeFormat(today.getSeconds());
    var dateTime = date + ' ' + time;

    console.log(dateTime + " | " + message)
}

const fixTimeFormat = function (time) {
    time = time.toString()

    if (time.length < 2) {
        time = "0" + time
    }

    return time
}

module.exports = {
    log
}