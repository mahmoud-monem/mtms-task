import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../../../common/errors';

export async function notFound(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.statusCode === 404) {
    throw new NotFoundError('Invalid url');
  }

  next();
}
