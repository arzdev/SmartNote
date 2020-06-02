var socket;
var user_color;
var pen_size;
var drawing = [];

function setup() {
  // put setup code here
  console.log('\n\n\ngoing through setup!\n\n\n')
  createCanvas(windowWidth, windowHeight);
  background(255);

  user_color = "#000000";
  pen_size = 20;

  socket = io.connect('localhost:5000')
  socket.on('mouse', newDrawing);

  /*
  var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  console.log(firebase)
  */

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
      color: user_color
    }
    socket.emit('mouse', data);
    drawing.push(data);
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
