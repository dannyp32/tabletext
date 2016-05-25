var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
   created_at: { type:Date, default:Date.now },
   updated_at: { type:Date, default:Date.now },
});

module.exports = mongoose.model('Conversation', schema, 'Conversation')
