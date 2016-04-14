var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
   create_at: { type:Date, default:Date.now },
   update_at: { type:Date, default:Date.now },
});

module.exports = mongoose.model('Conversation', schema);
