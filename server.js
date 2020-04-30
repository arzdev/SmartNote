var express = require('express'); // import express
var app = express(); // make express app

var server = app.listen(3000);
app.use(express.static('public'));

var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
    console.log('new connection ' + socket.id);
    socket.on('mouse', function (data) {
        console.log("Received: 'mouse' " + data.x + " " + data.y);
        socket.broadcast.emit('mouse', data);
    });
};
