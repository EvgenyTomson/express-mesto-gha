const router = require('express').Router();
const NotFoundError = require('../errors/notFoundError');

const cardsRouter = require('./cards');
const usersRouter = require('./users');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('/*', (req, res, next) => {
  return next(new NotFoundError('Запись не найдена.'))
});

module.exports = router;
