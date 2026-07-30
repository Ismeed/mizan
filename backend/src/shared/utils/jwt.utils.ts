import jwt from 'jsonwebtoken';
import { config } from '../../config';

export const signToken = (payload: object): string => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn as any });
};

export const signRefreshToken = (payload: object): string => {
  return jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn as any });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, config.jwt.secret);
};

export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, config.jwt.refreshSecret);
};
