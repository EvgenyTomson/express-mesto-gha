// const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// mongoose.connect('mongodb://localhost:27017/mestodb', {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false
// });
mongoose.connect('mongodb://localhost:27017/mestodb', {});

const authMiddleware = (req, res, next) => {
  req.user = {
    _id: '644a458fd82a209f58c7af13' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
}

app.use(authMiddleware);
app.use('/users', require('./routes/users'));

app.use(authMiddleware);
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
