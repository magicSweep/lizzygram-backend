"use strict";
exports.__esModule = true;
exports.logger = void 0;
var winston_1 = require("winston");
/*
  LOG LEVELS

  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6

*/
//logger.log
var combine = winston_1.format.combine, timestamp = winston_1.format.timestamp, prettyPrint = winston_1.format.prettyPrint;
exports.logger = (0, winston_1.createLogger)({
    format: combine(
    /* label({ label: "right meow!" }), */
    timestamp(), 
    //simple()
    prettyPrint()),
    transports: [
        /*  new transports.File({
            filename: 'error.log',
            level: 'error',
            format: format.json()
          }),
          new transports.Http({
            level: 'warn',
            format: format.json()
          }), */
        new winston_1.transports.Console(),
    ]
});
/* export const logger = createLogger({
  transports: [
    new transports.File({
      filename: "error.log",
      level: "error",
      format: format.json(),
    }),
    new transports.Http({
      level: "warn",
      format: format.json(),
    }),
    new transports.Console({
      level: "info",
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
}); */
