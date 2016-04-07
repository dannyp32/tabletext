var express = require('express');
var app = express();
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/aa');

var Cat = mongoose.model('Cat', { name: String });

var kitty = new Cat({ name: 'Zildjian' });
kitty.save(function (err) {
  if (err) // ...
  console.log('meow');
});




/*
app.get('/', function(req, res) {
   res.sendFile(__dirname + '/index.html');
});
*/
app.listen(3000, function() {
   console.log('Example app listening on port 3000!');
});

module.exports = app;
