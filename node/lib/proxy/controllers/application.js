var getData = function (req, res) {
  var models = coreServerApp.global.models['sequelize-postgres'];
  var Application = models.ProxyApplication;
  var Permission = models.AdministrationPermission;
  var Token = coreServerApp.global.services.Token;

  Application.findOne({
    include: [
      { model: Permission }
    ],
    where: { id: req.params.id }
  }).then(function (application) {
    if (application != null) {
      application.dataValues.token = Token.generateTokenProxy(application.dataValues);
      return res.status(200).json({
        meta: { count: 1 },
        data: application.dataValues
      });
    } else {
      return res.status(500).json({ "error": "Resource not found" });
    }

  }, function (error) {
    return res.status(500).json({ "error": "Can't fetch data" });
  });
};

var createData = function (req, res) {
  var models = coreServerApp.global.models['sequelize-postgres'];
  var Application = models.ProxyApplication;
  var Permission = models.AdministrationPermission;

  if (typeof (req.body.data) != 'undefined') {
    if (typeof (req.body.data.name) != 'undefined') {
      Application.create(req.body.data).then(function (application) {
        if (application != null) {
          if (typeof (req.body.data.permissions) != 'undefined') {
            application.setPermissions(_.map(req.body.data.permissions, 'id')).then(function (success) {
            }, function (err) {
              return res.status(500).json({ "error": "Error during processing" });
            });
          }
          var data = {
            meta: { count: 1 },
            data: application.dataValues
          };
          return res.status(200).json(data);
        } else {
          return res.status(500).json({ "error": "Error during processing" });
        }
      }, function (error) {
        var errorMessage = "Error:";
        _.forEach(error.errors, function (data, dataKey) {
          errorMessage += " " + data.message;
        });
        return res.status(500).json({ "error": errorMessage });
      });
    } else {
      return res.status(500).json({ "error": "Missing Name field" });
    }
  } else {
    return res.status(500).json({ "error": "Missing Payload" });
  }

};

// var updateApplicationLink = function (req, application) {
//   var models = coreServerApp.global.models['sequelize-postgres'];
//   var Permission = models.AdministrationPermission;
//   var prom = [];
//   if (req.body.data.permissions) {

//     _.forEach(req.body.data.permissions, function (value, key) {
//       console.log("debug add application ", value, key);

//       prom.push(
//         new Promise(function (resolve, reject) {
//           return Permission.findOne({
//             where: { id: value.id }
//           }).then(function (permission) {
//             if (permission != null) {
//               console.log("passed ", application);
//               permission.setApplication(application.dataValues.id).then(function (res) {
//                 resolve(true);
//               }, function (err) {
//                 reject(err);
//               });
//             } else {
//               reject("Permission not found");
//             }
//           }).catch((reason) => {
//             console.log('Handle rejected promise (' + reason + ') here.');
//           })
//         })
//       );
//     });
//   }

//   return prom;
// };

var updateData = function (req, res) {
  var models = coreServerApp.global.models['sequelize-postgres'];
  var Application = models.ProxyApplication;
  var Permission = models.AdministrationPermission;

  if (typeof (req.body.data) != 'undefined') {
    Application.update(req.body.data, {
      where: { id: req.params.id }
    }).then(function (application) {
      if (application != null) {
        // delete cache value
        Application.findOne({
          include: [
            { model: Permission }
          ],
          where: { id: req.params.id }
        }).then(function (application) {
          if (typeof (req.body.data.permissions) != 'undefined')
            application.setPermissions(_.map(req.body.data.permissions, 'id'));

          coreServerApp.global.services.Proxy.deleteCacheKey(application.dataValues);

          return res.status(200).json({
            meta: { count: 1 },
            data: { id: req.params.id }
          });
        }, function (err) {
          return res.status(500).json({ "error": "Error during processing" });
        });

      } else {
        return res.status(500).json({ "error": "Resource not found" });
      }

    }, function (error) {
      return res.status(500).json({ "error": "Can't fetch data" });
    });
  } else {
    return res.status(500).json({ "error": "Missing Payload" });
  }

};

var deleteData = function (req, res) {
  var models = coreServerApp.global.models['sequelize-postgres'];
  var Application = models.ProxyApplication;
  if (typeof (req.params.id) != 'undefined') {
    Application.destroy({
      where: { id: req.params.id }
    }).then(function (application) {
      if (application != null) {
        return res.status(200).json({
          meta: { count: 1 },
          data: { id: req.params.id }
        });
      } else {
        return res.status(500).json({ "error": "Resource not found" });
      }
    }, function (error) {
      return res.status(500).json({ "error": "Can't fetch data" });
    });
  } else {
    return res.status(500).json({ "error": "Missing Payload" });
  }
};

