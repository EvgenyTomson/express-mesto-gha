const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  dafaultErrorMessage,
} = require('../constants/constants');

const AuthError = require('../errors/authError');
const ConflictError = require('../errors/conflictEror');
const NotFoundError = require('../errors/notFoundError');
const RequestError = require('../errors/requestError');
const DefaultError = require('../errors/defaultError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))

    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  console.log('getUserById');
  User.findById(req.params.userId)
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

    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
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

    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, 16)
    .then((hash) => {
      User.create({
        email, password: hash, name, about, avatar,
      })
        .then((user) => {
          /*
          не понимаю, но по какой-то причине в этом контроллере user приходит
          с полем password несмотря на наличие в схеме флага select: false.
          приходится удалять это поле самому.
          */
          const noPasswordUser = user.toObject({ useProjection: true });

          return res.status(201).send(noPasswordUser);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new RequestError('Переданы некорректные данные при создании пользователя.');
          }
          if (err.code === 11000) {
            throw new ConflictError('Пользователь с указанным e-mail уже зарегистрирован.');
          }
          throw new DefaultError(dafaultErrorMessage);
        })

        .catch(next);
    });
};

// Логин:
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль.');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильные почта или пароль.');
          }

          const token = jwt.sign(
            { _id: user._id },
            'yeuiqdghd87e7eicdghyuct678ewrtjdbZJZTY',
            { expiresIn: '7d' },
          );

          return res.send({ token });
        });
    })

    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Пользователь по указанному id не найден.');
      }
      if (err.name === 'ValidationError') {
        throw new RequestError('Переданы некорректные данные при обновлении профиля.');
      }
      throw new DefaultError(dafaultErrorMessage);
    })

    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Пользователь по указанному id не найден.');
      }
      if (err.name === 'ValidationError') {
        throw new RequestError('Переданы некорректные данные при обновлении аватара.');
      }
      throw new DefaultError(dafaultErrorMessage);
    })

    .catch(next);
};
