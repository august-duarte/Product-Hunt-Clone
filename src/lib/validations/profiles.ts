import Joi from 'joi';

export const updatePasswordValidation = (data: unknown) => {
  const schema = Joi.object({
    oldPassword: Joi.string().min(6).max(255).required(),
    newPassword: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(data);
};

export const updateProfileValidation = (data: unknown) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255),
    email: Joi.string().email().max(255),
    username: Joi.string()
      .min(3)
      .max(50)
      .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .messages({
        'string.pattern.base':
          'Username must contain only lowercase letters, numbers, and hyphens',
      }),
  }).or('name', 'email', 'username');
  return schema.validate(data);
};
