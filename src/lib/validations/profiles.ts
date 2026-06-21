import Joi from 'joi';

export const updatePasswordValidation = (data: any) => {
  const schema = Joi.object({
    oldPassword: Joi.string().min(6).max(255).required(),
    newPassword: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(data);
};

export const updateProfileValidation = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255),
    email: Joi.string().email().max(255),
  }).or('name', 'email');
  return schema.validate(data);
};