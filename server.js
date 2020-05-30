var express = require('express'); // import express
var app = express(); // make express app

require('dotenv').config()

const PORT = process.env.PORT || 5000;
var server = app.listen(PORT, () => console.log('Server is running on PORT: ', PORT));
var path = require('path');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'public/html'));
//app.set('views', 'public/html');

let roomid;
let URLs = {}
var RoomManager = require('./RoomManager.js')
var room_manager = new RoomManager().getInstance()

app.get('/', (req, res) => {
  res.render('landing.html')
});

app.get('/about', (req, res) => {
  res.render('about.html')
});

app.get('/signup', (req, res) => {
  res.render('signup.html');
});

app.post('/myform', function (req, res) {
  var myText = req.query.mytext; //mytext is the name of your input box
  console.log(myText);
});

app.get('/canvas', (req, res) => {
  res.render('canvas.html')
  roomid = req.query.roomid;
  console.log('roomid for room is: ' + roomid)
  if(typeof roomid === 'undefined'){
    console.log('no roomid specified.  Creating new room.')
    roomid = createRandomURL();
  }
});

function createRandomURL(){
  let URL = "";
  let char_list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let length = 12;
  let text = ""
  for(var i=0; i < length; i++ ){
    text += char_list.charAt(Math.floor(Math.random() * char_list.length));
  }
  console.log('new url is: ' + text)
  return text;
}

var socket = require('socket.io');
var io = socket(server);
console.log(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  socket.join(roomid);
  socket.roomid = roomid;
  room_manager.add_user(socket.roomid, socket.id);
  console.log('new connection ' + socket.id + 'in room: ' + roomid);
  host_id = room_manager.get_host_socket(roomid)
  console.log('host socket is: ' + host_id)

  if(host_id !== socket.id){
    updateCanvas(host_id, socket.id, roomid)
  }

  socket.on('mouse', function (data) {
    console.log("Received: 'mouse' " + data.x + " " + data.y + 'from room" ' + socket.roomid);
    socket.to(socket.roomid).emit('mouse', data)
    console.log('on mouse')
    console.log(socket.id)
    room_manager.push_stroke(roomid, data)
  });
};

function updateCanvas(host_id, user_socket, roomid){
  host_socket = io.sockets.connected[host_id]
  history = room_manager.get_history(roomid)
  for(event in history){
    stroke = history[event]["stroke"]
    host_socket.to(user_socket).emit('mouse', stroke)
  }
}

