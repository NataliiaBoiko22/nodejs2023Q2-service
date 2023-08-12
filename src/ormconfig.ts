import 'reflect-metadata';
import { DataSourceOptions } from 'typeorm';

export const dataSourceConfig = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: +process.env.POSTGRES_PORT || 5432,
  username: process.env.POSTGRES_USER || 'first_user',
  password: process.env.POSTGRES_PASSWORD || 'first_password',
  database: process.env.POSTGRES_DB || 'first_db',
  migrationsRun: false,
  synchronize: true,
  logging: true,
  entities: ['dist/**/entities/*.entity.js'],
  migrations: ['dist/migration/*.{ts,js}'],
} as DataSourceOptions;
