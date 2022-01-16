import joi from '../../util/joi';

/**
 * Special session validations to sanitize and analyze request bodies and parameters.
 */
const SessionValidation = {
  // DELETE /api/v1/sessions/me/:id
  deleteUserSession: {
    params: joi.object().keys({
      id: joi.string().required(),
    }),
  },

  // DELETE /api/v1/sessions/:id
  deleteSession: {
    params: joi.object().keys({
      id: joi.string().required(),
    }),
  },
};

export default SessionValidation;
