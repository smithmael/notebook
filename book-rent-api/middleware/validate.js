// book-rent-api/middleware/validate.js

const validate = (schema) => async (req, res, next) => {
  try {
    // 1. Parse and validate the request against the provided schema
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    // 2. If validation is successful, call next() to proceed
    return next();

  } catch (error) {
    // 3. If validation fails, Zod throws an error. We catch it here.
    // We format the error to be more user-friendly.
    const errorMessages = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    
    // 4. Send a 400 Bad Request response with the validation errors
    return res.status(400).json({ errors: errorMessages });
  }
};

module.exports = validate;