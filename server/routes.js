var Party = require('./controllers/Party');
var Message = require('./controllers/Message');

var routes = function (app, io, twilio) {
   // GET requests
   app.get('/conversation/:conversation_id/messages', Message.getMessages);
//   app.get('/', function (req, res) { res.sendFile(__dirname + '/views/index.html'); });
//   app.get('/waitlist', Party.getParties);


   // POST requests
   app.post('/newParty', function (req, res) { Party.createParty(req, res, io, twilio); });
   app.post('/newMessage', function (req, res) { Message.createMessage(req, res, io, twilio); });
};

module.exports = routes;
