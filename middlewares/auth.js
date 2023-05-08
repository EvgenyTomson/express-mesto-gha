const jwt = require('jsonwebtoken');

const { AuthError } = require('../errors/authError');

module.exports = (req, res, next) => {
  // console.log('Auth');
  // console.log(req.headers);
  const { authorization } = req.headers;
  // console.log(authorization);

  if (!authorization || !authorization.startsWith('Bearer ')) {
    // console.log('но autorization');
    throw new AuthError('Необходима авторизация');
    // return res.status(401).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  // console.log(token);

  try {
    payload = jwt.verify(token, 'yeuiqdghd87e7eicdghyuct678ewrtjdbZJZTY');
  } catch (err) {
    throw new AuthError('Необходима авторизация');
    // return res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  // console.log(payload);
  next();
};
