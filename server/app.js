"use strict";

var accountSid = 'AC0321512806b6971f20bf878346751ac0';
var authToken = 'f5b2085d3ca84d8135386d68968fae7d';
var twilio = require('twilio')(accountSid, authToken);
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

mongoose.connect('mongodb://localhost/tabletext');

app.use(express.static('static'));
app.use (bodyParser.urlencoded({ extended: false }));
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:37088');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

// Run server to listen on port 3000.
var server = app.listen(3000, function () {
   console.log('listening on *:3000');
});

var io = require('socket.io')(server);

/* Routes */
require('./routes')(app, io, twilio);

