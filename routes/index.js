const router = require('express').Router();
const { ERROR_CODE_NOT_FOUND } = require('../constants/constants');

const cardsRouter = require('./cards');
const usersRouter = require('./users');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('/*', (req, res) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Запись не найдена!' });
});

module.exports = router;
