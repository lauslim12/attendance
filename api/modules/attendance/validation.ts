import joi from '../../util/joi';

/**
 * Special attendance validations to sanitize and analyze request bodies and parameters.
 */
const AttendanceValidation = {
  // POST /api/v1/attendance/in
  in: {
    body: joi.object().keys({
      remarksEnter: joi.string().trim(),
    }),
  },
};

export default AttendanceValidation;
