class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class RequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class DefaultError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}

module.exports = {
  NotFoundError,
  AuthError,
  RequestError,
  DefaultError,
};
