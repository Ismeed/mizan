import Joi from 'joi';

/**
 * Validates a POST /inheritance/calculate request body.
 * All heir counts must be non-negative integers.
 * Husband and wife(s) are mutually exclusive.
 */
export const calculateInheritanceSchema = Joi.object({
  totalEstate:     Joi.number().positive().required().messages({ 'number.positive': 'Total estate must be a positive number' }),
  debts:           Joi.number().min(0).default(0),
  funeralExpenses: Joi.number().min(0).default(0),
  wasiyyah:        Joi.number().min(0).default(0),
  currency:        Joi.string().length(3).uppercase().default('USD'),
  madhhab:         Joi.string().valid('HANAFI', 'MALIKI', 'SHAFII', 'HANBALI').default('HANAFI'),
  notes:           Joi.string().max(500).optional(),
  heirs: Joi.object({
    husband:               Joi.number().integer().min(0).max(1).default(0),
    wives:                 Joi.number().integer().min(0).max(4).default(0),
    sons:                  Joi.number().integer().min(0).default(0),
    daughters:             Joi.number().integer().min(0).default(0),
    father:                Joi.number().integer().min(0).max(1).default(0),
    mother:                Joi.number().integer().min(0).max(1).default(0),
    paternalGrandfathers:  Joi.number().integer().min(0).max(1).default(0),
    paternalGrandmothers:  Joi.number().integer().min(0).default(0),
    maternalGrandmothers:  Joi.number().integer().min(0).default(0),
    fullBrothers:          Joi.number().integer().min(0).default(0),
    fullSisters:           Joi.number().integer().min(0).default(0),
    paternalHalfBrothers:  Joi.number().integer().min(0).default(0),
    paternalHalfSisters:   Joi.number().integer().min(0).default(0),
    maternalHalfSiblings:  Joi.number().integer().min(0).default(0),
    sonsOfFullBrothers:    Joi.number().integer().min(0).default(0),
    sonsOfPatHalfBrothers: Joi.number().integer().min(0).default(0),
    paternalUncles:        Joi.number().integer().min(0).default(0),
    sonsOfPatUncles:       Joi.number().integer().min(0).default(0),
  }).required(),
}).custom((value, helpers) => {
  // Husband and wives are mutually exclusive
  if (value.heirs.husband > 0 && value.heirs.wives > 0) {
    return helpers.error('any.invalid', { message: 'Husband and wives cannot coexist' });
  }
  // Wasiyyah cannot exceed 1/3 of estate
  const maxWasiyyah = value.totalEstate / 3;
  if (value.wasiyyah > maxWasiyyah) {
    return helpers.error('any.invalid', { message: 'Wasiyyah cannot exceed 1/3 of the total estate (Islamic rule)' });
  }
  return value;
});
