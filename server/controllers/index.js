exports.index = function (req, res) {
  res.render('home/index', {
    title: 'Table Text from Server'
  });
};

exports.addParty = function (req, res) {
  res.render('home/index', {
    title: 'Table Text from Server'
  });
};


var saveParty = function(req, res) {
   // TODO use data from request

   var party = new Party(
   {
         user: new ObjectId(123),
         phone: '5624136363', 
         size: 5
   });

   party.save(function(err) {
      if (err) {
         console.log(err);
      }
   });
}
