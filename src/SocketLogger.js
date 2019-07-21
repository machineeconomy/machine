const { socketServer } = require('./WebSockets.js')


const socketLog = function(channel, message) {
    socketServer.emit(channel, message);

}

const logStatus = function (status) {
    socketServer.emit("status", status);

}


module.exports = {
    socketLog,
    logStatus
}