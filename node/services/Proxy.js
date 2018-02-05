'use strict';

var httpProxy = require('http-proxy');
var proxy_http = httpProxy.createProxyServer();
var authenticatedPolicy = require('../middlewares/Authenticated.js');
var routerPolicy = require('../middlewares/RouterPolicy.js');
var path = require("path");
var fs = require("fs");

var cacheManager = require('cache-manager');
var memoryCache = cacheManager.caching({ store: 'memory', max: 2000, ttl: (15 * 60) /*seconds*/, promiseDependency: Promise });

proxy_http.on('proxyRes', function (proxyRes, req, res) {
  //console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
  //console.log(roxyRes.headers['x-frame-options']);
  delete proxyRes.headers['x-frame-options'];
});

var proxy = {};
proxy.get = function () {
  return proxy_http;
};

proxy.cacheToken = {};

proxy.deleteCacheKey = function (data) {
  if (typeof (data.permissions) != 'undefined') {
    console.log("delete cache key ", data.id + "|" + data.permissions[0].id);
    memoryCache.del(data.id + "|" + data.permissions[0].id,
      function (err) {
        if (err)
          console.log("Error delete cache key", err);
      });
  } else {
    console.log("Error deleteCacheKey ", data);
  }
}
// req.data_token.applicationId
// req.data_token.permissionId
proxy.getApplicationData = function (key, data) {
  var models = coreServerApp.global.models['sequelize-postgres'];
  var Application = models.ProxyApplication;
  var Permission = models.AdministrationPermission;
  var Referer = models.AdministrationReferer;

  return new Promise(function (resolve, reject) {
    memoryCache.wrap(key, function () {
      console.log("using database" + key);
      return Application.findOne({
        where: { id: data.applicationId },
        include: [
          {
            model: Permission,
            where: { id: data.permissionId },
            include: [{
              model: Referer,
            }]
          }
        ]
      });
    })
      .then(function (appData) {
        resolve(appData);
      }, function (error) {
        reject(error);
      });
  });
}

