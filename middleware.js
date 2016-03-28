var cryptojs = require('crypto-js');

module.exports = function(db) {

    // define pieces of middlewear we want to use in our app
    return {
        requireAuthentication: function(request, response, next) {
            var token = request.get('Auth') || '';

            // find a token in the database a user provided
            db.token.findOne({
                where: {
                    tokenHash: cryptojs.MD5(token).toString()
                }
            }).then(function (tokenInstance) {
                if (!tokenInstance) {
                    throw new Error();
                }

                request.token = tokenInstance;
                db.user.findByToken(token);
            }).then(function (user) {
                request.user = user;
                next();
            }).catch(function () {
                response.status(401).send();
            });
        }
    };

};
