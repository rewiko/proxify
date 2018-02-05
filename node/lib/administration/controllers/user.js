var validator = require('validator');
var getMe = function (req, res) {
  var models = coreServerApp.global.models['sequelize-postgres'];
  var User = models.AdministrationUser;
  var Group = models.AdministrationGroup;
  var Role = models.AdministrationRole;

  if (typeof (req.user) == 'undefined')
    return res.status(500).json({ "error": "Unauthorized" });

  User.findOne({
    include: [
      { model: Group, include : Role }
    ],
    where: { id: req.user.id }
  }).then(function (user) {
    if (user != null) {
      return res.status(200).json({
        meta: { count: 1 },
        data: user.userToJSON()
      });
    } else {
      return res.status(500).json({ "error": "Resource not found" });
    }
  }, function (error) {
    return res.status(500).json({ "error": "Can't fetch data " });
  });
};

var updateMe = function (req, res) {
  var models = coreServerApp.global.models['sequelize-postgres'];
  var User = models.AdministrationUser;
  var Group = models.AdministrationGroup;

  if (typeof (req.user) == 'undefined')
    return res.status(500).json({ "error": "Unauthorized" });

  if (typeof (req.body.data) != 'undefined') {
    User.update(req.body.data, {
      where: { id: req.user.id }
    }).then(function (user) {
      if (user != null) {

        if (typeof (req.body.data.groups) != 'undefined') {
          user.setGroups(_.map(req.body.data.groups, 'id')).then(function (success) {
          }, function (err) {
            return res.status(500).json({ "error": "Error during processing" });
          });
        }

        return res.status(200).json({
          meta: { count: 1 },
          data: { id: req.user.id }
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

var getUser = function (req, res) {
  var models = coreServerApp.global.models['sequelize-postgres'];
  var User = models.AdministrationUser;
  var Group = models.AdministrationGroup;

  User.findOne({
    include: [
      { model: Group }
    ],
    where: { id: req.params.id }
  }).then(function (user) {
    if (user != null) {
      return res.status(200).json({
        meta: { count: 1 },
        data: user.userToJSON()
      });
    } else {
      return res.status(500).json({ "error": "Resource not found" });
    }

  }, function (error) {
    return res.status(500).json({ "error": "Can't fetch data" });
  });
};

var createUser = function (req, res) {
  var models = coreServerApp.global.models['sequelize-postgres'];
  var User = models.AdministrationUser;

  if (typeof (req.body.data) != 'undefined') {
    if (typeof (req.body.data.password) != 'undefined') {
      if (typeof (req.body.data.username) != 'undefined') {
        if (req.body.data.password.length > 7) {
          if (typeof (req.body.data.email) != 'undefined') {
            if (validator.isEmail(req.body.data.email)) {
              User.create(req.body.data).then(function (user) {
                if (user != null) {

                  if (typeof (req.body.data.groups) != 'undefined') {
                    user.setGroups(_.map(req.body.data.groups, 'id')).then(function (success) {
                    }, function (err) {
                      return res.status(500).json({ "error": "Error during processing" });
                    });
                  }

                  var data = {
                    meta: { count: 1 },
                    data: user.userToJSON()
                  };
                  data.token = coreServerApp.global.services.Token.issue(data.data);
                  return res.status(200).json(data);

                } else {
                  return res.status(500).json({ "error": "Resource not found" });
                }

              }, function (error) {
                var errorMessage = "Error:";
                _.forEach(error.errors, function (data, dataKey) {
                  errorMessage += " " + data.message;
                });
                return res.status(500).json({ "error": errorMessage });
              });
            } else {
              return res.status(500).json({ "error": "Email field has a wrong format" });
            }
          } else {
            return res.status(500).json({ "error": "Missing Email field" });
          }
        } else {
          return res.status(500).json({ "error": "Password field to short" });
        }
      } else {
        return res.status(500).json({ "error": "Missing Username field" });
      }
    } else {
      return res.status(500).json({ "error": "Missing Password field" });
    }
  } else {
    return res.status(500).json({ "error": "Missing Payload" });
  }

};

var updateUser = function (req, res) {
  var models = coreServerApp.global.models['sequelize-postgres'];
  var User = models.AdministrationUser;

  if (typeof (req.body.data) != 'undefined') {
    User.update(req.body.data, {
      where: { id: req.params.id }
    }).then(function (user) {
      if (user != null) {

          User.findOne({
            where: { id: req.params.id }
          }).then(function (user) {
            if (user != null) {

              if (typeof (req.body.data.groups) != 'undefined')
                user.setGroups(_.map(req.body.data.groups, 'id'));

            }
          });

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

var deleteUser = function (req, res) {
  var models = coreServerApp.global.models['sequelize-postgres'];
  var User = models.AdministrationUser;
  if (typeof (req.params.id) != 'undefined') {
    User.destroy({
      where: { id: req.params.id }
    }).then(function (user) {
      if (user != null) {
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
  var User = models.AdministrationUser;
  var Group = models.AdministrationGroup;

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
      if (models.AdministrationUser.options.sequelize.options.dialect == 'postgres') {
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
  var order = [['username', 'ASC']];
  if (typeof (req.query.order) != 'undefined') {
    var orderParsingError = false;
    creationOrder = [];
    var orderSplit = req.query.order.split(",");
    _.forEach(orderSplit, function (data, dataKey) {

      var tmpOrder = data.split('|');

      if (tmpOrder.length > 1) {
        if (tmpOrder.length == 3 && typeof (User.associations[tmpOrder[0]]) == 'undefined')
          orderParsingError = true;

        var finalSplit = [];
        _.forEach(tmpOrder, function (data, dataKey) {
          _.forEach(data.split('.'), function (dataLoop, dataKey) {
            finalSplit.push(dataLoop);
          });
        });

        if (finalSplit.length > 2) {
          // [Task, 'createdAt', 'DESC'],
          if (finalSplit[0] == 'group')
            finalSplit[0] = Group;

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
      model: Group,
    }
  ];

  User.findAndCountAll({
    offset: offset,
    limit: limit,
    where: whereQuery,
    distinct: true,
    include: include,
    order: order
  }).then(function (data) {
    _.forEach(data.rows, function (user, userKey) {
      user = user.userToJSON();
    });

    return res.status(200).json({
      meta: { offset: offset, limit: limit, count: data.count },
      data: data.rows
    });
  }, function (error) {
    return res.status(500).json({ "error": "Can't fetch data" });
  });
};

module.exports = {
  users: listData,
  getMe: getMe,
  updateMe: updateMe,
  getUser: getUser,
  createUser: createUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
};
