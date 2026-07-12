import Joi from 'joi';

const slugSchema = Joi.string()
  .max(255)
  .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .messages({
    'string.pattern.base': 'Slug must contain only lowercase letters, numbers, and hyphens',
  });

export const createProductValidation = (data: unknown) => {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    slug: slugSchema.optional(),
    tagline: Joi.string().max(255).required(),
    description: Joi.string().allow('', null).optional(),
    url: Joi.string().uri().required(),
    tags: Joi.array().items(Joi.string().trim().max(50)).max(5).optional(),
    logo_url: Joi.string().uri().allow('', null).optional(),
  });
  return schema.validate(data);
};

export const updateProductValidation = (data: unknown) => {
  const schema = Joi.object({
    name: Joi.string().max(255),
    slug: slugSchema,
    tagline: Joi.string().max(255),
    description: Joi.string().allow('', null),
    url: Joi.string().uri(),
    tags: Joi.array().items(Joi.string().trim().max(50)).max(5).optional(),
  }).or('name', 'slug', 'tagline', 'description', 'url', 'tags');
  return schema.validate(data);
};
