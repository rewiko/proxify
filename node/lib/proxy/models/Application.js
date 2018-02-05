var sequelize = require('sequelize');
var description = {
    description: 'Confers to `Application`',
    name: "ProxyApplication",
    adapter: "sequelize-postgres",
    attributes: {
        name: {
            type: sequelize.STRING,
            index: true,
            unique: true,
            allowNull: false
        },

        url: {
            type: sequelize.STRING,
            allowNull: false
        },

        description: {
            type: sequelize.STRING
        },

        active: {
            type: sequelize.BOOLEAN,
            defaultValue: true,
            index: true
        }
    },

    associations: function (models, prefix) {
        models[prefix + "Application"].hasMany(models["Administration" + "Permission"]);
    },

    options: {
        name: {
            singular: 'application',
            plural: 'applications'
        },
        classMethods: {},
        instanceMethods: {},
        hooks: {}
    }
};

module.exports = description;
