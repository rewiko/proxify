var sequelize = require('sequelize');
var description = {
    description: 'Confers to `User`',
    name: "AdministrationGroup",
    adapter: "sequelize-postgres",
    attributes: {
        name: {
            type: sequelize.STRING,
            index: true,
            unique: true,
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

    associations: function(models, prefix) {
        models[prefix + "Group"].belongsToMany(models[prefix + "User"], {
            through: 'userGroup',
            foreignKey: 'groupId'
        });
        models[prefix + "Group"].belongsToMany(models[prefix + "Role"], {
            through: 'roleGroup',
            foreignKey: 'groupId'
        });
    },

    options: {
        name:{
            singular:'group',
            plural :'groups'
        },
        classMethods: {},
        instanceMethods: {},
        hooks: {}
    }
};

module.exports = description;
