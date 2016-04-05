//mongo module
var mongo = require('mongodb');
var db;

module.exports = db = {
  init: function(nconf, callback) {
    var dbConnection = new mongo.Db(
      nconf.get('mongodb:collection'),
      new mongo.Server(nconf.get('mongodb:host'), nconf.get('mongodb:port'), {}),{}
    );
    dbConnection.open(function(err) {
      if (err) {
        callback(err);
      }
    });
  },
};

//common function to get a random riddle
// function getRandom(callback) {
//   //Create connection to server
//   MongoClient.connect("mongodb://" + nconf.get('mongodb:host') + ":" + nconf.get('mongodb:port') + "/" + nconf.get('mongodb:collection'), (err, db) => {
//     if (err) {
//       throw err;
//     } else {
//       var collection = db.collection('riddles');
//       //Query for a random riddle from mongo
//       collection.aggregate([{ $sample: { size: 1 }}], (err, docs) => {
//         if (err) {
//           throw err;
//         } else {
//           //return the riddle data
//           db.close();
//           callback(docs[0]);
//         }
//       });
//     }
//   });
// }