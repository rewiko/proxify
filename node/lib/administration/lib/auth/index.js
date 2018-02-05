var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var requireDirectory = require('require-directory');
var components = {};
components.controllers = requireDirectory(module, './controllers');
components.models = requireDirectory(module, './models');
components.name = "Auth";

var router = require('express').Router({ mergeParams: true });

coreServerApp.app.use(passport.initialize());

//ROUTES
router.post('/login', components.controllers.index.login);
router.post('/signup', components.controllers.index.signup);
//router.get('/logout', userController.logout);
//router.get('/forgot', userController.getForgot);
//router.post('/forgot', userController.postForgot);
//router.get('/reset/:token', userController.getReset);
//router.post('/reset/:token', userController.postReset);
//router.get('/contact', contactController.getContact);
//router.post('/contact', contactController.postContact);
//router.get('/account', passportConfig.isAuthenticated, userController.getAccount);
//router.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
//router.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
//router.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
//router.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

components.router = router;
module.exports = components;
