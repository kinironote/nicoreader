'use strict';

module.exports = function(app) {
  var db = app.dataSources.db;
  var lbTables = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role',
    'Account', 'Feed'];
  db.autoupdate(lbTables, function(er) {
    if (er) throw er;
    console.log(
        'Loopback tables [' + lbTables + '] created in ', db.adapter.name
    );
  });
};
