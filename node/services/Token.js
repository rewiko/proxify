'use strict';

var jwt = require('jsonwebtoken');
var config = coreServerApp.global.config;
module.exports.generateTokenProxy = function (app) {
//  console.log("data app ", app);
  return coreServerApp.global.services.Token.issue(
    {
      applicationId: app.applicationId,
      permissionId: app.id,
      //referer: app.permissions[0].referrer,
      //urlApplication: app.url,
      //portalonly: app.permissions[0].portalonly
    });
};

module.exports.issue = function issue(payload) {
  return jwt.sign(
    payload,
    config.app.jwt_secret
  );
};

module.exports.verify = function verify(token, next) {
  return jwt.verify(
    token,
    config.app.jwt_secret,
    {},
    next
  );
};

module.exports.getToken = function getToken(request, next, throwError) {
  var token = '';

  if (request.headers && request.headers.authorization) {
    var parts = request.headers.authorization.split(' ');

    if (parts.length === 2) {
      var scheme = parts[0];
      var credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    } else if (throwError) {
      throw new Error('Invalid authorization header format. Format is Authorization: Bearer [token]');
    }
  } else if (request.query.token) {
    token = request.query.token;
  } else if ((typeof (request.headers.cookie) != 'undefined') &&
    (typeof (request.query.connexion_without_proxyDP) == 'undefined')) {
    var cookie_split = request.headers.cookie.split('; ');
    console.log("cookie_split ", cookie_split);
    _.forEach(cookie_split, function (cook, key) {

      if (token != '')
        return token;
      if (cook.substr(0, 6) == "token=") {
        token = cook.replace("token=", "");
      }
      if (cook.substr(0, 12) == "tokenportal=") {
        token = cook.replace("tokenportal=", "");
      }
      if (cook.substr(0, 9) == "tokenapp=") {
        token = cook.replace("tokenapp=", "");
      }
      if (cook.substr(0, 14) == "Authorization=") {
        token = cook.replace("Authorization=", "");
      }
      if (cook.substr(0, 14) == "authorization=") {
        token = cook.replace("authorization=", "");
      }

    });

    if (token == '')
      throw new Error('No authorization header was found');

  }
  else if (throwError) {
    throw new Error('No authorization header was found');
  }

  return coreServerApp.global.services.Token.verify(token, next);
};
