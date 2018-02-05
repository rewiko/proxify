var sequelize = require('sequelize');
var description = {
    name: "AdministrationRoute",
    adapter: "sequelize-postgres",
    autoCreatedBy: false,

    description: 'Confers `Permission` to `User`',

    attributes: {
        path: {
            type: sequelize.STRING,
            index: true,
            allowNull: false
        },
        method: {
            type: sequelize.STRING,
            index: true,
            allowNull: false
        },
        uniqpathmethod: {
            type: sequelize.STRING,
            index: true,
            allowNull: false,
            unique: true
        }
    },
    associations: function(models, prefix) {
        models[prefix + "Route"].belongsToMany(models[prefix + "Permission"], {
            through: 'permissionRoute',
            foreignKey: 'routeId'
        });
    },

    options: {
        name:{
            singular: 'route',
            plural: 'routes'
        },
        classMethods: {},
        instanceMethods: {},
        hooks: {}
    }

};

module.exports = description;
