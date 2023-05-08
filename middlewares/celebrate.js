const { celebrate, Joi } = require('celebrate');

const getUserByIdJoi = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
});

const updateAvatarJoi = celebrate({
  body: Joi.object().keys({
    avatar: Joi
      .string()
      .required()
      .pattern(/(https?:\/\/)(w{3}\.)?\w+[-.~:/?#[\]@!$&'()*+,;=]*#?/),
  }),
});

const updateUserJoi = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const createCardJoi = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi
      .string()
      .required()
      .pattern(/(https?:\/\/)(w{3}\.)?\w+[-.~:/?#[\]@!$&'()*+,;=]*#?/),
  }),
});

const checkCardIdJoi = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
});

module.exports = {
  getUserByIdJoi,
  updateAvatarJoi,
  updateUserJoi,
  createCardJoi,
  checkCardIdJoi,
};
