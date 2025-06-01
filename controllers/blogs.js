const blogsRouter = require('express').Router();
const Blog = require('../models/blog.js');
const User = require('../models/user.js');

blogsRouter.get('/', async (request, response, next) => {
  try {
    const body = await Blog.find({}).populate('user', {
      username: 1,
      name: 1,
      id: 1,
    });
    response.status(200).json(body);
  } catch (error) {
    next(error);
  }
});
blogsRouter.post('/', async (request, response, next) => {
  try {
    let { likes } = request.body;
    const { title, author, url } = request.body;
    if (typeof likes !== 'number') {
      likes = 0;
    }
    if (![title, author, url].every(isNonEmptyString)) {
      return response.status(400).json({ error: 'Bad request' });
    }
    const user = request.user;
    if (!user) {
      return response.status(500).json({ error: 'Internal Server Error' });
    }
    const blog = new Blog({ title, author, url, likes, user: user.id });
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog.id);
    await user.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});
blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const id = request.params.id;
    const blog = await Blog.findById(id);
    if (!blog) {
      return response.status(400).json({ error: 'Bad request' });
    }
    const updatedBlog = { likes: blog.likes + 1 };
    const result = await Blog.findByIdAndUpdate(id, updatedBlog, { new: true });
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
});
blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const id = request.params.id;
    const blog = await Blog.findById(id);
    if (!blog) {
      return response.sendStatus(404);
    }
    return response.status(200).json(blog);
  } catch (error) {
    next(error);
  }
});
blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const id = request.params.id;
    const blog = await Blog.findById(id);
    if (!blog) {
      return response.sendStatus(404);
    }
    const user = request.user;
    if (blog.user.toString() !== user.id) {
      return response.status(403).json({ error: 'wrong user' });
    }
    const result = await blog.deleteOne();
    if (result) {
      response.status(204).end();
    } else {
      response.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const id = request.params.id;
    const likes = request.body.likes;
    if (likes === undefined || likes === null) {
      return response.status(400).json({ error: 'Bad request' });
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      return response.sendStatus(404);
    }
    blog.likes = likes;
    await blog.save();
    return response.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

module.exports = blogsRouter;
