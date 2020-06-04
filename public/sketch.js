var socket;
var user_color;
var pen_size;
var drawing = [];
var fillingForm = false;
var placingText = false;
var input_text = "";
var font_size = 8;
var roomId = "";

function setup() {
	// put setup code here
	createCanvas(windowWidth, windowHeight);
	background(255);

	user_color = "#000000";
	pen_size = 20;

	socket = io.connect("localhost:5000");
	socket.on("room", getRoomId);
	socket.on("mouse", newDrawing);

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

function getRoomId(data) {
	roomId = data;
	console.log("got it!");
	console.log(roomId);
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
}

function makeLine() {
	if (!placingText) {
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
}

function displayTextSubmission() {
	if (!fillingForm) {
		fillingForm = true;
		document.getElementById("text_form").style.display = "block";
		console.log("before:");
		console.log(pen_size);
		strokeWeight(1);
	}
}

function displayThicknessSlider() {
	user_color = colorHTML.value;
	if (!fillingForm) {
		slider = document.getElementById("slider");
		slider.style.display = "block";
		fillingForm = true;
	}
}

function changeColor() {
	var colorButton = document.getElementById("color");
}

function displayShareForm() {
	if (!fillingForm) {
		share_form = document.getElementById("share_form");
		share_form.style.display = "block";
		share_form.elements.invite_url.value =
			"http://localhost:5000/canvas?roomid=" + roomId;
		fillingForm = true;
	}
}

function downloadAsPng() {
	saveCanvas("myCanvas", "png");
}

function downloadAsPdf() {
	saveCanvas("myCanvas", "pdf");
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

document.addEventListener("DOMContentLoaded", (event) => {
	// make sure the website is fully downloaded

	var share_icon = document.getElementById("share_icon");
	var share_form = document.getElementById("share_form");
	var text_form = document.getElementById("text_form");
	var text_icon = document.getElementById("text_icon");
	var pen_icon = document.getElementById("pen_icon");
	var slider = document.getElementById("slider");
	var colorButton = document.getElementById("color");
	var downloadPngButton = document.getElementById("download_png");
	var downloadPdfButton = document.getElementById("download_pdf");
	var eraser = document.getElementById("eraser");

	colorButton.onChange = changeColor();

	share_icon.onclick = displayShareForm;
	share_form.style.display = "none";
	share_form.onsubmit = submitShareForm;

	downloadPngButton.onclick = downloadAsPng;
	downloadPdfButton.onclick = downloadAsPdf;

	slider.addEventListener("submit", sliderSubmission, false);
	slider.style.display = "none";

	text_form.addEventListener("submit", textSubmission, false);
	text_form.style.display = "none";
	text_icon.onclick = displayTextSubmission;

	pen_icon.onclick = displayThicknessSlider;

	// eraser
	eraser.onclick = function () {
		user_color = 0xffffff;
	};

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
