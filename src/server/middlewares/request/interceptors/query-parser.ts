import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import Utils from '../../../../common/utils';
import config from '../../../../config';
const { pageSize, maxPageSize } = config().common;

export function queryParser(req: Request, res: Response, next: NextFunction) {
  let page: number, limit: number;
  const { query } = req;
  const parsedQuery = {
    page: 0,
    paginate: true,
    limit: pageSize,
    fields: {},
    sort: {},
  };
  Object.entries(query).forEach(([key, value]) => {
    switch (key) {
      case 'paginate':
        parsedQuery.paginate = Utils.parseBoolean(value);
        break;
      case 'page':
        page = Utils.parseInt(value);
        page = page >= 0 ? page : 0;
        parsedQuery.page = page;
        break;
      case 'limit':
        limit = Utils.parseInt(value);
        limit = limit >= maxPageSize ? maxPageSize : limit;
        parsedQuery.limit = limit;
        break;
      case 'fields':
        (value as string).split(',').forEach((entry) => {
          const op = entry.startsWith('-') ? 0 : 1;
          const field = op === 1 ? entry : entry.substr(1);
          parsedQuery.fields[field] = op;
        });
        break;
      case 'roles':
        parsedQuery['roles'] = (value as string).split(',');
        break;
      case 'sort':
        (value as string).split(',').forEach((entry) => {
          let field = entry.trim();
          const op = field.startsWith('-') ? -1 : 1;

          if (!field || field.length === 0) {
            return;
          }

          if (op < 0) {
            field = field.substr(1);
          }

          parsedQuery.sort[field] = op;
        });
        break;
      default:
        parsedQuery[key] = value;
    }
  });

  _.merge(req.query, parsedQuery);

  return next();
}
