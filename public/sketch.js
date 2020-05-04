var socket;

function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight);
  background(255);
  socket = io.connect('localhost:3000')
  socket.on('mouse', newDrawing);
}

function newDrawing(data) {
  // noStroke();
  stroke(0);
  // fill(255);
  // ellipse(data.x, data.y, 15, 15);
  line(data.x, data.y, data.px, data.py);

}

function mouseDragged() {
  // noStroke();
  // fill(255);
  stroke(0);
  strokeWeight(23);
  console.log('Sending: ' + mouseX + ',' + mouseY);
  // ellipse(mouseX, mouseY, 15, 15);
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
