"use strict";
exports.run = function (app) {
    var Route = coreServerApp.global.models['sequelize-postgres'];
    var sequelize = Route.AdministrationUser.sequelize;
    var dataFixtures = require('../fixtures/fixtures').data();
    var insertData = function insertData(dataArray) {
        return sequelize.transaction(function (t) {
            return Promise.each(dataArray.data, function (dataElem) {
                var data_to_insert = {};
                data_to_insert['where'] = dataElem.where;
                if (typeof (dataElem.defaults) != 'undefined')
                    data_to_insert['defaults'] = dataElem.defaults;

                if (!dataArray.modelToJoin)
                    return dataArray.modelToCreate.findOrCreate(data_to_insert);
                else {
                    return dataArray.modelToJoin.findAll({ where: dataElem.where_join }).then(
                        function (result_model) {

                            return dataArray.modelToCreate.findOrCreate(data_to_insert).then(
                                function (result) {
                                    // result[0] = Route.AdministrationPermission;
                                    // for (let assoc of Object.keys(result[0].associations)) {
                                    //     for (let accessor of Object.keys(result[0].associations[assoc].accessors)) {
                                    //         console.log(result[0].name + '.' + result[0].associations[assoc].accessors[accessor] + '()');
                                    //     }
                                    // }
                                    console.log("result 0 ", result[0]);
                                    console.log("result test  ", dataElem.join);

                                    if (typeof (dataElem.data_join) == 'undefined') {
                                        if (dataElem.join.charAt(dataElem.join.length - 1) != "s") {
                                            return result[0][dataElem.join](result_model[0]);
                                        }
                                        else {
                                            return result[0][dataElem.join](result_model);
                                        }
                                    }
                                    else
                                        return result[0][dataElem.join](result_model, dataElem.data_join);

                                });
                        });
                }

            });
        });
    };

    logger.info("Begin loading fixture!");
    logger.info("...");

    return require('../fixtures/user').create().then(function (success) {
        return Promise.each(dataFixtures, function (dataElem) {
            return insertData(dataElem);
        }).then(function (success) {
            logger.info("End loading fixture!");
        });
    });

};

