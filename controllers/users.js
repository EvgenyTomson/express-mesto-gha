const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  ERROR_CODE_INVALID_DATA,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT,
  dafaultErrorMessage,
} = require('../constants/constants');

const NotFoundError = require('../errors/notFoundError');
const RequestError = require('../errors/requestError');
const DefaultError = require('../errors/defaultError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    // .catch(next) - не работает!
    .catch((err) => next(err));
};

module.exports.getUserById = (req, res) => {
  console.log('getUserById');
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден.' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_INVALID_DATA).send({ message: 'Передан некорректный id пользователя.' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: dafaultErrorMessage });
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  console.log('getCurrentUser');
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))

    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Пользователь по указанному id не найден.');
      }
      if (err.name === 'CastError') {
        throw new RequestError('Передан некорректный id пользователя.');
      }
      throw new DefaultError(dafaultErrorMessage);
    })

    .catch((err) => next(err));

  // .catch(next)
};

module.exports.createUser = (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  console.log('createUser');

  bcrypt.hash(password, 16)
    .then((hash) => {
      User.create({
        email, password: hash, name, about, avatar,
      })
        .then((user) => res.status(201).send(user))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return res
              .status(ERROR_CODE_INVALID_DATA)
              .send({ message: 'Переданы некорректные данные при создании пользователя.' });
          }
          if (err.code === 11000) {
            // console.log('Пользователь с указанным e-mail уже зарегистрирован!');
            return res
              .status(409)
              .send({ message: 'Пользователь с указанным e-mail уже зарегистрирован!' });
          }
          console.log('мы тут');
          return res
            .status(ERROR_CODE_DEFAULT)
            .send({ message: dafaultErrorMessage });
        });
    });
};

// Логин:
module.exports.login = (req, res) => {
  console.log('login');
  const { email, password } = req.body;
  // console.log( email, password );

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // console.log('нет юзера');
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          const token = jwt.sign(
            { _id: user._id },
            'yeuiqdghd87e7eicdghyuct678ewrtjdbZJZTY',
            { expiresIn: '7d' },
          );
          return res.send({ token });
        });
    })
    .catch((err) => res.status(401).send({ message: err.message }));
};

module.exports.updateUser = (req, res) => {
  console.log('updateUser');
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным id не найден.' });
      }
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_INVALID_DATA).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: dafaultErrorMessage });
    });
};

module.exports.updateAvatar = (req, res) => {
  console.log('updateAvatar');
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным id не найден.' });
      }
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_INVALID_DATA).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: dafaultErrorMessage });
    });
};
