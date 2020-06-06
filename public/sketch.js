var user_color;
var pen_size;
var drawing = [];
var fillingForm = false;
var placingText = false;
var input_text = "";
var font_size = 8;
var roomId = "";
var imgSrc = "";
var loadBackground = false;
var erasing = false;
var dy = 0;
var cnv;

function setup() {
	// put setup code here
  dy = document.getElementById("top_bar").offsetHeight;
	cnv = createCanvas(windowWidth, windowHeight - dy);
  cnv.position(0,dy)
	background(255);

	user_color = "#000000";
	pen_size = 20;

	socket = io.connect("localhost:5000");
	socket.on("room", getRoomId);
	socket.on('background', getBackground);
	socket.on("mouse", newDrawing);
}

function getRoomId(data) {
	roomId = data;
	console.log("got it!");
	console.log(roomId);
}

function getBackground(data){
  console.log('got background!')
  imgsrc = data
  console.log(data)
  loadBackground = true;
}

function newDrawing(data) {
	console.log("new called!");
	console.log(data);
	if (data.type === "line") {
		console.log("no here!");
		stroke(data.color);
		strokeWeight(data.pensize);
		line(data.x, data.y, data.xp, data.xy);
	} else {
		console.log("here setting weight!");
		strokeWeight(1);
		textSize(data.size);
		text(data.words, data.x, data.y);
	}
}

function draw() {
  if(erasing){
    erase()
  }
  else{
    noErase()//test with background img
  }
	if (mouseIsPressed) {
		if (placingText) {
			console.log(pen_size);
			textFont("Georgia");
			textSize(font_size);
			data = {
				type: "text",
				x: mouseX,
				y: mouseY,
				words: input_text,
				size: font_size,
			};
			console.log("fontsize is: ");
			console.log(font_size);
			text(input_text, mouseX, mouseY);
			socket.emit("mouse", data);
			drawing.push(data);
			setTimeout(function () {
				placingText = false;
			}, 500);
		} else if (fillingForm == false && placingText == false) {
			makeLine();
		}
	}
	if(loadBackground){
      loadBackground = false;
      console.log('got to loadback')
      var testimg; 
      var raw = new Image();
      raw.src = imgsrc;


      raw.onload = function() {
        testimg = createImage(raw.width, raw.height);
        testimg.drawingContext.drawImage(raw, 0, 0);
        background(testimg, 0, 0); // draw the image, etc here
      }
    }
}

function makeLine() {
	if (!placingText && mouseX > 0 && mouseY > 0) {
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
			color: user_color,
		};
		socket.emit("mouse", data);
		drawing.push(data);
	}
}

function sliderSubmission(e) {
	e.preventDefault();
	fillingForm = false;
	thickness = e.target.elements.penSlider.value;
	strokeWeight(thickness);
	document.getElementById("slider").style.display = "none";
}

function textSubmission(e) {
	fillingForm = false;
	placingText = true;
	e.preventDefault();
	input_text = e.target.elements.words.value;
	font_size = parseInt(e.target.elements.font_size.value);
	document.getElementById("text_form").style.display = "none";
	document.getElementById("text_prompt").style.display = "none";
}

function displayTextSubmission() {
	if (!fillingForm) {
		fillingForm = true;
		document.getElementById("text_form").style.display = "block";
		document.getElementById("text_prompt").style.display = "block";
		console.log("before:");
		console.log(pen_size);
		strokeWeight(1);
	}
}

function displayThicknessSlider() {
	if (!fillingForm) {
		slider = document.getElementById("slider");
		slider.style.display = "block";
		fillingForm = true;
	}
	curr_color = document.getElementById("color");
	user_color = curr_color.value;
}

function setPen(){
  erasing = false;
}

function setErase(){
  erasing = true;
}

function changeColor() {
	var colorButton = document.getElementById("color");
}

function displayShareForm() {
	if (!fillingForm) {
		fillingForm = true;
		share_form = document.getElementById("share_form");
		share_form.style.display = "block";
		share_form.elements.invite_url.value =
			"http://localhost:5000/canvas?roomid=" + roomId;
	}
}

function downloadAsPng() {
  console.log('here!')
  filename = document.getElementById("whiteboard_name").textContent;
  if(filename === ""){
    filename = "Whiteboard Name";
  }
	saveCanvas(filename, "png");
}

function downloadAsJpeg() {
	saveCanvas("myCanvas", "jpeg");
}

function editWhiteboardName(e) {
  var whiteboard_name = document.getElementById("whiteboard_name")
  if(e.code === "Enter"){
    e.preventDefault();
    whiteboard_name.blur();
  }
}

function whiteboardNameBlur(e) {
  var whiteboard_name = document.getElementById("whiteboard_name")
  if(whiteboard_name.textContent === ""){
    whiteboard_name.textContent = "Whiteboard Name";
  }
}

function submitShareForm(e) {
	e.preventDefault();
	form = document.getElementById("share_form");
	url = document.getElementById("invite_url");
	url.select();
	document.execCommand("copy");
	form.style.display = "none";
	console.log(roomid);
	fillingForm = false;
}

function saveFile() {
  const thumbs = [];
  const img = get();
  thumbs.push(img);
  img.save(frameCount, '.png');
  imgurl = img.canvas.toDataURL()
  socket.emit('save', imgurl)

}

document.addEventListener("DOMContentLoaded", (event) => {
	// make sure the website is fully downloaded

	var share_icon = document.getElementById("share_icon");
  var save_icon = document.getElementById("save_icon"); 
	var share_form = document.getElementById("share_form");
	var text_form = document.getElementById("text_form");
	var text_icon = document.getElementById("text_icon");
  var download_icon = document.getElementById("download_icon")
  var thickness_icon = document.getElementById("thickness_icon");
	var pen_icon = document.getElementById("pen_icon");
	var slider = document.getElementById("slider");
	var colorButton = document.getElementById("color");
	var eraser = document.getElementById("eraser");
  var whiteboard_name = document.getElementById("whiteboard_name")
  var top_bar = document.getElementById("top_bar");

  save_icon.onclick = saveFile;


	colorButton.onChange = changeColor();
  whiteboard_name.onkeydown = editWhiteboardName;
  whiteboard_name.onblur = whiteboardNameBlur;

	share_icon.onclick = displayShareForm;
	share_form.style.display = "none";
	share_form.onsubmit = submitShareForm;

	slider.addEventListener("submit", sliderSubmission, false);
	slider.style.display = "none";

	text_form.addEventListener("submit", textSubmission, false);
	text_form.style.display = "none";
	text_icon.onclick = displayTextSubmission;

	pen_icon.onclick = setPen;
  thickness_icon.onclick = displayThicknessSlider;

	// eraser
	eraser.onclick = setErase;
  download_icon.onclick = downloadAsPng;

	// Change color
	var colorHTML = document.getElementById("color");
	colorHTML.oninput = function () {
		user_color = colorHTML.value;
	};

	// Slider for Pen Size
	var rangeslider = document.getElementById("penSlider");
	rangeslider.oninput = function () {
		pen_size = rangeslider.value;
	};
});
