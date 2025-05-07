const config = require('./utils/config.js');
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs.js');
const middleware = require('./utils/middleware.js');
const express = require('express');
const app = express();

mongoose.connect(config.MONGODB_URI);

app.use(express.json());
app.use(middleware.requestLogger);
app.use('/api/blogs', blogsRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

module.exports = app;
