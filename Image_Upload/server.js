var express = require("express");
var app = express();

var bodyParser = require('body-parser');

var mongojs = require("mongojs");

var db = mongojs("imagedata", ["imagedata"]);

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '10mb'}));

app.use(express.static(__dirname ));
app.use("/UploadImage", express.static(__dirname ));
app.use("/Gallery", express.static(__dirname ));
app.use("/scripts", express.static(__dirname + "/scripts"));
app.use("/views", express.static(__dirname + "/views"));
app.use("/styles", express.static(__dirname + "/styles"));

app.get('/GetImages', function (req, res) {
  db.imagedata.find(function (error, doc) {
  	res.json(doc);
  })
});

app.post('/UploadImageData', function (req, res) {
  db.imagedata.insert(req.body, function(error, doc){
  	res.json(doc);	
  });
  
});

app.listen(3000);
console.log("Server has started");