'use strict';

var server = require('./main')().then(function(app){
  console.log(app);
}, function(error){
  console.log(error);
});
