import { Request, Response, NextFunction } from 'express';
import { userJwt } from '../services/auth';

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { jwt: token } = req.session || {};
  if (!token) return next();

  try {
    const payload = userJwt.verify(token);
    req.currentUser = payload;
  } catch (error) {}
  return next();
};
