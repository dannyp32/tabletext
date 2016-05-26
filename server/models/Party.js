var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Conversation = require('./Conversation');

var schema = new Schema({
   name: { type: String },
   size: { type:Number },
   notes: { type: String },
   arrival_time: { type:Date, default:Date.now },
   mobile_number: { type:String },
   conversation_id: { type:Schema.ObjectId}
});

module.exports = mongoose.model('Party', schema, 'Party');
