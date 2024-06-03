import { header, query } from 'express-validator';

export const validateWithRequiredHeaders = (...validations) => {
  const finalValidations = [
    header('X-Player-Id')
      .notEmpty()
      .isAlphanumeric()
      .isLength({ min: 16, max: 20 }),
    ...validations
  ]

  return validate(...finalValidations);
}

export const validateWithRequiredParams = (...validations) => {
  const finalValidations = [
    query('playerId').notEmpty().isAlphanumeric().isLength({ min: 16, max: 20 }),
    ...validations
  ];

  return validate(...finalValidations);
}

export const validate = (...validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);

      if (!result.isEmpty()) {
        return res.status(400).json({
          errors: result.array({ onlyFirstError: true })
        });
      }
    }

    next();
  };
};
