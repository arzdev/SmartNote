var socket;

function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight);
  background(255);
  socket = io.connect('localhost:5000')
  socket.on('mouse', newDrawing);
}

function newDrawing(data) {
  stroke(0);
  strokeWeight(23);
  line(data.x, data.y, data.xp, data.xy);
}

function mouseDragged() {
  stroke(0);
  strokeWeight(23);
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
