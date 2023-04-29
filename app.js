const express = require('express');
const mongoose = require('mongoose');

const DB_URI = 'mongodb://localhost:27017/mestodb';
console.log(DB_URI);
const { PORT = 3000 } = process.env;
const app = express();

const authMiddleware = (req, res, next) => {
  req.user = {
    _id: '644a458fd82a209f58c7af13',
  };

  next();
};

app.use(express.json());

mongoose.connect(DB_URI, {});

app.use(authMiddleware);
app.use('/', require('./routes/index'));

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
