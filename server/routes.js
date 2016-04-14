var Party = require('./controllers/Party');
var Message = require('./controllers/Message');

var routes = function (app, io, twilio) {
   console.log(twilio);
   // GET requests
   app.get('/', function (req, res) { res.sendFile(__dirname + '/views/index.html'); });
   app.get('/conversation/:id', Message.getMessages);
   app.get('/waitlist', Party.getParties);


   // POST requests
   app.post('/addParty', function (req, res) { 
      
      console.log(twilio);
      Party.createParty(req, res, io, twilio); });







   ////// from tutorial
   
   app.post('/events', function (req, res) {
      var to = req.body.To;
      var fromNumber = req.body.From;
      var callStatus = req.body.CallStatus;
      var callSid = req.body.CallSid;
   
      io.emit('call progress event', { 
         to: to, 
         fromNumber: fromNumber, 
         callStatus: callStatus, 
         callSid: callSid 
      });
      //io.emit('call progress event', { to, fromNumber, callStatus, callSid });
   
      console.log(to, fromNumber, callStatus, callSid);
      res.send('Event received');
   });
   
   app.post('/voice', function (req, res) {
      // Generate a TwiML response
      var twiml = new twilio.TwimlResponse();
      console.log(twiml);
      console.log(JSON.stringify(twiml));
      // Talk in a robot voice over the phone.
      twiml.say('Daniel is not here right now Lyle. Hahaha.');
      // Set the response type as XML.
      res.header('Content-Type', 'text/xml');
      // Send the TwiML as the response.
      res.send(twiml.toString());
   });
   
};

module.exports = routes;
