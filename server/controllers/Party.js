var Party = require('../models/Party');
var Conversation = require('../models/Conversation');
var Message = require('../models/Message');

var getParties = function (status, date) {
 
};

module.exports = {
   getParties: function (req, res) {

   },

   getSeatedParties: function (req, res) {

   },

   getWaitingParties: function (req, res) {

   },

   createParty: function (req, res, io, twilio) {
      var name = req.body.name;
      var size = req.body.size;
      var mobile_number = req.body.mobile; 
      var conversation = new Conversation();

      conversation.save(function (err) {
         if (err) {
            console.log(err);
            res.send({ error:'Could not save new conversation.' });
         } else {
            var newParty = new Party({ 
               name: name,
               size: size,
               mobile_number: mobile_number,
               conversation_id: conversation.id 
            });

            newParty.save(function (err) {
               if (err) {
                  console.log(err);
                  res.send({ error:'Could not save new party.' });
               } else {
                  var messageContent = "Hi " + name + " welcome to our restaurant!";

                  var message = new Message({
                     message: messageContent,
                     state: 0,
                     conversation_id: conversation.id,
                  });

                  message.save(function (err) {
                     if (err) {
                        console.log(err);
                        res.send({ error:'Could not save new message.' });
                     } else {
                        io.emit('newParty', { 
                           party:newParty,
                           message:message
                        });

                        twilio.sms.messages.create({
                           body: messageContent,
                           to: mobile_number,
                           from: '+18052629242', // my twilio account number
                        }, function(err, sms) {
                           process.stdout.write(sms.sid);
                        });
                        
                        res.send({ 
                           party:newParty,
                           message:message
                        });
                     }
                  });
               }
            });
         }
      });
   }
};

