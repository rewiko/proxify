exports.create = function () {

  var models = coreServerApp.global.models['sequelize-postgres'];
  var User = models.AdministrationUser;
  var config = coreServerApp.global.config;

  var prom_array = [];
  var admin = function(){
    return User.findOrCreate({where: {username: config.permissions.adminUsername},
    defaults: {
      username: config.permissions.adminUsername,
      password: config.permissions.adminPassword,
      email: config.permissions.adminEmail,
      firstName: "Admin",
      lastName: "Administrator",
      admin: true,
    }
  })
  .spread((user, created) => {
    logger.info(user.get({
      plain: true
    }))
  });
  }
  prom_array.push(admin);

  var user = function () {
    return User.findOrCreate({where: {username: "user"},
      defaults: {
        username: "user",
        password: "user",
        email: "user@localhost.com",
        firstName: "User",
        lastName: "User",
        admin: false,
      }
    })
    .spread((user, created) => {
      logger.info(user.get({
        plain: true
      }))
    });
  }
  prom_array.push(user);

  var userAsAdmin = function () {
    return User.findOrCreate({where: {username: "userAsAdmin"},
      defaults: {
        username: "userAsAdmin",
        password: "userAsAdmin",
        email: "userAsAdmin@localhost.com",
        firstName: "UserAsAdmin",
        lastName: "UserAsAdmin",
        admin: false,
      }
    })
    .spread((user, created) => {
      logger.info(user.get({
        plain: true
      }))
    });
  }
  prom_array.push(userAsAdmin);

  return Promise.map(prom_array, function (promiseFn) {
        return promiseFn(); //make sure that here You return Promise
  }, {concurrency: 1}); //it will run promises sequentially

};
