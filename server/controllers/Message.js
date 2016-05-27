var Message = require('../models/Message');
var Party = require('../models/Party');
var Setting = require('../models/Setting');
var Conversation = require('../models/Conversation');
var mongoose = require('mongoose');

var createInboundConversation = function (mobile, text, io) {
   var conversation = new Conversation({
      mobile_number: mobile,
      is_incoming: true
   });

   conversation.save(function (err) {
      if (err) {
         console.log(err);
      } else {
         var message = new Message({
            message: text,
            is_incoming: true,
            conversation_id: conversation.id,
         });

         message.save(function (err) {
            if (err) {
               console.log(err);
            } else {
               io.emit('newIncomingConversation', { conversation: conversation, message: message });
            }
         });
      }
   });
};

var isAskingAboutHours = function (text) {
   if (text.indexOf("time") > -1 && 
      (text.indexOf("open") > -1 || 
      text.indexOf("close") > -1 || 
      text.indexOf("closing") > -1 || 
      text.indexOf("opening") > -1)) {
      return true; 
   }

   if (text.indexOf("long") > -1 && 
      (text.indexOf("open") > -1 || text.indexOf("close") > -1)) {
      return true;   
   }

   if (text.indexOf("business") > -1 && 
      text.indexOf("hours") > -1) {
      return true;   
   }
   return false;
};


var isAskingAboutAddress = function (text) {
   if ((text.indexOf("where") > -1 && 
      text.indexOf("located") > -1) || 
      text.indexOf("address") > -1 || 
      text.indexOf("directions") > -1) {
      return true;   
   }

   return false;
};

var isAskingAboutMenu = function (text) {
   if (text.indexOf("menu") > -1) {
      return true;   
   }

   return false;
};

var isAskingAboutWebsite = function (text) {
   if (text.indexOf("website") > -1 || 
      text.indexOf("site") > -1) {
      return true;   
   }

   return false;
};

var isAskingAboutTakeout = function (text) {
   if (text.indexOf("takeout") > -1 || 
       text.indexOf("take out") > -1 ||
       text.indexOf("carryout") > -1 ||
       text.indexOf("carry out") > -1 ||
       text.indexOf("pickup") > -1 ||
       text.indexOf("pick up") > -1) {
      return true;   
   }
   return false;
};

var parseMessage = function (message, conversation_id, user_id, toNumber, io, twilio) {
   var text = message.message.toLowerCase();
   var getHoursMessage = false;
   var getAddressMessage = false;
   var getMenuMessage = false;
   var getWebsiteMessage = false;
   var getTakeoutMessage = false;
   var automatedResponse = '';

   if ((getHoursMessage = isAskingAboutHours(text)) || 
      (getAddressMessage = isAskingAboutAddress(text)) ||
      (getMenuMessage = isAskingAboutMenu(text)) ||
      (getWebsiteMessage = isAskingAboutWebsite(text)) ||
      (getTakeoutMessage = isAskingAboutTakeout(text))) {

      Setting.find({ user_id: user_id}, function (err, settings) {
         if (err || !settings || !settings[0]) {
            console.log(err);
            return;
         }

         if (getHoursMessage) {
            automatedResponse = settings[0].hours;
         } else if (getAddressMessage) {
            automatedResponse = settings[0].address;
         } else if (getMenuMessage) {
            automatedResponse = settings[0].menu;
         } else if (getWebsiteMessage) {
            automatedResponse = settings[0].website;
         } else if (getTakeoutMessage) {
            automatedResponse = settings[0].takeout;
         } else {
            return;
         }

         var message = new Message({
            message: automatedResponse,
            is_incoming: false,
            conversation_id: mongoose.Types.ObjectId(conversation_id)
         });

         message.save(function (err) {
            if (err) {
               console.log(err);
            } else {

            twilio.sms.messages.create({
               body: automatedResponse,
               to: toNumber,
               from: '+18052629242', // my twilio account number
            }, function(err, sms) {
               if (err) {
                  console.log(err);
                  return;
               }
               io.emit('incomingMessage', { message:message });
               process.stdout.write(sms.sid);
             });
            }
         });
      });
   }
};

module.exports = {
   getIncomingConversations: function (req, res) {
      Conversation.find({ is_incoming: true }, 
         function (err, convos) {
            if (err) {
               console.log(err);
               res.send({ error: 'Error finding incoming conversations' });
            }

            res.send(convos);
         });
   },

   getMessages: function (req, res) {
      Message.find({ conversation_id : mongoose.Types.ObjectId(req.params.conversation_id) }, 
         function (err, messages) {
            if (err) {
               console.log(err);
               res.send({ error: 'Error finding messages.' });
            }
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

   incomingMessage: function (req, res, io, twilio) {
      var mobile = req.body.From.substr(2).toString();
      var text = req.body.Body;
      console.log(mobile);

      Party.findOne({mobile_number: mobile}).sort({ 'arrival_time':-1 }).exec(function (err, data) {
         if (err) {
            console.log(err);
            return;
         }
         console.log(JSON.stringify(data));

         if (data) {
            var message = new Message({
               message: text,
               is_incoming: true,
               conversation_id: mongoose.Types.ObjectId(data.conversation_id)
            });

            message.save(function (err) {
               if (err) {
                  console.log(err);
               } else {
                  io.emit('incomingMessage', { message:message });
                  parseMessage(message, data.conversation_id, '', req.body.From, io, twilio);
               }
            });
         } else {
            console.log("couldn't find any party for this phone number");
            createInboundConversation(mobile, text, io);
         }
      });
   }
};
