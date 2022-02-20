import joi from '../../util/joi';

/**
 * Special auth validations to sanitize and analyze request bodies and parameters.
 */
const AuthValidation = {
  // POST /api/v1/auth/login
  login: {
    body: joi.object().keys({
      username: joi.string().trim().required(),
      password: joi.string().required(),
    }),
  },

  // POST /api/v1/auth/register
  register: {
    body: joi.object().keys({
      username: joi.string().trim().required().max(15),
      email: joi.string().trim().email().lowercase().required().max(50),
      phoneNumber: joi.string().trim().required().max(20),
      password: joi.string().required().min(8).max(64),
      fullName: joi.string().trim().required().max(30),
    }),
  },

  // POST /api/v1/auth/otp?media=...
  sendOTP: {
    query: joi.object().keys({
      media: joi.string().valid('email', 'sms', 'authenticator').required(),
    }),
  },

  // PATCH /api/v1/auth/update-password
  updatePassword: {
    body: joi.object().keys({
      currentPassword: joi.string().required(),
      newPassword: joi.string().required().min(8).max(64),
      confirmPassword: joi.string().required().min(8).max(64),
    }),
  },

  // PATCH /api/v1/auth/verify-email
  verifyEmail: {
    params: joi.object().keys({
      code: joi.string().required(),
      email: joi.string().trim().email().lowercase().required(),
    }),
  },
};

export default AuthValidation;
