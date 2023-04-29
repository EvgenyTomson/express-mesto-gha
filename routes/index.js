const router = require('express').Router();

const cardsRouter = require('./cards');
const usersRouter = require('./users');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('/*', (req, res) => res.status(404).send({ message: 'Запись не найдена!' }));

module.exports = router;
