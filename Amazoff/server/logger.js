const winston = require('winston');
const path = require('path');

const logPath = `${__dirname}/logs`;

const tsFormat = () => (new Date().toISOString());

const errorLog = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: path.join(logPath, 'errors.log'),
      timestamp: tsFormat,
      level: 'info',
    }),
  ],
});

const accessLog = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: path.join(logPath, 'access.log'),
      timestamp: tsFormat,
      level: 'info',
    }),
  ],
});

module.exports = {
  errorLog, accessLog,
};
