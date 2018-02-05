const { createLogger, format, transports } = require('winston');
var moment = require('moment');
var logger = function(config){
return createLogger({
    transports: [
        new transports.Console({
            level: config.app.log_level || 'warn' ,
            handleExceptions: true,
            json: false,
            colorize: true,
            timestamp: function() {
                return moment().toISOString();
            },
        })
    ],
    exitOnError: false
});
}

module.exports = logger;