var listData = function (req, res) {
  var models = coreServerApp.global.models['sequelize-postgres'];
  var Role = models.AdministrationRole;
  var Group = models.AdministrationGroup;
  var User = models.AdministrationUser;
  var Permission = models.AdministrationPermission;
  var Application = models.ProxyApplication;
  var Token = coreServerApp.global.services.Token;

  var limit = 10;
  if (typeof (req.query.limit) != 'undefined') {
    // validator int
    limit = parseInt(req.query.limit);
  }
  var offset = 0;
  if (typeof (req.query.offset) != 'undefined') {
    // validator int
    offset = parseInt(req.query.offset);
  }
  var filter = {};
  var whereQuery = {};
  if (typeof (req.query.filter) != 'undefined') {
    if (req.query.filter != '') {
      // validator int
      var likeOp = null;
      if (models.ProxyApplication.options.sequelize.options.dialect == 'postgres') {
        // search with case insensitive on postgres
        likeOp = SeqOp.iLike;
      } else {
        likeOp = SeqOp.like;
      }

      filter = JSON.parse(req.query.filter);

      _.forEach(filter, function (data, key) {
        whereQuery[key] = {
          [likeOp]: '%' + data + '%'
        };
      });
    }
  }


  // var order = [[Permission.associations['users'], 'username', 'DESC']];
  var order = [['name', 'ASC']];
  if (typeof (req.query.order) != 'undefined') {
    var orderParsingError = false;
    creationOrder = [];
    var orderSplit = req.query.order.split(",");
    _.forEach(orderSplit, function (data, dataKey) {

      var tmpOrder = data.split('|');

      if (tmpOrder.length > 1) {
        if (tmpOrder.length == 3 && typeof (Permission.associations[tmpOrder[0]]) == 'undefined')
          orderParsingError = true;

        var finalSplit = [];
        _.forEach(tmpOrder, function (data, dataKey) {
          _.forEach(data.split('.'), function (dataLoop, dataKey) {
            finalSplit.push(dataLoop);
          });
        });

        if (finalSplit.length > 2) {
          // [Task, 'createdAt', 'DESC'],
          if (finalSplit[0] == 'permission')
            finalSplit[0] = Permission;

          console.log("Final Split ", finalSplit);

          creationOrder.push(finalSplit);
        } else {
          creationOrder.push(tmpOrder);
        }
      }
    });

    if (orderParsingError)
      return res.status(500).json({ "error": "Problem with parsing ordering" });

    if (creationOrder.length > 0)
      order = creationOrder;
  }

  var include = [
    {
      model: Permission,
      include: [
        {
          model: Role,
          include: [
            {
              model: Group,
              include: [
                {
                  model: User
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  var preQuery = [];

  if (!req.user.admin) {
    var groupsID = _.map(req.user.groups, 'id');
    preQuery.push(Group.findAll({
      include: [
        {
          model: Role,
          include: [
            {
              model: Permission,
              include: [
                { model: Application }
              ]
            }
          ]
        }
      ],
      where : { id : { '$in': groupsID } }
    }));
  }

  Promise.all(preQuery).then(function(promiseResult){

    if(promiseResult.length > 0){

      var applicationsID = [];
      var hasRoleAdmin = false;
      _.forEach(promiseResult[0], function (group, groupKey) {
        _.forEach(group.roles, function (role, roleKey) {
          if(role.name == "Admin")
            hasRoleAdmin = true;

          _.forEach(role.permissions, function (permission, permissionKey) {
            if(permission.application)
              applicationsID = _.union(applicationsID, [permission.application.id]);
          });
        });
      });

      if(!hasRoleAdmin)
        whereQuery['id'] = { '$in': applicationsID };
    }

    Application.findAndCountAll({
      offset: offset,
      limit: limit,
      where: whereQuery,
      distinct: true,
      include: include,
      order: order
    }).then(function (apps) {
      _.forEach(apps.rows, function (app, appKey) {
        if (app.dataValues.permissions.length > 0)
          app.dataValues.token = Token.generateTokenProxy({
            applicationId: app.dataValues.id,
            id: app.dataValues.permissions[0].id
          });
      });

      return res.status(200).json({
        meta: { offset: offset, limit: limit, count: apps.count },
        data: apps.rows
      });
    }, function (error) {
      return res.status(500).json({ "error": "Can't fetch data" });
    });

  }, function(error){
    return res.status(500).json({ "error": "Can't fetch data" });
  });
};

module.exports = {
  listData: listData,
  getData: getData,
  createData: createData,
  updateData: updateData,
  deleteData: deleteData,
};
