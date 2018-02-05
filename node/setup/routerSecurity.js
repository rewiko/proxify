const listEndpoints = require('express-list-endpoints')

exports.run = function(app) {
  return new Promise(function (resolve, reject) {
    logger.info("ROUTES: ");
    var endpoints = listEndpoints(app);
    logger.info(endpoints);
    logger.info("Begin import routes");
    var Route = coreServerApp.global.models['sequelize-postgres'].AdministrationRoute;
    var array_route = [];
    _.forEach(endpoints, function(n, key) {

      if(n.methods.length > 0) {
        var method = n.methods[0].toLowerCase();
        logger.info("method " + method);

        array_route.push(Route.findOrCreate({ where: { path: n.path,  method: method, uniqpathmethod:n.path+method }, defaults:{ path: n.path,  method: method, uniqpathmethod:n.path+method } })
            .spread(function(err, routes) {}));
      }
    });

    Promise.all(array_route).then(function(promiseResult){
      logger.info("End import routes");
      resolve(true);
    }, function(error){
      logger.error("Error import routes" + error);
    });
  });
};
