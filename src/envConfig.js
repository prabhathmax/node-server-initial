// eslint-disable-next-line import/no-unassigned-import
import 'dotenv/config';

// eslint-disable-next-line no-process-env
const ENV = process.env;

// e.g. 'local', 'dev', 'test', 'prod'
export const envId = ENV.ENV_NAME || 'local';
export const dbUrl = ENV.DATABASE_URL || '127.0.0.1';


export default {
  envId,
  dbUrl,
};
