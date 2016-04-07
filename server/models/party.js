var Party = function() {
   var   mongoose = require('mongoose'),
         Schema = mongoose.Schema,
         _ObjectId = mongoose.Types.ObjectId; 
         User = require('./user.js');

   var PartySchema = new Schema({
      user: { type: ObjectId, ref: 'User', required: true },
     // conversationId: { type: ObjectId, ref: 'Conversation' },
      phone: { type: String, required: true },
      arrivalTime: { type: Date, default: Date.now },
      size: { type: Number, required: true }
   });

   var _model = mongoose.model('user', _user);

   //TODO validatePhoneNumber() {}

   return {
      schema: _schema,
      model: _model,
   }
}();

module.exports = User;
