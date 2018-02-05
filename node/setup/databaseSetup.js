"use strict";

var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "development";
var config = coreServerApp.global.config;
var databaseConfig = config.database;
var db = {};

const Op = Sequelize.Op;
global.SeqOp = Op;
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
};

var setAssociation = function (modelDef, modelsKey, models, prefix) {
  if (modelDef.associations != null) {
    logger.info('Loading associations for \'' + modelsKey + '\'');
    if (typeof modelDef.associations === 'function') {
      modelDef.associations(models, prefix);
    }
  }
};

exports.run = function (app) {

  var adapterDefined = {};
  var processSequelizeAdapter = function (value) {
    return new Promise(function (resolve, reject) {
      logger.info("SEQUELIZE: ");
      logger.info("Fetch adapter: ");
      if (value.models) {
        if (!value.name) {
          logger.error('Missing name for module: ' + JSON.stringify(value));
          return reject('Missing name for module: ' + JSON.stringify(value));
        }
        var name = value.name;

        _.forEach(value.models, function (models, modelsKey) {
          if (typeof (adapterDefined[models.adapter]) == 'undefined') {
            if (typeof (databaseConfig[models.adapter]) != 'undefined') {
              adapterDefined[models.adapter] = {};
              databaseConfig[models.adapter].options.operatorsAliases = operatorsAliases;
              adapterDefined[models.adapter].config = new Sequelize(databaseConfig[models.adapter].database, databaseConfig[models.adapter].username, databaseConfig[models.adapter].password, databaseConfig[models.adapter].options);
              app.global.models[models.adapter] = {};
            }
            else {
              logger.error("adapter: " + models.adapter + " is not defined inside config!")
              return reject("adapter: " + models.adapter + " is not defined inside config!")
            }
          }
        });
      }
      if (value.modules) {
        if (_.isArray(value.modules)) {
          _.forEach(value.modules, function (module, key) {
            processSequelizeAdapter(module);
          });
        }
        else {
          processSequelizeAdapter(value.modules);

        }
      }
      else if (_.isArray(value)) {
        _.forEach(value, function (module, key) {
          processSequelizeAdapter(module);
        });

      }
      return resolve(true);
    });
  };
  var array_prom = [];
  array_prom.push({ func: processSequelizeAdapter, param: app.global.modules });

  var processSequelize = function (value) {
    return new Promise(function (resolve, reject) {
      logger.info("Loading Model: ");
      //if(nameDefined)
      //path = pathDefined + path;
      if (value.models) {
        if (!value.name) {
          logger.error('Missing name for module: ' + JSON.stringify(value));
          reject('Missing name for module: ' + JSON.stringify(value));
        }
        var name = value.name;

        _.forEach(value.models, function (models, modelsKey) {
          logger.info("Define Model: " + value.name + modelsKey);
          app.global.models[models.adapter][value.name + modelsKey] = adapterDefined[models.adapter].config
            .define(value.name + modelsKey, models.attributes, models.options);

          _.forEach(models.options.instanceMethods, function (instance, instanceKey) {
            app.global.models[models.adapter][value.name + modelsKey].prototype[instanceKey] = instance;
          });

          _.forEach(models.options.classMethods, function (classMethod, classKey) {
            app.global.models[models.adapter][value.name + modelsKey][classKey] = classMethod;
          });

          app.global.models[value.name + modelsKey] = models;
        });
      }
      if (value.modules) {
        if (_.isArray(value.modules)) {
          _.forEach(value.modules, function (module, key) {
            processSequelize(module);
          });
        }
        else {
          processSequelize(value.modules);

        }
      }
      else if (_.isArray(value)) {
        _.forEach(value, function (module, key) {
          processSequelize(module);
        });

      }
      return resolve(true);
    });

  };

  array_prom.push({ func: processSequelize, param: app.global.modules });

  var processSequelizeAssociation = function (value) {
    return new Promise(function (resolve, reject) {
      //if(nameDefined)
      //path = pathDefined + path;
      if (value.models) {
        if (!value.name) {
          logger.error('Missing name for module: ' + JSON.stringify(value));
          reject('Missing name for module: ' + JSON.stringify(value));
        }
        var name = value.name;

        _.forEach(value.models, function (models, modelsKey) {
          setAssociation(models, value.name + modelsKey, app.global.models[models.adapter], value.name);
        });
      }
      if (value.modules) {
        if (_.isArray(value.modules)) {
          _.forEach(value.modules, function (module, key) {
            processSequelizeAssociation(module);
          });
        }
        else {
          processSequelizeAssociation(value.modules);

        }
      }
      else if (_.isArray(value)) {
        _.forEach(value, function (module, key) {
          processSequelizeAssociation(module);
        });
      }
      return resolve(true);
    });
  };

  array_prom.push({ func: processSequelizeAssociation, param: app.global.modules });

  var syncSequelize = function (value) {
    return new Promise(function (resolve, reject) {
      var arraySync = [];
      _.forEach(adapterDefined, function (adapter, akey) {
        _.forEach(databaseConfig, function (connection, key) {
          if (akey == key) {
            if (connection.migrate === 'safe') {
              //return next();
            } else {
              var forceSync = connection.migrate === 'drop';
              logger.info("Sync adapter " + key);
              arraySync.push({ func: adapterDefined[key].config, param: { force: forceSync } });
            }
          }
        });
      });

      return Promise.map(arraySync, function (promiseFn) {
        return promiseFn.func.sync(promiseFn.param);
      }, { concurrency: 1 }).then(function (success) {
        logger.info("END SEQUELIZE!");
        return resolve(true);
      }, function (error) {
        logger.error("Error Sequelize: " + error);
        return reject("Error Sequelize: " + error);
      });
    });
  };
  array_prom.push({ func: syncSequelize, param: app.global.modules });
  return Promise.map(array_prom, function (promiseFn) {
    return promiseFn.func(promiseFn.param);
  }, { concurrency: 1 }); //it will run promises sequentially
};
