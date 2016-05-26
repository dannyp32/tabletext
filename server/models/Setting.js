var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
   user_id: { type: String },
   hours: { type: String },
   address: { type: String },
   menu: { type: String },
   website: { type:String },
   takeout: {type:String }
});

module.exports = mongoose.model('Setting', schema, 'Setting');
