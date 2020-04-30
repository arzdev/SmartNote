var socket;

function setup() {
  // put setup code here
  createCanvas(500, 500);
  background(23);
  socket = io.connect('localhost:3000')
  socket.on('mouse', newDrawing);
}

function newDrawing(data) {
  noStroke();
  fill(23);
  ellipse(data.x, data.y, 15, 15);
}

function mouseDragged() {
  console.log('Sending: ' + mouseX + ',' + mouseY);
  noStroke();
  ellipse(mouseX, mouseY, 15, 15);

  var data = {
    x: mouseX,
    y: mouseY
  }
  socket.emit('mouse', data);
}

function draw() {
  // put drawing code here
}