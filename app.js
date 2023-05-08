const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const DB_URI = 'mongodb://localhost:27017/mestodb';
const { PORT = 3000 } = process.env;
const app = express();

const { login, createUser } = require('./controllers/users');

const authMiddleware = require('./middlewares/auth');
const catchErrorsMiddleware = require('./middlewares/catchErrors');
// console.log(catchErrorsMiddleware);

// const authMiddleware = (req, res, next) => {
//   req.user = {
//     // _id: '644a458fd82a209f58c7af13',
//     _id: '6456a2b9ad5ebd76d4c94e1b',
//   };

//   next();
// };

app.use(express.json());

mongoose.connect(DB_URI, {});

app.post('/signin', login);
app.post('/signup', createUser);

app.use(authMiddleware);
app.use('/', require('./routes/index'));

app.use(errors({ message: 'Ошибка валидации данных!' }));
app.use(catchErrorsMiddleware);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
