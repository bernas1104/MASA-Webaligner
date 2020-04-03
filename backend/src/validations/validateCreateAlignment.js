const { celebrate, Segments, Joi } = require('celebrate');

module.exports = celebrate({
    [Segments.BODY]: Joi.object().keys({
        extension: Joi.number().required().min(1).max(3),
        s0type: Joi.number().required().min(1).max(3),
        s1type: Joi.number().required().min(1).max(3),
        s0edge: Joi.string().required().length(1).regex(/^[1-3|+|*]{1}$/),
        s1edge: Joi.string().required().length(1).regex(/^[1-3|+|*]{1}$/),
        s0input: Joi.string().allow('', null),
        s1input: Joi.string().allow('', null),
        name: Joi.string().allow(''),
        email: Joi.string().allow('').email()
    }),
});