import { Response } from 'express';

export const sendSuccess = (res: Response, data: any, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

export const sendError = (res: Response, message: string, statusCode = 400, errors?: any) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
