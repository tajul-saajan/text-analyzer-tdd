import { config } from 'dotenv';
config({ path: `.env` });

/* istanbul ignore next */
export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN, REDIS_HOST, REDIS_PORT } = process.env;
