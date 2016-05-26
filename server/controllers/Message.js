var Message = require('../models/Message');
var Party = require('../models/Party');
var Setting = require('../models/Setting');
var mongoose = require('mongoose');

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

         console.log("here are your settings");
         console.log(settings);
         console.log(JSON.stringify(settings));

         if (getHoursMessage) {
            console.log('its trying to get the hours message');
            automatedResponse = settings[0].hours;
         } else if (getAddressMessage) {
            console.log('its trying to get the address message');
            automatedResponse = settings[0].address;
         } else if (getMenuMessage) {
            console.log('its trying to get the menu message');
            automatedResponse = settings[0].menu;
         } else if (getWebsiteMessage) {
            console.log('its trying to get the website message');
            automatedResponse = settings[0].website;
         } else if (getTakeoutMessage) {
            console.log('its trying to get the takeout message');
            automatedResponse = settings[0].takeout;
         } else {
            return;
         }


         console.log(automatedResponse);

         var message = new Message({
            message: automatedResponse,
            is_incoming: false,
            conversation_id: mongoose.Types.ObjectId(conversation_id)
         });

         message.save(function (err) {
            if (err) {
               console.log(err);
            } else {

               console.log(automatedResponse);
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

   incomingMessage: function (req, res, io, twilio) {
      var mobile = req.body.From.substr(2).toString();
      var text = req.body.Body;
      console.log(mobile);

      Party.findOne({mobile_number: mobile}).sort({ 'arrival_time':-1 }).exec(function (err, data) {
         if (err) {
            console.log(err);
            return;
         }

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

         }
      });
   }
};
