"use strict";

const five = require("johnny-five");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

let strip = null;

app.use(express.static(__dirname + "/public"))
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html")
});

five.Board({
	port: "COM9"
	//port: "/dev/ttyUSB0"
}).on("ready", function() {

  console.log("Arduino connected!");
  
  let state = {
		red: 0, green: 0, blue: 0
	};

   strip = new five.Led.RGB({
   	pins: {
      	red: 6,
      	green: 9,
      	blue: 3
    	}
   });

   let setColors = function(state) {
   	strip.color({
      	red: state.red,
      	blue: state.blue,
      	green: state.green
    	});
  	};

  	io.on("connection", function(client) {
		client.on("join", function(handshake) {
    	console.log(handshake);
   });

   setColors(state);

   client.on("rgb", function(data) {
		if (!data.get) {
 			state.red = data.red;
      	state.green = data.green;
    		state.blue = data.blue;
			setColors(state);
		}

   	client.emit("rgb", state);
   	client.broadcast.emit("rgb", state);
   });

});

	this.repl.inject({
		strip: strip
	});

});

const port = process.env.PORT || 3000;

server.listen(port);
console.log("Server listening on http://localhost:" + port);
