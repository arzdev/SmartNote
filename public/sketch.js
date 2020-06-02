var socket;
var user_color;
var pen_size;
var drawing = [];
var writingText = false;
var placingText = false;
var input_text = "";
var font_size = 8;

function setup() {
  // put setup code here
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
  console.log('new called!')
  console.log(data)
  if(data.type === "line"){
    console.log('no here!')
    stroke(data.color);
    strokeWeight(data.pensize);
    line(data.x, data.y, data.xp, data.xy);
  }
  else{
    console.log('here setting weight!')
    strokeWeight(1);
    textSize(data.size)
    text(data.words, data.x, data.y)
  }
}

function draw() {
  if(mouseIsPressed){
    if(placingText){
      console.log(pen_size);
      textFont('Georgia');
      textSize(font_size);
      data = {
        type: "text",
        x: mouseX,
        y: mouseY,
        words: input_text,
        size: font_size
      }
      console.log('fontsize is: ')
      console.log(font_size)
      text(input_text, mouseX, mouseY);
      socket.emit('mouse', data);
      drawing.push(data);
      setTimeout(function(){ placingText = false; }, 500);
    }
    else if(writingText == false && placingText == false){
      makeLine()
    }
  }
}

function makeLine(){

    if(!placingText){
      stroke(user_color);
      strokeWeight(pen_size);
      line(mouseX, mouseY, pmouseX, pmouseY);

      var data = {
        type: "line",
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

function textSubmission(e){
  writingText = false;
  placingText = true;
  e.preventDefault();
  input_text = e.target.elements.words.value
  font_size = parseInt(e.target.elements.font_size.value)
  document.getElementById("text_form").style.display = "none";
}

function displayTextSubmission(){
  writingText = true;
  document.getElementById("text_form").style.display = "block";
  console.log('before:')
  console.log(pen_size)
  strokeWeight(1);
}

document.addEventListener("DOMContentLoaded", (event) => { // make sure the website is fully downloaded

  var text_form = document.getElementById("text_form");
  var text_icon = document.getElementById("text_icon");
  text_form.addEventListener("submit", textSubmission, false);
  text_form.style.display = "none";
  text_icon.onclick = displayTextSubmission
  
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

});
