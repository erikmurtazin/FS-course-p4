const blogsRouter = require('express').Router();
const Blog = require('../models/blog.js');
blogsRouter.get('/', async (request, response, next) => {
  try {
    const body = await Blog.find({});
    response.status(200).json(body);
  } catch (error) {
    next(error);
  }
});
blogsRouter.post('/', async (request, response, next) => {
  try {
    let { title, author, url, likes } = request.body;
    if (likes === null) {
      likes = 0;
    }
    if (!title || !author || !url) {
      return response.status(400).json({ error: 'Bad request' });
    }
    const blog = new Blog({ title, author, url, likes });
    const result = await blog.save();
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
    const result = await Blog.findByIdAndDelete(id);
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

module.exports = blogsRouter;
