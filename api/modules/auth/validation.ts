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
      username: joi.string().trim().required(),
      email: joi.string().trim().email().required(),
      phoneNumber: joi.string().trim().required(),
      password: joi.string().required(),
      fullName: joi.string().trim().required(),
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
      newPassword: joi.string().required(),
      confirmPassword: joi.string().required(),
    }),
  },
};

export default AuthValidation;
