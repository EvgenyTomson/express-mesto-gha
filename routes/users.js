const usersRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  // createUser,
  updateUser,
  getCurrentUser,
  updateAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/me', getCurrentUser);
usersRouter.get('/:userId', getUserById);
// usersRouter.post('/', createUser);
usersRouter.patch('/me', updateUser);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
