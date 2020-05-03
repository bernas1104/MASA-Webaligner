import { celebrate, Segments, Joi } from 'celebrate';

export default celebrate({
  [Segments.BODY]: Joi.object().keys({
    extension: Joi.number().integer().required().min(1).max(3),

    only1: Joi.boolean().allow('', null).default(false),

    clearn: Joi.boolean().allow('', null).default(false),
    complement: Joi.number().integer().min(0).max(3).allow('', null).default(0),
    reverse: Joi.number().integer().min(0).max(3).allow('', null).default(0),
    blockPruning: Joi.boolean().allow('', null).default(true),

    s0origin: Joi.number().integer().required().min(1).max(3),
    s1origin: Joi.number().integer().required().min(1).max(3),
    s0edge: Joi.string()
      .required()
      .length(1)
      .regex(/^[1-3|+|*]{1}$/),
    s1edge: Joi.string()
      .required()
      .length(1)
      .regex(/^[1-3|+|*]{1}$/),
    s0input: Joi.string().allow('', null),
    s1input: Joi.string().allow('', null),

    fullName: Joi.string().allow(''),
    email: Joi.string().allow('').email(),
  }),
});
