const {MongoClient} = require('mongodb');
const settings = require('../settings');


const url = `mongodb://${settings.username}:${settings.password}@${settings.ip}:${settings.port}/${settings.database}`;

let _db;

module.exports = {
  connectToServer: function( callback ) {
    MongoClient.connect( url,  { useNewUrlParser: true }, function( err, mongoClient ) {
      _db  = mongoClient.db(settings.database);
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  }
};
