import { queryParser } from './query-parser';

export async function requestInterceptors(req, res, next) {
  queryParser(req);

  await next();
}
