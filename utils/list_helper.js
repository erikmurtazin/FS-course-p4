const totalLikes = blogs => {
  const sum = blogs.reduce((sum, blog) => {
    return sum + blog.likes;
  }, 0);
  return blogs.length === 0 ? 0 : sum;
};

const favoriteBlog = blogs => {
  return blogs.reduce(
    (favorite, blog) => (blog.likes > (favorite?.likes || 0) ? blog : favorite),
    null
  );
};

const mostBlogs = blogs => {
  const counts = {};

  for (const blog of blogs) {
    counts[blog.author] = (counts[blog.author] || 0) + 1;
  }
  const result = Object.entries(counts).reduce((most, [author, blogs]) => {
    return blogs > (most.blogs || 0) ? { author, blogs } : most;
  }, {});

  return result;
};

const mostLikes = blogs => {
  const counts = {};

  for (const blog of blogs) {
    counts[blog.author] = (counts[blog.author] || 0) + (blog.likes || 0);
  }
  const result = Object.entries(counts).reduce((most, [author, likes]) => {
    return likes > (most.likes || 0) ? { author, likes } : most;
  }, {});

  return result;
};

module.exports = { totalLikes, favoriteBlog, mostBlogs, mostLikes };
