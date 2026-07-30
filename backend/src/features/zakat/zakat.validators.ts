import Joi from 'joi';

export const calculateZakatSchema = Joi.object({
  assets: Joi.object({
    cash:              Joi.number().min(0).default(0),
    goldValue:         Joi.number().min(0).default(0),
    silverValue:       Joi.number().min(0).default(0),
    businessInventory: Joi.number().min(0).default(0),
    investments:       Joi.number().min(0).default(0),
    receivables:       Joi.number().min(0).default(0),
  }).required(),
  liabilities:        Joi.number().min(0).default(0),
  currency:           Joi.string().length(3).uppercase().default('USD'),
  hawlMet:            Joi.boolean().default(true),
  /** Optional: override the Nisab threshold (e.g. for historical calculations) */
  nisabOverride:      Joi.number().min(0).optional(),
});
