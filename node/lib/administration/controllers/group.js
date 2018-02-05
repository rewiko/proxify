var getData = function (req, res) {
  var models = coreServerApp.global.models['sequelize-postgres'];
  var User = models.AdministrationUser;
  var Role = models.AdministrationRole;
  var Group = models.AdministrationGroup;

  Group.findOne({
    include: [
      { model: User },
      { model: Role }
    ],
    where: { id: req.params.id }
  }).then(function (group) {
    if (group != null) {
      return res.status(200).json({
        meta: { count: 1 },
        data: group.dataValues
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
  var Group = models.AdministrationGroup;

  if (typeof (req.body.data) != 'undefined') {
    if (typeof (req.body.data.name) != 'undefined') {
      Group.create(req.body.data).then(function (group) {
        if (group != null) {

          if (typeof (req.body.data.roles) != 'undefined') {
            group.setRoles(_.map(req.body.data.roles, 'id')).then(function (success) {
            }, function (err) {
              return res.status(500).json({ "error": "Error during processing" });
            });
          }

          if (typeof (req.body.data.users) != 'undefined') {
            group.setUsers(_.map(req.body.data.users, 'id')).then(function (success) {
            }, function (err) {
              return res.status(500).json({ "error": "Error during processing" });
            });
          }

          var data = {
            meta: { count: 1 },
            data: group.dataValues
          };
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
      return res.status(500).json({ "error": "Missing Name field" });
    }
  } else {
    return res.status(500).json({ "error": "Missing Payload" });
  }

};

var updateData = function (req, res) {
  var models = coreServerApp.global.models['sequelize-postgres'];
  var Group = models.AdministrationGroup;

  if (typeof (req.body.data) != 'undefined') {
    Group.update(req.body.data, {
      where: { id: req.params.id }
    }).then(function (group) {
      if (group != null) {

          Group.findOne({
            where: { id: req.params.id }
          }).then(function (group) {
            if (group != null) {

              if (typeof (req.body.data.roles) != 'undefined')
                group.setRoles(_.map(req.body.data.roles, 'id'));

              if (typeof (req.body.data.users) != 'undefined')
                group.setUsers(_.map(req.body.data.users, 'id'));

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

var deleteData = function (req, res) {
  var models = coreServerApp.global.models['sequelize-postgres'];
  var Group = models.AdministrationGroup;
  if (typeof (req.params.id) != 'undefined') {
    Group.destroy({
      where: { id: req.params.id }
    }).then(function (group) {
      if (group != null) {
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
  var Group = models.AdministrationGroup;
  var User = models.AdministrationUser;
  var Role = models.AdministrationRole;

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
      if (models.AdministrationGroup.options.sequelize.options.dialect == 'postgres') {
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
        if (tmpOrder.length == 3 && typeof (Group.associations[tmpOrder[0]]) == 'undefined')
          orderParsingError = true;

        var finalSplit = [];
        _.forEach(tmpOrder, function (data, dataKey) {
          _.forEach(data.split('.'), function (dataLoop, dataKey) {
            finalSplit.push(dataLoop);
          });
        });

        if (finalSplit.length > 2) {
          // [Task, 'createdAt', 'DESC'],
          if (finalSplit[0] == 'user')
            finalSplit[0] = User;

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
      model: User,
    },
    {
      model: Role,
    }
  ];

  Group.findAndCountAll({
    offset: offset,
    limit: limit,
    where: whereQuery,
    distinct: true,
    include: include,
    order: order
  }).then(function (groups) {

    return res.status(200).json({
      meta: { offset: offset, limit: limit, count: groups.count },
      data: groups.rows
    });
  }, function (error) {
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
