const { WebServer } = require('./WebServer.js')

var io = require('socket.io');

var allowedOrigins = "http://localhost:* http://127.0.0.1:* https://machineeconomy.github.io:*";
var socket_path = '/socket';

var socketServer = io(WebServer, {
    origins: allowedOrigins,
    path: socket_path
});

module.exports = {
    socketServer
}