var express = require("express"); // import express
var app = express(); // make express app

require("dotenv").config();

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase Datebase
require("firebase/database");

// Config for Firebase
var firebaseConfig = {
	apiKey: "AIzaSyBct07FmogeLJcN0keelvtK9lLrFmSEAb4",
	authDomain: "smartnote-1590114095005.firebaseapp.com",
	databaseURL: "https://smartnote-1590114095005.firebaseio.com/",
	projectId: "smartnote-1590114095005",
	storageBucket: "smartnote-1590114095005.appspot.com",
	messagingSenderId: "667040488592",
	appId: "1:667040488592:web:7b70f9deba4fb1f2ba4c15",
	measurementId: "G-2680TNSY38",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Instance of Firebase Datebase
require("dotenv").config();

var googleID = "";
var googleMail = "";
var googlePic = "";
var googleName = "";
var imgDatabase = "";

const PORT = process.env.PORT || 80;
var server = app.listen(PORT, () =>
	console.log("Server is running on PORT: ", PORT)
);
var path = require("path");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + "/public"));
app.use(express.static("public"));
app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);
app.set("views", path.join(__dirname, "public/html"));

let roomid;
let URLs = {};
var RoomManager = require("./RoomManager.js");
var room_manager = new RoomManager().getInstance();

app.get("/", (req, res) => {
	res.render("landing.html");
});

app.get("/about", (req, res) => {
	res.render("about.html");
});

app.get("/signup", (req, res) => {
	res.render("signup.html");
});

app.get("/gallery", (req, res) => {
	var url = req.query.id;
	console.log(url); // prints value
	var ref = firebase.database().ref("users/" + url + "/image");

	ref.on(
		"value",
		function (snapshot) {
			imgDatabase = JSON.stringify(snapshot.val());
			// console.log(imgDatebase)
		},
		function (error) {
			console.log("Error: " + error.code);
		}
	);

	// writeUserData(url);
	res.render("gallery.html");
});

app.post("/myform", function (req, res) {
	var myText = req.query.mytext; //mytext is the name of your input box
	console.log(myText);
});

app.post("/save", function (req, res) {
	var myText = req.query.id; //mytext is the name of your input box
	console.log(myText);
});

app.get("/canvas", (req, res) => {
	res.render("canvas.html");
	roomid = req.query.roomid;
	console.log("roomid for room is: " + roomid);
	if (typeof roomid === "undefined") {
		console.log("no roomid specified.  Creating new room.");
		roomid = createRandomURL();
	}
});

app.get("/get_images", (req, res) => {
	res.setHeader("Content-Type", "application/json");
	res.end(imgDatabase);
});

function createRandomURL() {
	let URL = "";
	let char_list =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let length = 12;
	let text = "";
	for (var i = 0; i < length; i++) {
		text += char_list.charAt(Math.floor(Math.random() * char_list.length));
	}
	console.log("new url is: " + text);
	return text;
}

var socket = require("socket.io");
var io = socket(server);
console.log(server);

io.sockets.on("connection", newConnection);

function newConnection(socket) {
<<<<<<< HEAD
	socket.join(roomid);
	socket.roomid = roomid;
	room_manager.add_user(socket.roomid, socket.id);
	host_id = room_manager.get_host_socket(roomid);

	if (host_id !== socket.id) {
		updateCanvas(host_id, socket.id, roomid);
	}
	socket.on("mouse", function (data) {
		socket.to(socket.roomid).emit("mouse", data);
		room_manager.push_stroke(roomid, data);
	});

	socket.on("disconnect", function () {
		console.log("diconnect detected: " + socket.id);
		room_manager.remove_user(socket.id);
	});
}
=======
  socket.join(roomid);
  socket.roomid = roomid;
  room_manager.add_user(socket.roomid, socket.id);
  host_id = room_manager.get_host_socket(roomid)
  socket.emit('room', roomid)

  if (host_id !== socket.id) {
    updateCanvas(host_id, socket.id, roomid)
  }
  socket.on('mouse', function (data) {
    socket.to(socket.roomid).emit('mouse', data)
    room_manager.push_stroke(roomid, data)
  });

  socket.on('disconnect', function() {
    console.log('diconnect detected: ' + socket.id)
    room_manager.remove_user(socket.id);
  });

  socket.on('roomrequest', function() {
    console.log('req recieved')
    socket.emit('room', roomid)
  })
};
>>>>>>> 1ee9e9de06a01fe99eec74fa9ea7a4062f825344

function updateCanvas(host_id, user_socket, roomid) {
	host_socket = io.sockets.connected[host_id];
	if (typeof host_socket !== "undefined") {
		history = room_manager.get_history(roomid);
		for (event in history) {
			stroke = history[event]["stroke"];
			host_socket.to(user_socket).emit("mouse", stroke);
		}
	}
}

function writeUserData(userId) {
	googleID = userId;
	firebase
		.database()
		.ref("users/" + userId)
		.set({
			username: "TEMP",
		});
}

function updateCanvas(host_id, user_socket, roomid) {
	host_socket = io.sockets.connected[host_id];
	history = room_manager.get_history(roomid);
	for (event in history) {
		stroke = history[event]["stroke"];
		host_socket.to(user_socket).emit("mouse", stroke);
	}
}

function writeUserData(userId, userMail, userName, userPic) {
	googleID = userId;

	firebase
		.database()
		.ref("users/" + userId)
		.set({
			name: "TEMP",
			email: "TEMP",
			profile_picture: "TEMP",
		});
}
