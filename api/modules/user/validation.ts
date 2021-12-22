import joi from '../../util/joi';

/**
 * Special user validations to sanitize and analyze request bodies and parameters.
 */
const UserValidation = {
  // POST /api/v1/users
  createUser: {
    body: joi.object().keys({
      username: joi.string().trim().required(),
      email: joi.string().trim().email().required(),
      phoneNumber: joi.string().trim().required(),
      password: joi.string().required(),
      fullName: joi.string().trim().required(),
    }),
  },

  // GET /api/v1/users/:id
  getUser: {
    params: joi.object().keys({
      id: joi
        .string()
        .guid({ version: ['uuidv4'] })
        .required(),
    }),
  },

  // PUT /api/v1/users/:id
  updateUser: {
    body: joi.object().keys({
      email: joi.string().trim().email(),
      phoneNumber: joi.string().trim(),
      password: joi.string(),
      fullName: joi.string().trim(),
    }),
    params: joi.object().keys({
      id: joi
        .string()
        .guid({ version: ['uuidv4'] })
        .required(),
    }),
  },

  // DELETE /api/v1/users/:id
  deleteUser: {
    params: joi.object().keys({
      id: joi
        .string()
        .guid({ version: ['uuidv4'] })
        .required(),
    }),
  },
};

export default UserValidation;
