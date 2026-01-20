// book-rent-api/middleware/validate.js
const { ZodError } = require('zod');

const validate = (schema) => async (req, res, next) => {
  try {
    const parsed = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // parsed = { body: {...}, query: {...}, params: {...} }
    req.validated = parsed;

    return next();
  } catch (error) {
    console.error('Validation error:', error);

    if (error instanceof ZodError) {
      const errorMessages = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json({
        message: errorMessages[0]?.message || 'Validation failed',
        errors: errorMessages,
      });
    }

    return res.status(500).json({ message: 'Internal validation error' });
  }
};

module.exports = validate;