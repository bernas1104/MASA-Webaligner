import { celebrate, Segments, Joi } from 'celebrate';

export default celebrate({
  [Segments.BODY]: Joi.object().keys({
    extension: Joi.number().integer().required().min(1).max(3),
    type: Joi.string()
      .required()
      .regex(/^(local|global)$/)
      .default('local'),

    only1: Joi.boolean().allow('', null).default(false),

    clearn: Joi.boolean().allow('', null).default(false),
    complement: Joi.number().integer().min(0).max(3).allow('', null).default(0),
    reverse: Joi.number().integer().min(0).max(3).allow('', null).default(0),
    block_pruning: Joi.boolean().allow('', null).default(true),

    s0origin: Joi.number().integer().required().min(1).max(3),
    s1origin: Joi.number().integer().required().min(1).max(3),
    s0input: Joi.string().allow('', null),
    s1input: Joi.string().allow('', null),

    full_name: Joi.string().allow(''),
    email: Joi.string().allow('').email(),
  }),
});
