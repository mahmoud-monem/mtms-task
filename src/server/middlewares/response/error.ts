import { Request, Response } from 'express';

export async function error(err, req: Request, res: Response, next) {
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

  res.send(payload);
  return next();
}
