const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.status(200).send(cards))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then(card => res.status(200).send(card))
    .catch(err => {
      if(err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Карточка с указанным id не найдена.' });
      }
      if(err.name === 'CastError') {
        return res.status(400).send({ message: 'Передан некорректный id карточки.' });
      }
      res.status(500).send({ message: err.message });
    })
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then(card => res.status(201).send(card))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.addLikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then(card => res.status(200).send(card))
    .catch(err => {
      if(err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Передан несуществующий id карточки.' });
      }
      if(err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }
      res.status(500).send({ message: err.message })
    });
};

module.exports.deleteLikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .then(card => res.status(200).send(card))
    .catch(err => {
      if(err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Передан несуществующий id карточки.' });
      }
      if(err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      res.status(500).send({ message: err.message })
    });
};
