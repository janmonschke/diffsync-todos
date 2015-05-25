var CouchDBDataAdapter = require('diffsync-couchdb'),
    createDatabase     = require('./database');

module.exports = function(databaseName){
  var database = createDatabase(databaseName);
  return new CouchDBDataAdapter(database);
};
