var sequelize = require('sequelize');
var description = {
    name: "AdministrationLanguage",
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
        ico: {
            type: sequelize.STRING
        },
        translationKey: {
            type: sequelize.STRING
        },
        isAvailable: {
            type: sequelize.BOOLEAN,
            defaultValue: true,
            index: true
        }
    },

    associations: function(models, prefix) {
        models[prefix + "Language"].belongsToMany(models[prefix + "Group"], {
            through: 'languageGroup',
            foreignKey: 'languageId'
        });
    },

    options: {
        name:{
            singular:'language',
            plural :'languages'
        },
        classMethods: {},
        instanceMethods: {},
        hooks: {}
    }
};

module.exports = description;
