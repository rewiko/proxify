var getData = function (req, res) {
  var models = coreServerApp.global.models['sequelize-postgres'];
  var Referer = models.AdministrationReferer;
  var Permission = models.AdministrationPermission;

  Referer.findOne({
    include: [
      { model: Permission }
    ],
    where: { id: req.params.id }
  }).then(function (referer) {
    if (referer != null) {
      return res.status(200).json({
        meta: { count: 1 },
        data: referer.dataValues
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
  var Referer = models.AdministrationReferer;

  if (typeof (req.body.data) != 'undefined') {
    if (typeof (req.body.data.name) != 'undefined') {
      if (typeof (req.body.data.url) != 'undefined') {
        Referer.create(req.body.data).then(function (referer) {
          if (referer != null) {
            var data = {
              meta: { count: 1 },
              data: referer.dataValues
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
        return res.status(500).json({ "error": "Missing Url field" });
      }
    } else {
      return res.status(500).json({ "error": "Missing Name field" });
    }
  } else {
    return res.status(500).json({ "error": "Missing Payload" });
  }

};

var updateData = function (req, res) {
  var models = coreServerApp.global.models['sequelize-postgres'];
  var Referer = models.AdministrationReferer;

  if (typeof (req.body.data) != 'undefined') {
    Referer.update(req.body.data, {
      where: { id: req.params.id }
    }).then(function (referer) {
      if (referer != null) {
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
  var Referer = models.AdministrationReferer;
  if (typeof (req.params.id) != 'undefined') {
    Referer.destroy({
      where: { id: req.params.id }
    }).then(function (referer) {
      if (referer != null) {
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
  var Referer = models.AdministrationReferer;
  var Permission = models.AdministrationPermission;

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
      if (models.AdministrationReferer.options.sequelize.options.dialect == 'postgres') {
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
        if (tmpOrder.length == 3 && typeof (Referer.associations[tmpOrder[0]]) == 'undefined')
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
    }
  ];

  Referer.findAndCountAll({
    offset: offset,
    limit: limit,
    where: whereQuery,
    distinct: true,
    include: include,
    order: order
  }).then(function (data) {

    return res.status(200).json({
      meta: { offset: offset, limit: limit, count: data.count },
      data: data.rows
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
