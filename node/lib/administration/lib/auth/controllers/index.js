var passport = require('../services/passport');

var login = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: info });
    }

    var data = user.userToJSON();
    var cloneData = _.cloneDeep(data);
    // avoid big JWT
    delete cloneData.groups;
    data.token = coreServerApp.global.services.Token.issue(cloneData);
    res.status(200).json(data);
  })(req, res, next);
};

var signup = function(req, res, next) {
  var createUser =  require('../../../controllers/user.js').createUser;

  req.body.data = req.body;
  return createUser(req, res);
};

module.exports = {
  login: login,
  signup: signup
};
