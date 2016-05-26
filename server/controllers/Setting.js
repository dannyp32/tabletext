var Setting = require('../models/Setting');

module.exports = {
   getSettings: function (req, res) {
      Setting.find({ user_id: ''}, 
         function (err, settings) {
            if (err) {
               console.log(err);
               return;
            }
            console.log(settings);
            res.send(settings); 
         });
   },

   saveSettings: function (req, res) {
      var hours = req.body.hours;
      var address = req.body.address;
      var menu = req.body.menu; 
      var website = req.body.website;
      var takeout = req.body.takeout; 

      var settings = {
         hours: hours,
         address: address,
         menu: menu,
         website: website,
         takeout: takeout
      };

      Setting.findOneAndUpdate({ user_id: '' }, settings, { upsert: true }, function (err, settings) {
         if (err) {
            console.log(err);
            return;
         }
         res.send(settings);
      });
   }
};

