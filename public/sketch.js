var socket;
var user_color;
var pen_size;
var database;

var drawing = [];
var currentPath=[];
var isDrawing=false;
// load up drawing function if u can

function setup() {
  // put setup code here
  console.log('\n\n\ngoing through setup!\n\n\n')
  createCanvas(windowWidth, windowHeight);
  background(255);
  user_color = "#000000";
  pen_size = 20;
  socket = io.connect('localhost:5000')
  socket.on('mouse', newDrawing);

  canvas.mousePressed(startPath);
  canvas.parent('canvascontainer');
  canvas.mouseReleased(endPath);

  var saveButton=select('#saveButton');
  clearButton.mousePressed(clearDrawing);


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
  database=firebase.database();
  firebase.analytics();
  console.log(firebase);

  var params=getURLParams();
  console.log(params);
  if(params.id){
    console.log(params.id);
    showDrawing(params.id);
  }

  var ref=database.ref('drawings');
  ref.on('value', gotData, errData);
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
    var point = {
      x:mouseX,
      y:mouseY
    }
    currentPath.push(point);
    socket.emit('mouse', data);
    drawing.push(data);
  }
  for (var i=0; i<drawing.length;i++){
    var path=drawing[i];
    beginShape();
    for (var j=0; j<path.length;j++){
      vertex(path[j].x, path[j].y);
    }
    endShape();
  }
}

function startPath(){
  isDrawing=true;
  mouseIsPressed=true;
  currentPath=[];
  drawing.push(currentPath);
}

function endPath(){
  isDrawing=false;
  mouseIsPressed=false;
}

function saveDrawing(){
  var ref=database.ref('drawings');
  var data={
    name: 'placeholder',
    drawing: drawing //IDK WHAT THIS IS
  };
  var result=ref.push(data, dataSent);
  console.log(result.key);

  function dataSent(err, status){
    console.log(status);
  }
}

function gotData(data){
  var elts=selectAll('.listing');
  for(var i=0; i<elts.length;i++){
    elts[i].remove();
  }

  var drawings=data.val();
  var keys=Object.keys(drawings);
  for (var i=0; i<keys.length;i++){
    var key=keys[i];
    var li=createElement('li', '');
    li.class('listing');
    var ahref=createA('#', key);
    ahref.mousePressed(showDrawing);
    ahref.parent(li);

    var perma=createA('?id='+key, 'permalink');
    perma.parent(li);
    perma.style('padding', '4px');

    li.parent('drawinglist');
  }
}

function errData(err){
  console.log(err);
}

function showDrawing(key){
  if(key instanceof MouseEvent){
    key=this.html();
  }
  var ref=database.ref('drawings/'+key);
  ref.once('value', oneDrawing, errData);

  function oneDrawing(data){
    var dbdrawing=data.val();
    drawing=dbdrawing.drawing;
    console.log(drawing);
  }
}

function clearDrawing(){
  drawing=[];
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
