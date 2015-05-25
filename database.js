var cradle = require('cradle');

cradle.setup({
  raw: false,
  cache: false,
  protocol: 'https',

  host: process.env.db_host,
  port: process.env.db_port,
  auth: {
    username: process.env.db_admin,
    password: process.env.db_password
  }
});

module.exports = function(databaseName){
  return (new cradle.Connection()).database(databaseName);
};
