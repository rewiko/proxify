exports.data = function () {
    var application_to_create = [
        { where: { name: 'user-webapp', url: 'user.website.io' } },
        { where: { name: 'user-iframe', url: 'nodetest:1337' } },
        { where: { name: 'user-mock', url: 'mocks:8080' } },
        { where: { name: 'user-vuejs', url: 'vuejs:3333' } },
    ];
    if (process.env.NODE_ENV == "test") {
        application_to_create = application_to_create.concat([
        { where: { name: 'user-mockb', url: 'mocks:8080' } },
        { where: { name: 'user-mockc', url: 'mocks:8080' } },
        { where: { name: 'user-mockd', url: 'mocks:8080' } },
        { where: { name: 'user-mocke', url: 'mocks:8080' } },
        { where: { name: 'user-mockf', url: 'mocks:8080' } },
        { where: { name: 'user-mockg', url: 'mocks:8080' } },
        { where: { name: 'user-mockh', url: 'mocks:8080' } },
        { where: { name: 'user-mocki', url: 'mocks:8080' } },
        { where: { name: 'user-mockl', url: 'mocks:8080' } },
        { where: { name: 'user-mockm', url: 'mocks:8080' } },
        ]);
    }

    var application_to_permission = [
        { where_join: { name: 'user-webapp' }, join: "setApplication", where: { portalonly: true, name: "access-user-webapp" } },
        { where_join: { name: 'user-iframe' }, join: "setApplication", where: { portalonly: false, name: "access-user-iframe" } },
        { where_join: { name: 'user-mock' }, join: "setApplication", where: { portalonly: false, name: "access-user-mock" } },
        { where_join: { name: 'user-vuejs' }, join: "setApplication", where: { portalonly: false, name: "access-user-vuejs" } },
    ];

    if (process.env.NODE_ENV == "test") {
        application_to_permission = application_to_permission.concat([
        { where_join: { name: 'user-mockb' }, join: "setApplication", where: { portalonly: false, name: "access-user-mockb" } },
        { where_join: { name: 'user-mockc' }, join: "setApplication", where: { portalonly: false, name: "access-user-mockc" } },
        { where_join: { name: 'user-mockd' }, join: "setApplication", where: { portalonly: false, name: "access-user-mockd" } },
        { where_join: { name: 'user-mocke' }, join: "setApplication", where: { portalonly: false, name: "access-user-mocke" } },
        { where_join: { name: 'user-mockf' }, join: "setApplication", where: { portalonly: false, name: "access-user-mockf" } },
        { where_join: { name: 'user-mockg' }, join: "setApplication", where: { portalonly: false, name: "access-user-mockg" } },
        { where_join: { name: 'user-mockh' }, join: "setApplication", where: { portalonly: false, name: "access-user-mockh" } },
        { where_join: { name: 'user-mocki' }, join: "setApplication", where: { portalonly: false, name: "access-user-mocki" } },
        { where_join: { name: 'user-mockl' }, join: "setApplication", where: { portalonly: false, name: "access-user-mockl" } },
        { where_join: { name: 'user-mockm' }, join: "setApplication", where: { portalonly: false, name: "access-user-mockj" } },
        ]);
    }

    var referer_to_permission = [
        { where_join: { name: 'access-user-iframe' }, join: "addPermission", where: { name: "user.website.io", url: "user.website.io" } },
        { where_join: { name: 'access-user-iframe' }, join: "addPermission", where: { name: "nodetest", url: "nodetest" } },
        { where_join: { name: 'access-user-mock' }, join: "addPermission", where: { name: "mocks", url: "mocks" } },
    ];

    var role_to_create = [
        { where: { name: 'Admin' } },
        { where: { name: 'User' } },
        { where: { name: 'Manager' } },
    ];

    if (process.env.NODE_ENV == "test") {
        role_to_create = role_to_create.concat([
            { where: { name: 'Mocka' } },
            { where: { name: 'Mockb' } },
            { where: { name: 'Mockc' } },
            { where: { name: 'Mockd' } },
            { where: { name: 'Mocke' } },
            { where: { name: 'Mockf' } },
            { where: { name: 'Mockg' } },
            { where: { name: 'Mockh' } },
            { where: { name: 'Mocki' } },
            { where: { name: 'Mockj' } },
        ]);
    }

    var permission_to_create = [
        { where_join: { name: 'User' }, join: "addRoles", where: { name: "access-user-iframe" } },
        { where_join: { name: 'User' }, join: "addRoles", where: { name: "get-user" } },
        { where_join: { name: 'User' }, join: "addRoles", where: { name: "access-user-mock" } },
        { where_join: { name: 'User' }, join: "addRoles", where: { name: "access-user-webapp" } },
        { where_join: { name: 'User' }, join: "addRoles", where: { name: "update-me" } },
        { where_join: { name: 'User' }, join: "addRoles", where: { name: "view-permission" } },
        { where_join: { name: 'User' }, join: "addRoles", where: { name: "create-project" } },
        { where_join: { name: 'User' }, join: "addRoles", where: { name: "modify-project" } },
        { where_join: { name: 'User' }, join: "addRoles", where: { name: "view-project" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "view-project" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "delete-project" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "update-project" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "create-project" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "view-permission" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "get-user" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "delete-permission" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "update-permission" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "create-permission" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "view-route" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "delete-route" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "update-route" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "create-route" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "view-role" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "delete-role" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "update-role" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "create-role" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "view-group" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "delete-group" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "update-group" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "create-group" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "view-user" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "delete-user" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "update-user" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "create-user" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "update-me" } },
    ];

    if (process.env.NODE_ENV == "test") {
        permission_to_create = permission_to_create.concat([
        { where_join: { name: 'User' }, join: "addRoles", where: { name: "test-admin" } },
        ]);
    }

    var routes_to_permission = [
        //{  where_join:  { name: 'test-admin'}, join: "setPermissions" , where: {path:'/admin', method:'post'}},
        //{  where_join:  { name: 'test-admin'}, join: "setPermissions" , where: {path:'/admin/:type(users|roles|groups)', method:'post'}},
        { where_join: { name: 'view-project' }, join: "addPermission", where: { path: '/proxy/applications', method: 'get' } },
        { where_join: { name: 'view-project' }, join: "addPermission", where: { path: '/proxy/application/:id', method: 'get' } },
        { where_join: { name: 'view-project' }, join: "addPermission", where: { path: '/admin/permission/:id', method: 'get' } },
        { where_join: { name: 'delete-project' }, join: "addPermission", where: { path: '/proxy/application/:id', method: 'delete' } },
        { where_join: { name: 'view-permission' }, join: "addPermission", where: { path: '/admin/permissions', method: 'get' } },
        { where_join: { name: 'update-project' }, join: "addPermission", where: { path: '/proxy/application/:id', method: 'put' } },
        { where_join: { name: 'create-project' }, join: "addPermission", where: { path: '/proxy/application', method: 'post' } },
        { where_join: { name: 'get-user' }, join: "addPermission", where: { path: '/admin/user/me', method: 'get' } },
        { where_join: { name: 'view-permission' }, join: "addPermission", where: { path: '/admin/permission/:id', method: 'get' } },
        { where_join: { name: 'delete-permission' }, join: "addPermission", where: { path: '/admin/permission/:id', method: 'delete' } },
        { where_join: { name: 'update-permission' }, join: "addPermission", where: { path: '/admin/permission/:id', method: 'put' } },
        { where_join: { name: 'create-permission' }, join: "addPermission", where: { path: '/admin/permission', method: 'post' } },
        { where_join: { name: 'view-route' }, join: "addPermission", where: { path: '/admin/routes', method: 'get' } },
        { where_join: { name: 'view-route' }, join: "addPermission", where: { path: '/admin/route/:id', method: 'get' } },
        { where_join: { name: 'delete-route' }, join: "addPermission", where: { path: '/admin/route/:id', method: 'delete' } },
        { where_join: { name: 'update-route' }, join: "addPermission", where: { path: '/admin/route/:id', method: 'put' } },
        { where_join: { name: 'create-route' }, join: "addPermission", where: { path: '/admin/route', method: 'post' } },
        { where_join: { name: 'view-role' }, join: "addPermission", where: { path: '/admin/roles', method: 'get' } },
        { where_join: { name: 'view-role' }, join: "addPermission", where: { path: '/admin/role/:id', method: 'get' } },
        { where_join: { name: 'delete-role' }, join: "addPermission", where: { path: '/admin/role/:id', method: 'delete' } },
        { where_join: { name: 'update-role' }, join: "addPermission", where: { path: '/admin/role/:id', method: 'put' } },
        { where_join: { name: 'create-role' }, join: "addPermission", where: { path: '/admin/role', method: 'post' } },
        { where_join: { name: 'view-group' }, join: "addPermission", where: { path: '/admin/groups', method: 'get' } },
        { where_join: { name: 'view-group' }, join: "addPermission", where: { path: '/admin/group/:id', method: 'get' } },
        { where_join: { name: 'delete-group' }, join: "addPermission", where: { path: '/admin/group/:id', method: 'delete' } },
        { where_join: { name: 'update-group' }, join: "addPermission", where: { path: '/admin/group/:id', method: 'put' } },
        { where_join: { name: 'create-group' }, join: "addPermission", where: { path: '/admin/group', method: 'post' } },
        { where_join: { name: 'view-user' }, join: "addPermission", where: { path: '/admin/users', method: 'get' } },
        { where_join: { name: 'view-user' }, join: "addPermission", where: { path: '/admin/user/:id', method: 'get' } },
        { where_join: { name: 'delete-user' }, join: "addPermission", where: { path: '/admin/user/:id', method: 'delete' } },
        { where_join: { name: 'update-user' }, join: "addPermission", where: { path: '/admin/user/:id', method: 'put' } },
        { where_join: { name: 'create-user' }, join: "addPermission", where: { path: '/admin/user', method: 'post' } },
        { where_join: { name: 'update-me' }, join: "addPermission", where: { path: '/admin/user/me', method: 'put' } },
    ];

    if (process.env.NODE_ENV == "test") {
        routes_to_permission = routes_to_permission.concat([
        { where_join: { name: 'test-admin' }, join: "addPermission", where: { path: '/private/authpolicies', method: 'get' } },
        { where_join: { name: 'test-admin' }, join: "addPermission", where: { path: '/admin/user/me', method: 'get' } },
        { where_join: { name: 'test-admin' }, join: "addPermission", where: { path: '/admin/user/me', method: 'put' } },
        ]);
    }

    var group_to_role = [
        { where_join: { name: 'User' }, join: "addRoles", where: { name: "Group-User" } },
        { where_join: { name: 'Admin' }, join: "addRoles", where: { name: "Group-Admin" } },
    ];

    var group_to_create = [
        { where: { name: "Group-User" } },
        { where: { name: "Group-Admin" } },
    ];
    if (process.env.NODE_ENV == "test") {
        group_to_create = group_to_create.concat([
            { where: { name: "Group-Mocka" } },
            { where: { name: "Group-Mockb" } },
            { where: { name: "Group-Mockc" } },
            { where: { name: "Group-Mockd" } },
            { where: { name: "Group-Mocke" } },
            { where: { name: "Group-Mockf" } },
            { where: { name: "Group-Mockg" } },
            { where: { name: "Group-Mockh" } },
            { where: { name: "Group-Mocki" } },
            { where: { name: "Group-Mockj" } },
        ]);
    }

    var group_to_user = [
        { where_join: { username: 'user' }, join: "addUsers", where: { name: "Group-User" } },
        { where_join: { username: 'userAsAdmin' }, join: "addUsers", where: { name: "Group-Admin" } },
    ];

    var language_to_create = [
        { where: { name: "UserTranslate", translationKey: 'en' } },
        { where: { name: "HelloTranslate", translationKey: 'en' } },
    ];

    var user_to_create = [];

    if (process.env.NODE_ENV == "test") {
        user_to_create = _.merge(user_to_create, [
            { where: { username: "User-a", email: "usera@user.com", password: "testtest" } },
            { where: { username: "User-b", email: "userb@user.com", password: "testtest" } },
            { where: { username: "User-c", email: "userc@user.com", password: "testtest" } },
            { where: { username: "User-d", email: "userd@user.com", password: "testtest" } },
            { where: { username: "User-e", email: "usere@user.com", password: "testtest" } },
            { where: { username: "User-f", email: "userf@user.com", password: "testtest" } },
            { where: { username: "User-g", email: "userg@user.com", password: "testtest" } },
            { where: { username: "User-h", email: "userh@user.com", password: "testtest" } },
            { where: { username: "User-i", email: "useri@user.com", password: "testtest" } },
            { where: { username: "User-j", email: "userj@user.com", password: "testtest" } },
            { where: { username: "User-k", email: "userk@user.com", password: "testtest" } },
        ]);
    }

    var models = coreServerApp.global.models['sequelize-postgres'];
    var Route = models.AdministrationRoute;
    var Permission = models.AdministrationPermission;
    var Role = models.AdministrationRole;
    var User = models.AdministrationUser;
    var Group = models.AdministrationGroup;
    var Referer = models.AdministrationReferer;
    var Language = models.AdministrationLanguage;
    var Application = models.ProxyApplication;
    return [
        { modelToCreate: Application, modelToJoin: null, data: application_to_create },
        { modelToCreate: Permission, modelToJoin: Application, data: application_to_permission },
        { modelToCreate: Referer, modelToJoin: Permission, data: referer_to_permission },
        { modelToCreate: Role, modelToJoin: null, data: role_to_create },
        { modelToCreate: Permission, modelToJoin: Role, data: permission_to_create },
        { modelToCreate: Route, modelToJoin: Permission, data: routes_to_permission },
        { modelToCreate: Group, modelToJoin: Role, data: group_to_role },
        { modelToCreate: Group, modelToJoin: null, data: group_to_create },
        { modelToCreate: Language, modelToJoin: null, data: language_to_create },
        { modelToCreate: Group, modelToJoin: User, data: group_to_user },
        { modelToCreate: User, modelToJoin: null, data: user_to_create },
    ];
};
