'use strict';

module.exports = function(Account) {
    Account.spawnGuest = function(res) {
        var crypto = require("crypto");
        var id = crypto.randomBytes(20).toString('hex');
        var pass = crypto.randomBytes(20).toString('hex');
        console.log(id);
        console.log(pass);
        Account.create({username: id, email: id+'@example.com', password: pass}, function(err, obj){
            var response = {
                username: id,
                password: pass
            }
            res(null, response);
        });
    };
    Account.remoteMethod(
        'spawnGuest', {
        http: {path: '/spawn-guest', verb: 'get'},
        returns: {
            arg: 'response',
            type: 'string',
        },
        }
    );
};
