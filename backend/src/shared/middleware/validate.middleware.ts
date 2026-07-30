import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { sendError } from '../utils/response.utils';

/**
 * Validates req.body against a Joi schema.
 * Applies defaults from the schema and assigns validated value back to req.body.
 */
export const validateRequest = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, allowUnknown: false });
    if (error) {
      const errors = error.details.map((d) => d.message);
      return sendError(res, 'Validation failed', 400, errors);
    }
    req.body = value; // assign defaults resolved by Joi
    next();
  };
};

/** Alias for backward-compat with newer feature files */
export const validate = validateRequest;
