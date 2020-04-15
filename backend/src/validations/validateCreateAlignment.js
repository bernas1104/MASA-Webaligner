const { celebrate, Segments, Joi } = require('celebrate');

module.exports = celebrate({
    [Segments.BODY]: Joi.object().keys({
        extension: Joi.number().integer().required().min(1).max(3),

        only1: Joi.boolean().allow('', null).default(false),
        
        clearn: Joi.boolean().allow('', null).default(false),
        complement: Joi.number().integer().min(1).max(3).allow('', null).default(null),
        reverse: Joi.number().integer().min(1).max(3).allow('', null).default(null),
        blockPruning: Joi.boolean().allow('', null).default(true),

        s0type: Joi.number().integer().required().min(1).max(3),
        s1type: Joi.number().integer().required().min(1).max(3),
        s0edge: Joi.string().required().length(1).regex(/^[1-3|+|*]{1}$/),
        s1edge: Joi.string().required().length(1).regex(/^[1-3|+|*]{1}$/),
        s0input: Joi.string().allow('', null),
        s1input: Joi.string().allow('', null),

        name: Joi.string().allow(''),
        email: Joi.string().allow('').email()
    }),
});