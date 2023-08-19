export enum LOGGER_VARIANTS {
  log = 'log',
  error = 'error',
  warn = 'warn',
  debug = 'debug',
  verbose = 'verbose',
}
export const LOGGER_MAX_SIZE_KB = +process.env.MAX_FILE_SIZE_KB || 1;

export const LOGGER_DIRECTORY = 'logs';

export const LOGGER_LEVEL = +process.env.LOGGING_LEVEL || 2;

export enum LOGGER_FILES {
  log = 'log',
  error = 'error',
}
