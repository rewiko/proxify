var requireDirectory = require('require-directory');
var components = {};
components.controllers = requireDirectory(module, './controllers');
components.models = requireDirectory(module, './models');
components.name = "Proxy";

var router = require('express').Router({ mergeParams: true });

coreServerApp.app.use('/', coreServerApp.global.services.Proxy.getTokenApp);


var authentication = global.coreServerApp.global.middlewares.Authenticated;
var policies = global.coreServerApp.global.middlewares.RouterPolicy;

//ROUTES
router.get('/applications', authentication, policies, components.controllers.application.listData);
router.get('/application/:id', authentication, policies, components.controllers.application.getData);
router.post('/application', authentication, policies, components.controllers.application.createData);
router.put('/application/:id', authentication, policies, components.controllers.application.updateData);
router.patch('/application/:id', authentication, policies, components.controllers.application.updateData);
router.delete('/application/:id', authentication, policies, components.controllers.application.deleteData);

components.router = router;
module.exports = components;
