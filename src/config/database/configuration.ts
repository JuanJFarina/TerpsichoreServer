import { registerAs } from '@nestjs/config';
import { join } from 'path';

export default registerAs('database', () => ({
  type: process.env.POSTGRES_TYPE,
  host: process.env.POSTGRES_HOST,
  schema: process.env.POSTGRES_SHEMA,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [join(__dirname, '../../database/**', '*.entity.{ts,js}')],
  synchronize: true,
  logging: false,
  dropSchema: false,
}));
