import { dev } from '$app/environment';
import winston from 'winston';

export const Logger = (label: string) => {
  const logger = winston.createLogger({
    defaultMeta: { service: 'jeddit' },
    level: 'debug',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
    transports: [
      new winston.transports.Console()
    ],
  });

  return logger;
}
