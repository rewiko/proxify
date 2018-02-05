var requireDirectory = require('require-directory');
var components = {};
components.controllers = requireDirectory(module, './controllers');
components.models = requireDirectory(module, './models');
components.name = "Administration";

var router = require('express').Router({ mergeParams: true });

var authentication = global.coreServerApp.global.middlewares.Authenticated;
var policies = global.coreServerApp.global.middlewares.RouterPolicy;

//ROUTES
//router.post('/', authentication, policies, authentication, policies, components.controllers.user.user);
router.get('/users', authentication, policies, components.controllers.user.users);
router.get('/user/me', authentication, policies, components.controllers.user.getMe);
router.put('/user/me', authentication, policies, components.controllers.user.updateMe);
router.get('/user/:id', authentication, policies, components.controllers.user.getUser);
router.post('/user', authentication, policies, components.controllers.user.createUser);
router.put('/user/:id', authentication, policies, components.controllers.user.updateUser);
router.patch('/user/:id', authentication, policies, components.controllers.user.updateUser);
router.delete('/user/:id', authentication, policies, components.controllers.user.deleteUser);

router.get('/groups', authentication, policies, components.controllers.group.listData);
router.get('/group/:id', authentication, policies, components.controllers.group.getData);
router.post('/group', authentication, policies, components.controllers.group.createData);
router.put('/group/:id', authentication, policies, components.controllers.group.updateData);
router.patch('/group/:id', authentication, policies, components.controllers.group.updateData);
router.delete('/group/:id', authentication, policies, components.controllers.group.deleteData);

router.get('/permissions', authentication, policies, components.controllers.permission.listData);
router.get('/permission/:id', authentication, policies, components.controllers.permission.getData);
router.post('/permission', authentication, policies, components.controllers.permission.createData);
router.put('/permission/:id', authentication, policies, components.controllers.permission.updateData);
router.patch('/permission/:id', authentication, policies, components.controllers.permission.updateData);
router.delete('/permission/:id', authentication, policies, components.controllers.permission.deleteData);

router.get('/roles', authentication, policies, components.controllers.role.listData);
router.get('/role/:id', authentication, policies, components.controllers.role.getData);
router.post('/role', authentication, policies, components.controllers.role.createData);
router.put('/role/:id', authentication, policies, components.controllers.role.updateData);
router.patch('/role/:id', authentication, policies, components.controllers.role.updateData);
router.delete('/role/:id', authentication, policies, components.controllers.role.deleteData);

router.get('/routes', authentication, policies, components.controllers.route.listData);
router.get('/route/:id', authentication, policies, components.controllers.route.getData);
router.post('/route', authentication, policies, components.controllers.route.createData);
router.put('/route/:id', authentication, policies, components.controllers.route.updateData);
router.patch('/route/:id', authentication, policies, components.controllers.route.updateData);
router.delete('/route/:id', authentication, policies, components.controllers.route.deleteData);

router.get('/referers', authentication, policies, components.controllers.referer.listData);
router.get('/referer/:id', authentication, policies, components.controllers.referer.getData);
router.post('/referer', authentication, policies, components.controllers.referer.createData);
router.put('/referer/:id', authentication, policies, components.controllers.referer.updateData);
router.patch('/referer/:id', authentication, policies, components.controllers.referer.updateData);
router.delete('/referer/:id', authentication, policies, components.controllers.referer.deleteData);

router.get('/languages', authentication, policies, components.controllers.language.listData);
router.get('/language/:id', authentication, policies, components.controllers.language.getData);
router.post('/language', authentication, policies, components.controllers.language.createData);
router.put('/language/:id', authentication, policies, components.controllers.language.updateData);
router.patch('/language/:id', authentication, policies, components.controllers.language.updateData);
router.delete('/language/:id', authentication, policies, components.controllers.language.deleteData);

//router.get("/:type(users|roles|groups)", authentication, policies, components.controllers.user.user);
//router.get("/:type(users|roles|groups)/:id", authentication, policies, components.controllers.user.user);
//router.post("/:type(users|roles|groups)", authentication, policies, components.controllers.user.user);
//router.patch("/:type(users|roles|groups)/:id", authentication, policies, components.controllers.user.user);
//router.put("/:type(users|roles|groups)/:id", authentication, policies, components.controllers.user.user);
//router.delete("/:type(users|roles|groups)/:id", authentication, policies, components.controllers.user.user);

// Add routes for adding to, removing from, or updating resource relationships
//router.get("/:type(users|roles|groups)/:id/:relationship", authentication, policies, components.controllers.user.user);
//router.get("/:type(users|roles|groups)/:id/relationships/:relationship", authentication, policies, components.controllers.user.user);
//router.post("/:type(users|roles|groups)/:id/relationships/:relationship", authentication, policies, components.controllers.user.user);
//router.patch("/:type(users|roles|groups)/:id/relationships/:relationship", authentication, policies, components.controllers.user.user);
//router.put("/:type(users|roles|groups)/:id/relationships/:relationship", authentication, policies, components.controllers.user.user);
//router.delete("/:type(users|roles|groups)/:id/relationships/:relationship", authentication, policies, components.controllers.user.user);


components.modules = [
    { path: '/auth', modules: require('./lib/auth') },
];

components.modules.forEach(function (item) {
    router.use(item.path, item.modules.router); // attach to sub-route
});

components.router = router;
module.exports = components;
