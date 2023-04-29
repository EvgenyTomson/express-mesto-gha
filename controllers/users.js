const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then(user => res.send(user))
    .catch(err => {
      if(err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Пользователь по указанному id не найден.' });
      }
      if(err.name === 'CastError') {
        return res.status(400).send({ message: 'Передан некорректный id пользователя.' });
      }
      res.status(500).send({ message: err.message });
    })
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.status(201).send(user))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true})
    .orFail()
    .then(user => res.status(200).send(user))
    .catch(err => {
      if(err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Пользователь с указанным id не найден.' });
      }
      if(err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      res.status(500).send({ message: err.message })
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true})
    .orFail()
    .then(user => res.status(200).send(user))
    .catch(err => {
      if(err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Пользователь с указанным id не найден.' });
      }
      if(err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      res.status(500).send({ message: err.message })
    });
};

