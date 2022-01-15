const API_NAME = 'mtms-task';

export default () => ({
  api: {
    name: API_NAME,
    version: '1.0',
    host: 'localhost',
    port: process.env.PORT || 8080,
    env: process.env.NODE_ENV || 'development',
    contextStoreName: 'api',
  },
  common: {
    pageSize: 10,
    maxPageSize: 100,
  },
  database: {},
  authentication: {
    key: 'this is authentication key for json web token for mtms task',
  },
});
