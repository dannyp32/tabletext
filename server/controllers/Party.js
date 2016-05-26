var Party = require('../models/Party');
var Conversation = require('../models/Conversation');
var Message = require('../models/Message');

module.exports = {
   getMessages: function (req, res) {
      console.log('conversation id is: ' + req.params.conversation_id);
      Message.find({ conversation_id : req.params.conversation_id }, 
         function (err, messages) {
            console.log(messages);
            res.send(messages); 
         });
   },


   getParties: function (req, res) {
      console.log('it gets here');
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      Party.find({ arrival_time : {$gte: today}}).exec( 
         function (err, parties) {
            if (err) {
               console.log(err);
               return;
            }
            console.log(parties);
            res.send(parties); 
         });
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
                           if (err) {
                              console.log(err);
                              res.send({ error:'Could not send new message with twilio.' });
                              return;
                           }
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

