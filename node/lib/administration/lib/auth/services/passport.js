var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    var User = coreServerApp.gloal.models.AdministrationUser;
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json();
};

passport.isAuthorized = function(req, res, next) {
    var provider = req.path.split('/').slice(-1)[0];

    if (_.find(req.user.tokens, { kind: provider })) {
        next();
    } else {
        res.redirect('/auth/' + provider);
    }
};

passport.use(new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password',
    session: false
}, function(login, password, done) {
    var isEmail = validator.isEmail(login);
    var query = {};
    if (isEmail) {
        query.email = login;
    } else {
        query.username = login;
    }
    var models = coreServerApp.global.models['sequelize-postgres'];
    var User = models.AdministrationUser;
    var Group = models.AdministrationGroup;
    var Role = models.AdministrationRole;

    User.findOne({
      where : query,
      include: [
      { model: Group, include: Role }
      ]
    }).then(function(user) {
        if (!user) {
            return done(null, false, { message : 'Login ' + login + ' not found.' });
        }
        user.validatePassword(password, function(err, isMatch) {
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Invalid email or password.' });
            }
        });
    }, function(err){
        console.log("passport localStrategy", err);

    });
}));

module.exports = passport;
