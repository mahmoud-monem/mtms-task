import { authentication } from './authentication';
// Request middlewares
import { queryParser } from './request';
// Response middlewares
import { error, notFound } from './response';
// Routes
import { routers } from './routes';

export const middlewares = [
  error,
  queryParser,
  authentication,
  ...routers,
  notFound,
];
