const usersRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  // createUser,
  updateUser,
  getCurrentUser,
  updateAvatar,
} = require('../controllers/users');

// const { celebrate, Joi } = require('celebrate');
const { getUserByIdJoi, updateAvatarJoi, updateUserJoi } = require('../middlewares/celebrate');

usersRouter.get('/', getUsers);
usersRouter.get('/me', getCurrentUser);
usersRouter.get('/:userId', getUserByIdJoi, getUserById);
// usersRouter.post('/', createUser);
usersRouter.patch('/me', updateUserJoi, updateUser);
usersRouter.patch('/me/avatar', updateAvatarJoi, updateAvatar);

module.exports = usersRouter;
