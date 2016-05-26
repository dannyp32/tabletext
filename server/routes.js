var Party = require('./controllers/Party');
var Message = require('./controllers/Message');

var routes = function (app, io, twilio) {
   // GET requests
   app.get('/test', function (req, res) {console.log('ngrok went through');});
   app.post('/twilio', function (req, res) {console.log('twilio went through'); console.log(req); res.send();});
   app.get('/conversation/:conversation_id/messages', Message.getMessages);
   app.get('/userId/:user_id/parties', function (req, res) {
      console.log('in routes at least'); Party.getParties(req, res);});
//   app.get('/', function (req, res) { res.sendFile(__dirname + '/views/index.html'); });
//   app.get('/waitlist', Party.getParties);


   // POST requests
   app.post('/newParty', function (req, res) { Party.createParty(req, res, io, twilio); });
   app.post('/newMessage', function (req, res) { Message.createMessage(req, res, twilio, false); });


   // Twilio requests
   app.post('/incomingMessage', function (req, res) { 
      console.log('at least it gets here'); 
      Message.incomingMessage(req, res, io, twilio); 
   });
};

module.exports = routes;
