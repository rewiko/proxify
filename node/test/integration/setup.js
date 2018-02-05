const request = require('supertest');
const app = require('../../main')();
module.exports = async function () {

  return new Promise(resolve => {
    app.then(function(server){
      global.__SERVER__ = server;
      setTimeout(function() {
        resolve();
      }, 1000);
    }, function(error){
      console.log("Error Before All ", error);
      resolve();
    });
  });
};