import { cleanEnv, port, str, num } from 'envalid';

export const ValidateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    ACCOUNT_LOCK_THRESHOLD: num(),
  });
};
