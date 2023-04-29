// const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');

const DB_URI = 'mongodb://localhost:27017/mestodb';
const { PORT = 3000 } = process.env;
const app = express();

const authMiddleware = (req, res, next) => {
  req.user = {
    _id: '644a458fd82a209f58c7af13'
    // _id: '644a458fd82a209f58c7af13'
  };

  next();
}

app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// mongoose.connect('mongodb://localhost:27017/mestodb', {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false
// });
mongoose.connect(DB_URI, {});

app.use(authMiddleware);
app.use('/', require('./routes/index'));
// app.use('/users', require('./routes/users'));

// app.use(authMiddleware);
// app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
