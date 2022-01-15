import { NextFunction, Request, Response } from 'express';

export async function error(req: Request, res: Response, next: NextFunction) {
  try {
    return next();
  } catch (err) {
    const payload = {
      code: err.code || 0,
      name: err.name,
      message: err.message || 'Error',
    };

    res.status(err.status || 500);
    if (err.status && err.status === 400) {
      if (Array.isArray(err.errors)) {
        payload['details'] = err.errors;
        payload.message = 'validation error(s)';
      }
    }

    return res.send(payload);
  }
}
