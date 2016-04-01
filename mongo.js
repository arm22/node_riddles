//DB client
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://" + nconf.get('mongodb:host') + ":" + nconf.get('mongodb:port') + "/" + nconf.get('mongodb:collection'), (err, db) => {
if (err) {
      throw err;
    } else  if (!db) {
      throw new Error ("You really messed up");
    } else {
      //need to set db here
    }
    return db;
}
//common function to get a random riddle
function getRandom(callback) {
  //Create connection to server
  MongoClient.connect("mongodb://" + nconf.get('mongodb:host') + ":" + nconf.get('mongodb:port') + "/" + nconf.get('mongodb:collection'), (err, db) => {
    if (err) {
      throw err;
    } else {
      var collection = db.collection('riddles');
      //Query for a random riddle from mongo
      collection.aggregate([{ $sample: { size: 1 }}], (err, docs) => {
        if (err) {
          throw err;
        } else {
          //return the riddle data
          db.close();
          callback(docs[0]);
        }
      });
    }
  });
}