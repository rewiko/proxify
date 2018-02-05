var sequelize = require('sequelize');
var description = {
    name: "AdministrationPermission",
    adapter: "sequelize-postgres",
    autoCreatedBy: false,

    description: 'Confers `Permission` to `Role`',

    attributes: {
        //expiration
        // ip server ..
        // referer

        name: {
            type: sequelize.STRING,
            index: true,
            allowNull: false,
            unique: true
        },

        description: {
            type: sequelize.STRING,
            defaults: ""
        },

        active: {
            type: sequelize.BOOLEAN,
            defaultsTo: true,
            index: true
        },

        portalonly: {
            type: sequelize.BOOLEAN,
            defaultValue: false
        }

    },

    associations: function (models, prefix) {
        models[prefix + "Permission"].belongsToMany(models[prefix + "Role"], {
            through: 'rolePermission',
            foreignKey: 'permissionId'
        });
        models[prefix + "Permission"].belongsToMany(models[prefix + "Route"], {
            through: 'permissionRoute',
            foreignKey: 'permissionId'
        });
        models[prefix + "Permission"].belongsTo(models["Proxy" + "Application"]);
        models[prefix + "Permission"].belongsToMany(models[prefix + "Referer"], {
            through: 'refererPermission',
            foreignKey: 'permissionId'
        });

    },

    options: {
        name: {
            singular: 'permission',
            plural: 'permissions'
        },
        classMethods: {},
        instanceMethods: {},
        hooks: {}
    }
};

module.exports = description;
