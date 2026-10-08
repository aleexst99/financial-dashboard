import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config({ path: 'apps/api/.env' });

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['apps/api/src/app/**/*.entity.ts'],
  migrations: ['apps/api/src/migrations/*.ts'],
  synchronize: false,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});