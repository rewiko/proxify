var sequelize = require('sequelize');
var description = {
    name: "AdministrationReferer",
    adapter: "sequelize-postgres",
    attributes: {

        name: {
            type: sequelize.STRING,
            allowNull: false,
        },
        url: {
            type: sequelize.STRING,
            allowNull: false,
            unique: true
        },
    },

    // Below is all specification for relations to another models
    associations: function(models, prefix) {
        models[ prefix + "Referer"].belongsToMany(models[prefix + "Permission"], {
            through: 'refererPermission',
            foreignKey: 'refererId'
        });
    },

    options: {
        name:{
            singular: 'referer',
            plural: 'referers'
        },
        classMethods: {
        },
        instanceMethods: {
        },
        hooks: {
        }
    }
};

module.exports = description;
