import * as winston from 'winston';

const MESSAGE = Symbol.for('message');
const LEVEL = Symbol.for('level');

const errorToLog = (log) => {
  // convert an instance of the Error class to a formatted log
  const formatted = {
    message: null,
    level: 'error',
  };

  formatted[LEVEL] = 'error';

  if (log.message) {
    formatted.message = `${log.message}: ${log.stack}`;
  } else {
    formatted.message = log.stack;
  }
  return formatted;
};

const errorFormatter = (logEntry) => {
  if (logEntry instanceof Error) {
    // an error object was passed in
    return errorToLog(logEntry);
  }

  if (logEntry.stack) {
    // an error object was passed in addition to an error message
    logEntry.message = `${logEntry.message}: ${logEntry.stack}`;
  }

  if (logEntry.message && typeof logEntry.message === 'object') {
    if (logEntry.message?.err instanceof Error) {
      // Ugh. So here we are with a log message that is an instance of the Error class
      return errorToLog(logEntry.message.err);
    } else {
      // here we have an object as the log message but it's not an Error object
      logEntry.message = JSON.stringify(logEntry.message);
    }
  }
  return logEntry;
};

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.cli({
      colors: {
        error: 'red',
        warn: 'yellow',
        info: 'blue',
        http: 'green',
        verbose: 'cyan',
        debug: 'white',
      },
    }),
  ),
  handleExceptions: true,
});

const envTag = (logEntry) => {
  const tag = {
    env: process.env.APPLICATION_ENV || 'local',
  };

  const taggedLog = Object.assign(tag, logEntry);

  logEntry[MESSAGE] = JSON.stringify(taggedLog);

  return logEntry;
};

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format(errorFormatter)(),
    winston.format(envTag)(),
  ),
  transports: [consoleTransport],
});

export default logger;
