import type { schema } from 'express-validation';
import { validate as expressValidation } from 'express-validation';

/**
 * Allows to perform a customized validation with `express-validation`. We give
 * `joi` access to the `context`, so `joi` can modify the request object with
 * the proper minor and required conversions from `util/joi.ts`. This is intentional
 * so it does not annoy the user with minor inconveniences, for example let's imagine a
 * web service that tells you to:
 *
 * - 'Username should be lowercase only.'
 * - 'Username could not have trailing spaces.'
 * - 'Username should be normalized.'
 *
 * Isn't that annoying having to fix minor errors like that?
 *
 * @param schema - Joi schema.
 * @returns Express Validation function callback.
 */
const validate = (schema: schema) =>
  expressValidation(schema, { context: true });

export default validate;
