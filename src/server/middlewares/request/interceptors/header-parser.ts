import { NextFunction, Request } from 'express';
import _ from 'lodash';
import Utils from 'src/common/utils';

export default function headerParser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { headers } = req;
  // Set needed local variables

  // Timezone
  const timezone = Utils.parseInt(headers.timezone) || 0;
  _.set(req, '_locals.timezone', timezone);
  // Locale

  return next();
}
