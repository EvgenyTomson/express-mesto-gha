const { dafaultErrorMessage } = require('../constants/constants');

module.exports = (err, req, res, next) => {
  console.log('Попали в catchErrorsMiddleware');

  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? dafaultErrorMessage : message,
    });

  next();
};
