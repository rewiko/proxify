'use strict';

module.exports = function authenticated(request, response, next) {
    var verify = function verify(error, token) {
        if (!(_.isEmpty(error) && token !== -1)) {
            return response.json(401, { message: 'Given authorization token is not valid' });
        } else {

            request.token = token;
            // if request proxy localhost
            if (typeof (request.dataLinkedToToken) != 'undefined') {

                if (request.dataLinkedToToken.dataValues.url.match(/^(localhost|127.0.0.1)/)) {
                    request.query && delete request.query.token;
                    request.body && delete request.body.token;
                    request.proxy = 'proxy';
                    return next();
                }
            }

            //define user var before (because of strict mode)
          request.user = null;
          var models = coreServerApp.global.models['sequelize-postgres'];
          var User = models.AdministrationUser;
          var Group = models.AdministrationGroup;
          User.find({ where: { id: token.id },
            include: [{ model: Group }]
          }).then(function (user) {
            request.user = user.userToJSON();
            return next();
          }, function (err) {
            return response.status(401).json({ "error": 'User not found!' });
          });

        }
    };

    // Get and verify JWT via service
    try {
        coreServerApp.global.services.Token.getToken(request, verify, true);
    } catch (error) {
        return response.status(401).json({ "error": error.message });
    }
};
