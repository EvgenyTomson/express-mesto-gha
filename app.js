const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { PORT, DB_URI } = require('./config');

const app = express();

const { login, createUser } = require('./controllers/users');

const authMiddleware = require('./middlewares/auth');
const catchErrorsMiddleware = require('./middlewares/catchErrors');
const { createUserJoi, loginJoi } = require('./middlewares/celebrate');

app.use(express.json());

mongoose.connect(DB_URI, {});

app.post('/signin', loginJoi, login);
app.post('/signup', createUserJoi, createUser);

app.use(authMiddleware);
app.use('/', require('./routes/index'));

app.use(errors({ message: 'Ошибка валидации данных!' }));
app.use(catchErrorsMiddleware);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
