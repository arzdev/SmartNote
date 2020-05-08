var socket;
var user_color = "#000000";
var pen_size = 23;

function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight);
  background(255);
  socket = io.connect('localhost:5000')
  socket.on('mouse', newDrawing);
}

function newDrawing(data) {
  stroke(user_color);
  strokeWeight(pen_size);
  line(data.x, data.y, data.xp, data.xy);
}

function mouseDragged() {
  stroke(user_color);
  strokeWeight(pen_size);
  console.log('Sending: ' + mouseX + ',' + mouseY);
  line(mouseX, mouseY, pmouseX, pmouseY);

  var data = {
    x: mouseX,
    y: mouseY,
    xp: pmouseX,
    xy: pmouseY
  }
  socket.emit('mouse', data);
}

function draw() {
  // put drawing code here
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
