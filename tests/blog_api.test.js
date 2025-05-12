const { test, after, beforeEach } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const api = supertest(app);

beforeEach(async () => {
  await helper.deleteBlogs();
  await helper.insertBlogs();
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    .expect(response => {
      if (response.body.length !== 6) {
        throw new Error('Wrong Length');
      }
    });
});
test('verifies that the unique identifier property of the blog posts is named id', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  response.body.forEach(blog => {
    if (!blog.id) {
      throw new Error('Expected blog to have "id" field');
    }
    if (blog._id) {
      throw new Error('Expected blog not to have "_id" field');
    }
  });
});
test('verifies that making an HTTP POST request to the /api/blogs URL successfully creates a new blog post', async () => {
  const newBlog = {
    title: 'Supertest POST example',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 5,
  };
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    .expect(response => {
      if (response.body.length !== 7) {
        throw new Error('Wrong Length');
      }
    })
    .expect(response => {
      const titles = response.body.map(blog => blog.title);
      if (!titles.includes('Supertest POST example')) {
        throw new Error('New blog post not found');
      }
    });
});
test('verifies that if the likes property is missing from the request, it will default to the value 0', async () => {
  await api
    .post('/api/blogs')
    .send({ title: 'Blog1', author: 'Author', url: 'fasdfjowefaw' })
    .expect(201)
    .expect('Content-Type', /application\/json/)
    .expect(response => {
      if (response.body.likes !== 0) {
        console.log(response.body.likes);
        throw new Error('Wrong number of likes');
      }
    });
});

test('verifies that if the title, author or url properties are missing from the request', async () => {
  await api
    .post('/api/blogs')
    .send({ title: 'Blog1', url: 'fasdfjowefaw' })
    .expect(400);
});
test('updating the number of likes for a blog post', async () => {
  const likes = 0;
  const id = '5a422a851b54a676234d17f7';
  await api.put(`/api/blogs/${id}`).send({ likes }).expect(200);
  await api
    .get(`/api/blogs/${id}`)
    .expect(200)
    .expect(response => {
      if (response.body.likes !== 0) {
        throw new Error('Wrong number of likes');
      }
    });
});
test('deleting a single blog', async () => {
  const id = '5a422a851b54a676234d17f7';
  await api.delete(`/api/blogs/${id}`).expect(204);
});

after(async () => {
  await mongoose.connection.close();
});
