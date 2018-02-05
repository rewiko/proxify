'use strict';

require('app-module-path').addPath(__dirname + '/lib');
var requireDirectory = require('require-directory');
var path = require('path');
var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app);

const axios = require('axios');

const promBundle = require("express-prom-bundle");
const GracefulShutdownManager = require('@moebius/http-graceful-shutdown').GracefulShutdownManager;
const shutdownManager = new GracefulShutdownManager(server);
const metricsMiddleware = promBundle(
  {
    includeMethod: true,
    includePath: true,
    promClient: {
     collectDefaultMetrics: {
       timeout: 1000
     }
    }
  });
// prom-client
// const c1 = new metricsMiddleware.promClient.Counter({name: 'c1', help: 'c1 help'});
// c1.inc(10);

var CONF = require('config');
var moment = require('moment');
var cors = require('cors')
var bodyParser = require('body-parser');
global._ = require('lodash');
global.logger = require('logger')(CONF);
global.Promise = require('bluebird');

var core = function(){
  return new Promise(function (resolve, reject) {

var coreServerApp = {};
global.coreServerApp = coreServerApp;
coreServerApp.app = app;
process.on('uncaughtException', function (err) {
  console.log(moment().toISOString(), err);
});

var state = { healthy: true };
var morgan = require('morgan');

// Create an instance using the config defaults provided by the library
// At this point the timeout config value is `0` as is the default for the library
var requests = axios.create();

// Override timeout default for the library
// Now all requests will wait 2.5 seconds before timing out
requests.defaults.timeout = 1000;

app.use(metricsMiddleware);
app.use(morgan('combined', {
  skip: function (req, res) { return res.statusCode < 400 }
}));

// Nothing ever comes from "x-powered-by", but a security hole
app.disable("x-powered-by");

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
// parse json
app.use(bodyParser.json());
// parse text/plain
app.use(bodyParser.text({ type: 'text/plain'}));
// parse anything else
app.use(bodyParser.raw());

// error handlers
app.use(function(err, req, res, next) {
  if(!err) return next(); // you also need this line
  // Do logging and user-friendly error message display
  console.log(err);

  /*
   * Remove Error's `stack` property. We don't want
   * users to see this at the production env
   */
  if (req.app.get('env') == 'prod') {
    delete err.stack;
  }

  /* Finaly respond to the request */
  res.status(err.statusCode || 500).json(err);

});

coreServerApp.global = {};
coreServerApp.global.config = CONF;
coreServerApp.global.models = {};
coreServerApp.global.DAO = {};
coreServerApp.global.tools = {};
coreServerApp.global.services = requireDirectory(module, './services/');
var setup = requireDirectory(module, './setup/');
var middlewares = requireDirectory(module, './middlewares/');
coreServerApp.global.middlewares = middlewares;
coreServerApp.global.modules = [
{ path: '/admin', modules: require('./lib/administration') },
{ path: '/proxy', modules: require('./lib/proxy') },
];
coreServerApp.global.modules.forEach(function(item){
  coreServerApp.app.use(item.path, item.modules.router); // attach to sub-route
});

var randomIntFromInterval = function(min,max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

app.get('/', (req, res) => {
  return res.status(200).json({"ready":"true"})
});

app.get('/metrics', (req, res) => {
  res.set('Content-Type', Prometheus.register.contentType);
  res.end(Prometheus.register.metrics());
});

app.get('/private/ready', (req, res) => {
  if (!state.healthy) {
    res.writeHead(500);
    return res.end('unready');
  }
  return res.send('ready\n');
});

var authentication = global.coreServerApp.global.middlewares.Authenticated;
var policies = global.coreServerApp.global.middlewares.RouterPolicy;
app.get('/private/authenticate', authentication, (req, res) => {
  res.status(200).json({"authenticate":true});
});
app.get('/private/policies', policies, (req, res) => {
  res.status(200).json({"policies":true});
});
app.get('/private/authpolicies', authentication, policies, (req, res) => {
  res.status(200).json({"authpolicies":true});
});

app.get('/private/authpoliciesfailure', authentication, policies, (req, res) => {
  res.status(200).json({"authpolicies":true});
});

app.get('/private/echo', (req, res) => {
  setTimeout(function(){
    res.send('Ok\n');
  }, randomIntFromInterval(req.query.minDelay, req.query.maxDelay));
});

app.get('/third_party/private', (req, res) => {
  requests.get('http://mocks:8080/comp/private/status')
    .then(response => {
      logger.info('success', response);
      return res.json({"response": response.data});
    })
  .catch(error => {
    logger.error('error', error);
    return res.status(500).json({ "error": error.code });
  });
});

var gracefulShutdown = function(timeWait){
  state.healthy = false;
  var readinessProbeTime = typeof(timeWait) != 'undefined' ? timeWait : 10000; //(failureThreshold: 2 * periodSeconds: 2 = 4s)
  //var readinessProbeTime = 0; //(failureThreshold: 2 * periodSeconds: 2 = 4s)
  console.log('Waiting before gracefulShutdown during : ' + readinessProbeTime );
  setTimeout(function(){
    shutdownManager.terminate(() => {
      console.log('Server is gracefully terminated');
      process.exit();
    });
  }, readinessProbeTime);
};
coreServerApp.gracefulShutdown = gracefulShutdown;
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

var server = require('http').createServer(app)
//var io = io.listen(server);
setup.databaseSetup.run(coreServerApp).then(function(data){
  logger.info("Database initialized");
  setup.routerSecurity.run(coreServerApp.app).then(function(data){
    logger.info("Router Security initialized");
    setup.loadingFixtures.run(coreServerApp.app).then(function(data){
    logger.info("Loading Fixtures done");
    server.listen(process.env.PORT || CONF.app.port);
    resolve(coreServerApp);
    server.on('error', onError);
    server.on('listening', onListening);
  }, function(error){
    logger.error("Setup Loading Fixtures "+ error);
  });
  }, function(error){
    logger.error("Setup Router Security "+ error);
  });
}, function(error){
  logger.error("Setup Database Failed "+ error);
});

function onError(error) {
  logger.error("Error starting express : " + error);
}
function onListening() {
  logger.info("Express server instance listening on port " + CONF.app.port);
}
});
};

module.exports = core;
