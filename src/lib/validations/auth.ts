import Joi from 'joi';

const usernameSchema = Joi.string()
  .min(3)
  .max(50)
  .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .messages({
    'string.pattern.base':
      'Username must contain only lowercase letters, numbers, and hyphens',
  });

export const registerValidation = (data: unknown) => {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    username: usernameSchema.required(),
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(data);
};

export const loginValidation = (data: unknown) => {
  const schema = Joi.object({
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(data);
};
