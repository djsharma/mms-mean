var https = require('https');
var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var middleware = require('./middleware.js');
var app = express();
//database connection establishment
var db = require('./db.js');
var privateKey = fs.readFileSync(__dirname+'/ssl/key.pem','utf8');



var options = {
	key: fs.readFileSync(__dirname+'/ssl/key.pem'),
	cert: fs.readFileSync(__dirname+'/ssl/cert.pem')
}; 



middleware(app); //doubtful for asynchronus

https.createServer(options,app).listen(3000);