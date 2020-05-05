var express = require('express'); // import express
var app = express(); // make express app

const PORT = process.env.PORT || 5000;
var server = app.listen(PORT, () => console.log('Server is running on PORT: ', PORT));
var path = require('path');

app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'public/html'));
//app.set('views', 'public/html');

app.get('/', (req, res) => {
  res.render('landing.html')
});

app.get('/about', (req, res) => {
  res.render('about.html')
});

app.get('/signup', (req, res) => {
  res.render('signup.html');
});

app.get('/canvas', (req, res) => {
  res.render('canvas.html')
});

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

