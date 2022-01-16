import { ConnectionOptions } from 'typeorm';
import { Comment } from '../database/entities/comment.entity';
import { Like } from '../database/entities/like.entity';
import { Post } from '../database/entities/post.entity';
import { User } from '../database/entities/user.entity';

export default () =>
  ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '1234567r',
    database: process.env.DB_NAME || 'taskDB',
    synchronize: !process.env.DB_NO_SYNC || true,
    logging: !process.env.DB_NO_LOGS || false,
    schema: 'taskDBSchema',
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 2000,
    entities: [User, Post, Like, Comment],
    migrations: [__dirname + `../migration/*.ts`],
    cli: {
      entitiesDir: '../database/entities',
      migrationsDir: '../migration',
    },
  } as ConnectionOptions);
