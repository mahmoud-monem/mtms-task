import { authentication } from './authentication';
// Request middlewares
import { requestInterceptors } from './request';
// Response middlewares
import { error } from './response';
// Routes
import { routes } from './routes';

export const middlewares = [
  requestInterceptors,
  authentication,
  routes(),
  error,
];
