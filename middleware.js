module.exports = function(db) {

    // define pieces of middlewear we want to use in our app
    return {
        requireAuthentication: function(request, response, next) {
            var token = request.get('Auth');
            console.log("request token: " + token);

            // find user by token value
            db.user.findByToken(token).then(function(user) {
                console.log("middewear for token working so far");
                //add user to request object. Let's us access
                // user inside each individual request
                request.user = user;
                next();
            }, function() {
                console.log("token middlewear error");
                response.status(401).send();
            });
        }
    };

};
