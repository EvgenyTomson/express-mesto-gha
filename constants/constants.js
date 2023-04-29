const DB_URI = 'mongodb://localhost:27017/mestodb';
const ERROR_CODE_INVALID_DATA = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_DEFAULT = 500;
const dafaultErrorMessage = 'На сервера произошла ошибка.';

module.exports = {
  DB_URI,
  ERROR_CODE_INVALID_DATA,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT,
  dafaultErrorMessage,
};
