import defaultJoi from 'joi';

/**
 * Default JOI for our application.
 */
const joi = defaultJoi.defaults((schema) =>
  schema.options({
    abortEarly: true,
    convert: true,
    stripUnknown: false,
    errors: { escapeHtml: true },
  })
);

export default joi;
