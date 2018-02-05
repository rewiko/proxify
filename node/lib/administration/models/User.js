var crypto = require('crypto');
var sequelize = require('sequelize');
var bcrypt = require('bcryptjs');
var description = {
  name: "AdministrationUser",
  adapter: "sequelize-postgres",
  attributes: {
    username: {
      type: sequelize.STRING,
      unique: true,
    },
    email: {
      type: sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
    password: {
      type: sequelize.STRING,
      validate: {
        min: 8,
        //notNull: true,
        //notEmpty: true,
      }
    },
    firstName: {
      type: sequelize.STRING,
      defaultValue: ''
    },
    lastName: {
      type: sequelize.STRING,
      defaultValue: ''
    },
    lang: {
      type: sequelize.STRING,
      defaultValue: 'en'
    },
    admin: {
      type: sequelize.BOOLEAN,
      defaultValue: false
    },
    disabled: {
      type: sequelize.BOOLEAN,
      defaultValue: false
    },
    gravatar:  {
      type: sequelize.STRING,
      defaultValue: false
    },
  },

  // Below is all specification for relations to another models
  associations: function(models, prefix) {
    models[prefix + "User"].belongsToMany(models[prefix + "Group"], {
      through: 'userGroup',
      foreignKey: 'userId'
    });
  },

  options: {
    name:{
      singular:'user',
      plural :'users'
    },

    classMethods: {
    },
    instanceMethods: {
      userToJSON: function (data) {
        var user = this.dataValues;
        delete user.password;
        return user;
      },
      validatePassword: function validatePassword(password, next) {
        bcrypt.compare(password, this.password, next);
      }
    },
  }
};

var hooks = {
  beforeValidate: [
    function(user){
      if (_.isEmpty(user.username)) {
        user.username = user.email;
      }
      if(typeof(user.email) != 'undefined'){
        var md5 = crypto.createHash('md5');
        md5.update(user.email || '');
        user.gravatar = md5.digest('hex');
      }
    },
    function(user){
      if (user.dataValues.hasOwnProperty('password')) {
        return bcrypt.hash(user.dataValues.password, 10).then(function(hash) {
          user.dataValues.password = hash;
        });
      }
    }],
};
description.options.hooks = hooks;
module.exports = description;
