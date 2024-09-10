/// <reference types="rollup" />
/**
 * Logger configuration
 *
 * @typedef LoggerConfig
 * @prop {boolean} [color=true]
 * @prop {import('rollup').LogLevel} [logLevel='info']
 */
/**
 * Formatting log output
 *
 * @param {LoggerConfig} options
 *
 * @returns {import('rollup').Plugin}
 */
export default function loggerPlugin(options = {}) {
  function parseMessage(message) {
    const result = message.match(/^\[([\w\s-:]+)](.+)$/);
    if (!result) {
      return { plugin: 'logger', message: `Parser error. Message: ${message}` };
    }
    const plugin = result[1].replace(/^plugin\s/, '');

    return { plugin, message: result[2].trim() };
  }

  return {
    name: 'logger',
    logLevel: options.logLevel || 'info',
    /**
     * Logger callback
     *
     * @param {import('rollup').LogLevel} level
     * @param {import('rollup').RollupLog} log
     */
    onLog(level, log) {
      const { plugin, message } = parseMessage(log.message);
      if (level === 'warn') {
        console.log('\x1b[1;92m[%s]\x1b[0m \x1b[0;33mWARN: %s\x1b[0m', plugin, message);
      } else if (level === 'error') {
        console.log('\x1b[1;92m[%s]\x1b[0m \x1b[0;31mERROR: %s\x1b[0m', plugin, message);
      } else {
        console.log('\x1b[1;92m[%s]\x1b[0m \x1b[0;37m%s\x1b[0m', plugin, message);
      }
      return false;
    },
  }
}