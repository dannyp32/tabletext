var Message = require('../models/Message');
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

   createMessage: function (req, res, io, twilio) {
      var conversation_id = req.body.conversation_id;
      var text = req.body.message;
      var mobile_number = req.body.mobile;

      var message = new Message({
         message: text,
         conversation_id: mongoose.Types.ObjectId(conversation_id)
      });

      message.save(function (err) {
         if (err) {
            console.log(err);
            res.send({ error:'Could not save new message.' });
         } else {
           /* io.emit('newMessage', {
               message:message
            });
         */
            twilio.sms.messages.create({
               body: message.message,
               to: mobile_number,
               from: '+18052629242', // my twilio account number
            }, function(err, sms) {
               process.stdout.write(sms.sid);
            });
            
            res.send({ 
               message:message
            });
         }
      });
   }
};
