const Card = require('../models/card');
const {
  dafaultErrorMessage,
} = require('../constants/constants');

const ForbiddenError = require('../errors/forbiddenError');
const NotFoundError = require('../errors/notFoundError');
const RequestError = require('../errors/requestError');
const DefaultError = require('../errors/defaultError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const currentUserId = req.user._id;

  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      const ownerId = card.owner.toString();
      if (ownerId !== currentUserId) {
        throw new ForbiddenError('Вы не автор этой карточки.');
      }
      return card;
    })
    .then((card) => Card.deleteOne(card))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Карточка с указанным id не найдена.');
      }
      if (err.name === 'CastError') {
        throw new RequestError('Передан некорректный id карточки.');
      }
      if (err.statusCode === 403) {
        throw new ForbiddenError('Вы не автор этой карточки.');
      }
      throw new DefaultError(dafaultErrorMessage);
    })

    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new RequestError('Переданы некорректные данные при создании карточки.');
      }
      throw new DefaultError(dafaultErrorMessage);
    })

    .catch(next);
};

module.exports.addLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Карточка с указанным id не найдена.');
      }
      if (err.name === 'CastError') {
        throw new RequestError('Передан некорректный id карточки.');
      }
      throw new DefaultError(dafaultErrorMessage);
    })

    .catch(next);
};

module.exports.deleteLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Карточка с указанным id не найдена.');
      }
      if (err.name === 'CastError') {
        throw new RequestError('Передан некорректный id карточки.');
      }
      throw new DefaultError(dafaultErrorMessage);
    })

    .catch(next);
};
