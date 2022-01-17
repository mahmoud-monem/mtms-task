import { authentication } from './authentication';
// Request middlewares
import { requestInterceptors } from './request';
// Response middlewares
import { error } from './response';
import { routes } from './routes';

module.exports = [requestInterceptors, authentication, routes(), error];
