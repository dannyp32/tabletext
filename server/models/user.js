var User = function() {
   var   mongoose = require('mongoose'),
         Schema = mongoose.Schema,
         _ObjectId = mongoose.Types.ObjectId; 

   var UserSchema = new Schema({
      name: { type: String, required: true },
      phone: { type: String, required: true }
   });

   var _model = mongoose.model('user', UserSchema);

   //TODO validatePhoneNumber() {}

   return {
      schema: UserSchema,
      model: _model,
   }
}();

module.exports = User;
