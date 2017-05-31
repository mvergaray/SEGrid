var express = require('express');
var http = require('http');

var app = express();
app.use(express.static(__dirname + '/dist'));                 // set the static files location /public/img will be /img for users

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");