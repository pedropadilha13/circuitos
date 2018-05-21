 "use strict";
 var socket = io.connect(window.location.hostname + ":" + 3000);

 $("input[type=\"range\"]").change(function () {
	 socket.emit("rgb", {
		 red: $("#red").val(),
		 green: $("#green").val(),
		 blue: $("#blue").val()
	 });
 });

 $("#mix").change(function() {
	 var total = parseInt($(this).val());
	 var color = toColor(total);

	 socket.emit("rgb", color);

 });

 $("#viewColor").on("click", function () {
 	$("#picker2").toggle();
 });

 $("#redLabel").on("click", function () {
 	socket.emit("rgb", {
		red: 255,
		green: 0,
		blue: 0
	});
 });

 $("#greenLabel").on("click", function () {
 	socket.emit("rgb", {
		red: 0,
		green: 255,
		blue: 0
	});
 });

 $("#blueLabel").on("click", function () {
 	socket.emit("rgb", {
		red: 0,
		green: 0,
		blue: 255
	});
 });

 $("#stepPick").on("click", function () {
	 let step = parseInt(prompt("Step value:"));
	 if (!isNaN(step)) {
		 $("#mix").attr("step", step);
	 }
 });

 $("#black").on("click", function() {
	 socket.emit("rgb", {
		 red: 0,
		 green: 0,
		 blue: 0
	 });
 });

 socket.on("connect", function(data) {
     socket.emit("join", "Client is connected!");
 });

 socket.on("rgb", function(data) {
	  var pickers = $("input[type=\"range\"]");
	  $(pickers[0]).val(data.red);
	  $(pickers[1]).val(data.green);
	  $(pickers[2]).val(data.blue);
	  var number = toNumber(data);
	  $(pickers[3]).val(number || 0);
	  changeViewColor(data);
	  $("body").removeClass("loading");
 });

$(document).ready(function () {
	$("body").addClass("loading");
	socket.emit("rgb", {
		get: true
	});
});

function changeViewColor(data) {
	var r = parseInt(data.red).toString(16);
	var g = parseInt(data.green).toString(16);
	var b = parseInt(data.blue).toString(16);
	var color = "rgb(" + data.red + ", " + data.green + ", " + data.blue + ")";
	$("#viewColor").css("background-color", color);
}

function toColor(total) {
	var values = [];

	for (var x = 0; x < 6; x++) {
		if (total > 255) {
			values[x] = 255;
			total -= 255;
		} else {
			values[x] = total;
			total = 0;
		}
	}

	var color = {
		red: (255 - values[1] + values[4]),
		green: (values[0] - values[3]),
		blue: (values[2] - values[5])
	};

	return color;
}

function toNumber(color) {
	var r = parseInt(color.red);
	var g = parseInt(color.green);
	var b = parseInt(color.blue);

	var total;

	if (r === 255 && g >= 0 && b === 0) {
		total = g;
	}

	if (r >= 0 && g === 255 && b === 0) {
		total = 255 + (255 - r);
	}

	if (r === 0 && g === 255 && b >= 0) {
		total = 255 + 255 + b;
	}

	if (r === 0 && g >= 0 && b === 255) {
		total = 255 + 255 + 255 + (255 - g);
	}

	if (r >= 0 && g === 0 && b === 255) {
		total = 255 + 255 + 255 + 255 + r;
	}

	if (r === 255 && g === 0 && b >= 0) {
		total = 255 + 255 + 255 + 255 + 255 + (255 - b);
	}

	return total;

}

function check() {
	for (var x = 0; x < 1530; x++) {
		var v = (x === toNumber(toColor(x)));
		if (!v) {
			console.log(x);
		}
	}
}
