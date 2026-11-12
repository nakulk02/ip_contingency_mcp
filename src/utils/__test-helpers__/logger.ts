/* Silent logger used by Jest in place of src/utils/logger.ts. */
const noop = () => undefined;

export const logger = {
  info: noop,
  warn: noop,
  error: noop,
  debug: noop,
  trace: noop,
  fatal: noop,
  child: () => logger,
};

export default logger;
