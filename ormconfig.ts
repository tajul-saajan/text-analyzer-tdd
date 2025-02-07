import { ConnectionOptions } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const config: ConnectionOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/entities/*.ts'],
  synchronize: true,
};

export default config;
