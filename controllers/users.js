const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

usersRouter.post('/', async (request, response, next) => {
  try {
    const { username, password, name } = request.body;
    if (typeof username !== 'string' || username.includes(' ')) {
      return response.status(400).json({
        error: 'username must not contain spaces',
      });
    }
    if (typeof password !== 'string' || password.trim().length < 3) {
      return response.status(400).json({
        error: 'Password must be a string with at least 3 non-space characters',
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const cleandUsername = username.trim();
    const user = new User({ username: cleandUsername, name, passwordHash });
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});
usersRouter.get('/', async (request, response, next) => {
  try {
    const result = await User.find({}).populate('blogs', {
      url: 1,
      title: 1,
      author: 1,
      id: 1,
    });
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
module.exports = usersRouter;
