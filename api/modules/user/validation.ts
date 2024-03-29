import joi from '../../util/joi';

/**
 * Special user validations to sanitize and analyze request bodies and parameters.
 */
const UserValidation = {
  // POST /api/v1/users
  createUser: {
    body: joi.object().keys({
      username: joi.string().normalize().trim().required().max(25),
      email: joi.string().trim().email().lowercase().required().max(50),
      phoneNumber: joi
        .string()
        .trim()
        .required()
        .max(20)
        .pattern(/^[-+0-9]+$/, { name: 'phone' }),
      password: joi.string().required().min(8).max(64),
      fullName: joi.string().trim().required().max(30),
      role: joi.string().valid('admin', 'user').default('user'),
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

  // GET /api/v1/users/:id
  getUser: {
    params: joi.object().keys({
      id: joi
        .string()
        .guid({ version: ['uuidv4'] })
        .required(),
    }),
  },

  // PATCH /api/v1/users/me
  updateMe: {
    body: joi.object().keys({
      email: joi.string().trim().lowercase().email().max(50),
      phoneNumber: joi
        .string()
        .trim()
        .max(20)
        .pattern(/^[-+0-9]+$/, { name: 'phone' }),
      fullName: joi.string().trim().max(30),
    }),
  },

  // PATCH /api/v1/users/:id
  updateUser: {
    body: joi.object().keys({
      username: joi.string().normalize().trim().max(25),
      email: joi.string().trim().lowercase().email().max(50),
      phoneNumber: joi
        .string()
        .trim()
        .max(20)
        .pattern(/^[-+0-9]+$/, { name: 'phone' }),
      password: joi.string().min(8).max(64),
      fullName: joi.string().trim().max(30),
      role: joi.string().valid('admin', 'user'),
      isActive: joi.boolean(),
    }),
    params: joi.object().keys({
      id: joi
        .string()
        .guid({ version: ['uuidv4'] })
        .required(),
    }),
  },
};

export default UserValidation;
