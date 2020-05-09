var socket;
var user_color;
var pen_size;

function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight);
  background(255);

  user_color = "#000000";
  pen_size = 20;

  socket = io.connect('localhost:5000')
  socket.on('mouse', newDrawing);

  var firebaseConfig = {
    apiKey: "AIzaSyB4K8mPKt6OQ-K8I7Yw9ru3zA67AiOA1BM",
    authDomain: "smartnote-84afd.firebaseapp.com",
    databaseURL: "https://smartnote-84afd.firebaseio.com",
    projectId: "smartnote-84afd",
    storageBucket: "smartnote-84afd.appspot.com",
    messagingSenderId: "505055501571",
    appId: "1:505055501571:web:5170c1ee39e32cbe8b1d36",
    measurementId: "G-KRYK4JVRT0"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  console.log(firebase)
}

function newDrawing(data) {
  stroke(data.color);
  strokeWeight(data.pensize);
  line(data.x, data.y, data.xp, data.xy);
}


function draw() {
  // put drawing code here

  if (mouseIsPressed) {
    stroke(user_color);
    strokeWeight(pen_size);
    console.log('Sending: ' + mouseX + ',' + mouseY);
    line(mouseX, mouseY, pmouseX, pmouseY);

    var data = {
      x: mouseX,
      y: mouseY,
      xp: pmouseX,
      xy: pmouseY,
      pensize: pen_size,
      color: user_color,
    }
    socket.emit('mouse', data);
  }
}

document.addEventListener("DOMContentLoaded", (event) => { // make sure the website is fully downloaded

  // Change color
  var colorHTML = document.getElementById("color");
  colorHTML.oninput = function () {
    user_color = colorHTML.value;
  }

  // Slider for Pen Size
  var rangeslider = document.getElementById("penSlider");
  rangeslider.oninput = function () {
    pen_size = rangeslider.value;
  }
})
