var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
   message: { type:String },
   state: { type:Number, default:0 }, // Unread = 0, Read = 1;
   created_at: { type:Date, default:Date.now },
   conversation_id: { type:Schema.ObjectId },
});

module.exports = mongoose.model('Message', schema);
