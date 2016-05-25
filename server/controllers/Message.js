var Message = require('../models/Message');
var Party = require('../models/Party');
var mongoose = require('mongoose');

module.exports = {
   getMessages: function (req, res) {
      console.log('conversation id is: ' + req.params.conversation_id);
      Message.find({ conversation_id : req.params.conversation_id }, 
         function (err, messages) {
            console.log(messages);
            res.send(messages); 
         });
   },

   createMessage: function (req, res, twilio, isIncomingMessage) {
      var conversation_id = req.body.conversation_id;
      var text = req.body.message;
      var mobile_number = req.body.mobile;

      var message = new Message({
         message: text,
         is_incoming: isIncomingMessage,
         conversation_id: mongoose.Types.ObjectId(conversation_id)
      });

      message.save(function (err) {
         if (err) {
            console.log(err);
            res.send({ error:'Could not save new message.' });
         } else {
            twilio.sms.messages.create({
               body: message.message,
               to: mobile_number,
               from: '+18052629242', // my twilio account number
            }, function(err, sms) {
               if (err) {
                  console.log(err);
                  res.send({ error:'Could not send new message with twilio.' });
               } else if (sms && sms.sid) {
                  console.log(sms);
                  console.log(JSON.stringify(sms));
                  process.stdout.write(sms.sid);
                  res.send({ message:message });
               }
            });
         }
      });
   },

   incomingMessageOld: function (req, res, io, twilio) {
      console.log('is twilio even working?');
      io.emit('getActiveConversation', { reqBody: req.body });
   },

   incomingMessage: function (req, res, io, twilio) {
      console.log('is twilio even working?');
      var mobile = req.body.From.substr(2).toString();
      var text = req.body.Body;
      console.log(mobile);

      Party.findOne({mobile_number: mobile}).sort({ 'arrival_time':-1 }).exec(function (err, data) {
         if (err) {
            console.log('some error at find');
            console.log(err);
            return;
         }

         //console.log(typeof data);
         //console.log(JSON.stringify(data));
         if (data) {
            console.log(data);
//            io.emit('newInboundMessage', { text: text,  
            var message = new Message({
               message: text,
               is_incoming: true,
               conversation_id: mongoose.Types.ObjectId(data.conversation_id)
            });

            message.save(function (err) {
               if (err) {
                  console.log('some error at save');
                  console.log(err);
               } else {
                  console.log('it gets here');
                  io.emit('incomingMessage', { message:message });
               }
            });

         }
      });
   },




   saveIncomingMessage: function (reqBody, conversation_id, io) {
      var conversation_id = conversation_id;
      var text = reqBody.Body;
      var mobile = reqBody.From.substr(1).toString();
      console.log(reqBody);
      console.log(conversation_id);
      console.log(reqBody.From);
      console.log(reqBody.From.substr(1));
  Party.find({mobile_number: mobile})
       .exec(function (err, data) {
          if (err) {
             console.log('some error at find');
             console.log(err);
             return;
          }
          console.log(data);
if (data && data[0]) {
console.log(data[0]);
         console.log(data);
}
     
       });
/*
      Party.find({ mobile_number:reqBody.From.substr(1)})
       .limit(1).sort({ 'arrival_time':-1 }).exec(function (err, data) {
          if (err) {
             console.log('some error at find');
             console.log(err);
             return;
          }

         console.log(data);
         if (data.length == 1) {
            var message = new Message({
               message: text,
               is_incoming: true,
               conversation_id: mongoose.Types.ObjectId(data[0].conversation_id)
            });

            message.save(function (err) {
               if (err) {
                  console.log('some error at save');
                  console.log(err);
               } else {
                  io.emit('incomingMessage', { message:message });
               }
            });
         }
      });
   */
   }
};