proxy.getTokenApp = function (req, res, next) {
  //logger.info("service proxy ");
  // get url origin
  var url_origin = "";
  var host_origin = "";
  _.find(req.rawHeaders, function (value, key) {
    if (value == "Host") {
      host_origin = req.rawHeaders[key + 1];
    };
    if (value == "Referer") {
      url_origin = req.rawHeaders[key + 1];
      return true;
    };
  });
  var domain_name = "";
  //console.log(url_origin);
  if (url_origin != "")
    domain_name = url_origin;
  else if (host_origin != "")
    domain_name = host_origin;
  else
    domain_name = "";

  if (domain_name.match(/^(http|ws|wss|https)/)) {
    var res_match_origin = domain_name.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/g);

    if (typeof (res_match_origin) != 'undefined')
      domain_name = res_match_origin[0];
  }

  domain_name = domain_name.replace(/http:\/\//, "");
  domain_name = domain_name.replace(/https:\/\//, "");
  domain_name = domain_name.replace(/www.\/\//, "");
  //remove port end url
  domain_name = domain_name.split(':')[0];

  // test login via website for intranet or admin
  var test_login_via_proxy = false;
  if (typeof (req.query) != 'undefined') {
    if (typeof (req.query.connexion_without_proxyDP) != 'undefined') {
      test_login_via_proxy = true;
    }
  }

  var tokenPassedByUrl = false;
  //don't use underscore into cookie IE
  if ((typeof req.headers.cookie != 'undefined' || req.query.tokenapp)
    && !(req.headers && req.headers.authorization)
    && (!test_login_via_proxy)) {
    //console.log(JSON.stringify(req.headers));
    var token = "";

    if (typeof req.headers.cookie != 'undefined') {
      var cookie_split = req.headers.cookie.split('; ');
      _.forEach(cookie_split, function (cook, key) {
        if (cook.substr(0, 9) == "tokenapp=") {
          token = cook.replace("tokenapp=", "");
        }
      });
    }

    if (req.query.tokenapp) { // JWT token sent by parameter
      tokenPassedByUrl = true;
      var res_match = req.query.tokenapp.match(/[-0-9a-zA-Z._]*/g);
      token = res_match[0];
    }

    // navigation normal website can continue
    if (token == "") {
      if (req.originalUrl == "/favicon.ico") {
        return res.status(401).json({ "message": "This user doesn't have this access!" });
      }
      else {
        if (next)
          next();
      }
    }
    else {
      //verify iframe token application
      var verify = function verify(error, data_token) {
        if (!(_.isEmpty(error) && data_token !== -1)) {
          return res.status(401).json({ message: 'Given authorization token is not valid' });
        } else {
          // Store user id to req object
          if (typeof (data_token) == 'string')
            req.data_token = JSON.parse(data_token);
          else
            req.data_token = data_token;

          //if( typeof(token.username) != 'undefined')
          //define user var before (because of strict mode)
          //if(typeof(req.data_token.user)=='undefined'){
          //req.user = '';
          //User.findOne(req.data_token.id).then(function (user) {

          //req.user = user; // We delete the token from query and body to not mess with blueprints
          //req.query && delete req.query.token;
          //req.body && delete req.body.token;

          //console.log('User defined: ', req.user);
          //return next();

          //}, function(err){
          //return res.json(401, {message: 'User not found!'});
          //});
          //}

          //  req.dataLinkedToToken= {
          //       "id": 2,
          //       "name": "user-iframe",
          //       "url": "nodetest:1337",
          //       "description": null,
          //       "portalonly": false,
          //       "active": true,
          //       "createdAt": "2018-08-05T19:23:57.830Z",
          //       "updatedAt": "2018-08-05T19:23:57.830Z",
          //       "permissions": [
          //         {
          //           "id": 2,
          //           "name": "access-user-iframe",
          //           "description": null,
          //           "active": null,
          //           "portalonly": false,
          //           "createdAt": "2018-08-05T19:28:42.285Z",
          //           "updatedAt": "2018-08-05T19:28:42.285Z",
          //           "permissionApplication": {
          //             "createdAt": "2018-08-05T19:32:32.359Z",
          //             "updatedAt": "2018-08-05T19:32:32.359Z",
          //             "permissionId": 2,
          //             "applicationId": 2
          //           },
          //           "referers": []
          //         }
          //       ]
          //     };
          // proxy.requestweb(req,res,next, "node",true);


          // get data for this token
          var models = coreServerApp.global.models['sequelize-postgres'];
          var Application = models.ProxyApplication;
          var Permission = models.AdministrationPermission;
          var Referer = models.AdministrationReferer;
          var User = models.AdministrationUser;
          var Role = models.AdministrationRole;

          // console.log("Token ", req.data_token, req.data_token.applicationId + "|" + req.data_token.permissionId);
          var cacheKey = req.data_token.applicationId + "|" + req.data_token.permissionId;
          console.log("cacheKey ", cacheKey);

          proxy.getApplicationData(cacheKey, req.data_token).then(function (applicationData) {

            req.dataLinkedToToken = applicationData;

            // console.log("dataLinkedToToken ", result);
            // if portalonly or user is defined (it connected to the web app proxy) check right
            if (req.dataLinkedToToken != null) {
              if (typeof (req.dataLinkedToToken.permissions) != 'undefined') {
                console.log("check data token ", req.dataLinkedToToken.permissions[0].portalonly, req.userPortal);
                if (req.dataLinkedToToken.permissions[0].portalonly || req.userPortal) {
                  //test user have access to this demo
                  // TODO setup cache
                  User.findAll({
                    raw: true,
                    where: { id: req.userPortal },
                    attributes: [],
                    include: [
                      {
                        model: Role,
                        attributes: [],
                        include: [{
                          attributes: [],
                          model: Permission,
                          include: [{ model: Application, attributes: ["id"] }]
                        }]
                      }
                    ]
                  }).then(function (result) {
                    var project = _.find(result, function (value, key) {
                      if (value["roles.permissions.application.id"] == req.data_token.applicationId) {
                        return true;
                      };
                    });
                    if (typeof (project) == 'undefined')
                      return res.status(401).json({ "message": "This user doesn't have this access!" });
                    else
                      proxy.requestweb(req, res, next, domain_name, tokenPassedByUrl);

                  }, function (error) {
                    return res.status(500).json({ "message": "Error, Request: This user doesn't have this access!" });
                  });

                } else {
                  proxy.requestweb(req, res, next, domain_name, tokenPassedByUrl);
                }
              } else {
                return res.status(500).json({ "message": "Error, Request is linked to a permission!" });
              }
            } else {
              return res.status(500).json({ "message": "Error, Can't find application associated to this token!" });
            }
          }, function (error) {
            return res.status(500).json({ "message": "Error, Request: Get data linked to token!" });
          });

        }
      };

      // Get and verify JWT via service
      try {
        coreServerApp.global.services.Token.verify(token, verify);
      } catch (error) {
        return res.status(401).json({ message: error.message });
      }

    }
  }
  else {
    if (next)
      next();
  }
};

proxy.requestweb = function (req, res, next, domain_name, tokenPassedByUrl) {
  var referer_condition = false;
  if (typeof (req.dataLinkedToToken.permissions[0].referers) != 'undefined') {
    if (req.dataLinkedToToken.permissions[0].referers.length == 0)
      referer_condition = true;
    else {
      _.forEach(req.dataLinkedToToken.permissions[0].referers, function (referer_data, key) {
        if (domain_name == referer_data.dataValues.url) {
          referer_condition = true;
        }
      });
    }
  }
  else {
    referer_condition = true;
  }

  // console.log("Proxy get ", referer_condition ,domain_name, req.userPortal);
  if (referer_condition || domain_name == "" || req.userPortal || true) {
    if (typeof (req.data_token.applicationId) != 'undefined') {

      //if request recursive on proxy server to call application proxy
      if (domain_name == "") {

        //req.query.token = req.query.tokenapp
        //delete req.query.tokenapp;
        //req.originalUrl = req.originalUrl.replace(/tokenapp/g,"token");
        //req.url = req.url.replace(/tokenapp/g,"token");

        if (tokenPassedByUrl) {
          delete req.query.tokenapp;

          if (req.originalUrl.match(/[&]tokenapp=[-0-9a-zA-Z._]*/g)) {
            req.originalUrl = req.originalUrl.replace(/[&]tokenapp=[-0-9a-zA-Z._]*/g, "");
            req.url = req.url.replace(/[&]tokenapp=[-0-9a-zA-Z._]*/g, "");
          }
          else if (req.originalUrl.match(/[?]tokenapp=[-0-9a-zA-Z._]*/g)) {
            req.originalUrl = req.originalUrl.replace(/[?]tokenapp=[-0-9a-zA-Z._]*/g, "");
            req.originalUrl = req.originalUrl.replace(/&/, "?");
            req.url = req.url.replace(/&/, "?");
          }
        }
        // console.log("req.url ", req.url);

        res.set("p3p", "CP=\"IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT\"");
        res.cookie('tokenapp', coreServerApp.global.services.Token.issue(req.data_token), { expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), httpOnly: true });
        var publicRoot = __dirname + '/../../vault';
        var req_origin = req.originalUrl.split('?');
        var fullPath = publicRoot + req_origin[0];

        var rep_project = req.dataLinkedToToken.url.match(/\/.*/);

        if (rep_project[0].substr(rep_project[0].length - 1, rep_project[0].length) != '/')
          rep_project[0] = rep_project[0] + '/';

        // send index.html
        if (req_origin[0] == rep_project[0]) {
          //TODO  test if index.html and index.htm exist
          return res.sendfile('index.html', { root: fullPath });
        }
        // if .css .js ...
        else if (req_origin[0].match(/[.]/)) {
          fs.exists(fullPath, function (exists) {
            if (exists) {
              //return fs.createReadStream(target).pipe(res);
              return res.sendfile(req_origin[0], { root: publicRoot });
            } else {
              return res.send(404);
            }
          });
        }
        // request core api
        else {
          var length_rep_project = rep_project[0].length - 1;
          req.originalUrl = req.originalUrl.substr(length_rep_project, req.originalUrl.length);
          req.url = req.url.substr(length_rep_project, req.url.length);
          return next();
        }
      }
      else {
        res.cookie('tokenapp', coreServerApp.global.services.Token.issue(req.data_token), { expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), httpOnly: true });

        if (!req.dataLinkedToToken.url.match(/^(localhost|127.0.0.1)/)) {
          //req.query.token = req.query.tokenapp
          //delete req.query.tokenapp;
          //req.originalUrl = req.originalUrl.replace(/tokenapp/g,"token");
          //req.url = req.url.replace(/tokenapp/g,"token");

          if (tokenPassedByUrl) {
            delete req.query.tokenapp;
            // console.log("cleanup uri ", req.originalUrl);
            if (req.originalUrl.match(/[&]tokenapp=[-0-9a-zA-Z._]*/g)) {
              req.originalUrl = req.originalUrl.replace(/[&]tokenapp=[-0-9a-zA-Z._]*/g, "");
              req.url = req.url.replace(/[&]tokenapp=[-0-9a-zA-Z._]*/g, "");
            }
            else if (req.originalUrl.match(/[?]tokenapp=[-0-9a-zA-Z._]*/g)) {
              req.originalUrl = req.originalUrl.replace(/[?]tokenapp=[-0-9a-zA-Z._]*/g, "");
              req.originalUrl = req.originalUrl.replace(/&/, "?");
              req.url = req.url.replace(/[?]tokenapp=[-0-9a-zA-Z._]*/g, "");
              req.url = req.url.replace(/&/, "?");
            }
          }
        }
        // console.log("Proxy get ", req );
        // console.log("Proxy get ", req.url );
        coreServerApp.global.services.Proxy.get().web(req, res,
          {
            headers: {
              host: req.dataLinkedToToken.url,
              origin: req.dataLinkedToToken.url
            },
            target: 'http://' + req.dataLinkedToToken.url,
            toProxy: true,
            autoRewrite: true
          }, function (e) {
            // console.log('error proxy ', e);
            return res.status(500).json({ "error": 'Application Unavailable' });
          });
      }
    }
  }
  else {
    return res.status(401).json({ "error": 'Given authorization token is not valid' });
  }
};

proxy.getTokenUser = function (req, res, next) {
  var token_user = "";
  if (typeof req.headers.cookie != 'undefined') {
    var cookie_split = req.headers.cookie.split('; ');
    _.forEach(cookie_split, function (cook, key) {
      if (cook.substr(0, 12) == "tokenportal=") {
        token_user = cook.replace("tokenportal=", "");
      }
    });
  }

  var verify_user = function (error, data_token) {
    if (!(_.isEmpty(error) && data_token !== -1)) {
      // user not defined
      proxy.getTokenApp(req, res, next);
    } else {
      //user use portal
      req.userPortal = data_token;
      proxy.getTokenApp(req, res, next);
    }
  }

  coreServerApp.global.services.Token.verify(token_user, verify_user);
};

proxy.request = function (req, res, next) {
  proxy.getTokenUser(req, res, next);
};

module.exports = proxy;
