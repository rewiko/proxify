var routerPolicyProcess = function (req, res, next) {

  if(typeof(req.user) != 'undefined'){

    if(typeof(req.user.id) != 'undefined'){
      var models = coreServerApp.global.models['sequelize-postgres'];
      var Route = models.AdministrationRoute;
      var Permission = models.AdministrationPermission;
      var Role = models.AdministrationRole;
      var User = models.AdministrationUser;
      var Group = models.AdministrationGroup;

      var whereReq = null;
      var methods = Object.getOwnPropertyNames(req.route.methods)[0];
      var pathString = _.toLower(req.baseUrl + req.route.path);

      console.log("PathString ", pathString);
      // remove last / to be in phase with router entries
      if (pathString.substring(pathString.length-1) == "/")
        pathString = pathString.substring(0, pathString.length-1);

      if(methods == '_all'){
        whereReq = { path: pathString };
      }
      else{
        whereReq = { path: pathString, method: methods };
      }

      var groupsID = [];
      groupsID = _.map(req.user.groups, 'id');
      console.log("groupsID: ", groupsID);
      console.log("whereReq: ", whereReq);
      Route.findAll({
        raw: true,
        attributes: ["path","method"],
        where: whereReq,
        include: [ {
          model: Permission,
          as: 'permissions',
          attributes: [],
          include: [ {
            model: Role,
            as: 'roles',
            attributes: [],
            include: [ {
              model: Group,
              as: 'groups',
              where: { id: {'$in' : groupsID } },
              attributes: [],
            } ]
          } ]
        } ]
      }).then(function(route_result){
        logger.debug({"result user final ":req.user});
        logger.debug({"ROUTES length ":route_result});
        if(req.user.admin){
          logger.debug("You are Admin!");
          next();
        }
        else{
          logger.debug({"user" : req.user});
          logger.debug({"route: " : req.route});
          //accessGranted
          if(route_result[0]["permissions.roles.groups.roleGroup.groupId"] != null){
            return next();
          }
          else{
            logger.error("route denied - userId :" + req.user.id + " - route - path : " + req.route.path + "- method: " + methods );
            var data = {"error":"access denied"};
            return res.status(403).send(data);
          }
        }
      }, function(error){
        logger.error('Error RouterPolicy', error);
        return res.status(500).send();
      });
    }
  } else {
    return res.status(500).json({"Router policies -  User not defined":true});
  }
}

module.exports = routerPolicyProcess;
