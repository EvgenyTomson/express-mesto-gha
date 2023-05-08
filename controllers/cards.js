const Card = require('../models/card');
const {
  ERROR_CODE_INVALID_DATA,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT,
  dafaultErrorMessage,
} = require('../constants/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: dafaultErrorMessage }));
};

module.exports.deleteCard = (req, res) => {
  console.log('deleteCard');
  const currentUserId = req.user._id;
  console.log('currentUserId = ', currentUserId);

  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      const ownerId = card.owner.toString();
      console.log('card owner id = ', ownerId);
      if (ownerId !== currentUserId) {
        console.log('ты не Хозяин!');
        // return res.status(ERROR_CODE_DEFAULT).send({ message: 'Вы не автор этой карточки!' });
        return Promise.reject(new Error('NotAuthor'));
      }
      return card;
    })
    .then((card) => Card.deleteOne(card))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена.' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_INVALID_DATA).send({ message: 'Передан некорректный id карточки.' });
      }
      if (err.message === 'NotAuthor') {
        return res.status(401).send({ message: 'Вы не автор этой карточки!' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: dafaultErrorMessage });
    });
};

module.exports.createCard = (req, res) => {
  console.log('createCard');
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_INVALID_DATA).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: dafaultErrorMessage });
    });
};

module.exports.addLikeCard = (req, res) => {
  console.log('addLikeCard');

  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Передан несуществующий id карточки.' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_INVALID_DATA).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: dafaultErrorMessage });
    });
};

module.exports.deleteLikeCard = (req, res) => {
  console.log('deleteLikeCard');

  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Передан несуществующий id карточки.' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_INVALID_DATA).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: dafaultErrorMessage });
    });
};
