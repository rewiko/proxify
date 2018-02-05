var sequelize = require('sequelize');
var description = {
    name: "AdministrationRole",
    adapter: "sequelize-postgres",
    autoCreatedBy: false,

    description: 'Confers `Role` to `User`',

    attributes: {
        name: {
            type: sequelize.STRING,
            index: true,
            allowNull: false,
            unique: true
        },

        description: {
            type: sequelize.STRING,
            defaultsTo: ""
        },

        active: {
            type: sequelize.BOOLEAN,
            defaultsTo: true,
            index: true
        }
    },

    associations: function(models, prefix) {
        models[prefix + "Role"].belongsToMany(models[prefix + "Group"], {
            through: 'roleGroup',
            foreignKey: 'roleId'
        });
        models[prefix + "Role"].belongsToMany(models[prefix + "Permission"], {
            through: 'rolePermission',
            foreignKey: 'roleId'
        });
    },

    options: {
        name:{
            singular:'role',
            plural :'roles'
        },
        classMethods: {},
        instanceMethods: {},
        hooks: {}
    }
};

module.exports = description;
