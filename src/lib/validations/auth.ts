import Joi from 'joi';

export const registerValidation = (data: any) => {
  const schema = Joi.object({
    username: Joi.string().max(255).required(),
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(data);
}

export const loginValidation = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(data);
}

