import Joi from 'joi';

//verifica se tudo tá ok pra registrat user novo
export const registerValidation = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(data);
}

//mesma coisa, mas pra login - só email e senha
export const loginValidation = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(data);
}

//validação de atualização de perfil
export const updateProfileValidation = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255),
    email: Joi.string().email().max(255),
  }).or('name', 'email'); // pelo menos um deve ser presente
  return schema.validate(data);
};

export const updatePasswordValidation = (data: any) => {
  const schema = Joi.object({
    oldPassword: Joi.string().min(6).max(255).required(),
    newPassword: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(data);
};