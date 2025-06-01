const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  author: {
    type: String,
    require: true,
  },
  url: {
    type: String,
    require: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    if (
      returnedObject.user &&
      typeof returnedObject.user === 'object' &&
      returnedObject.user._id
    ) {
      returnedObject.user = {
        id: returnedObject.user._id.toString(),
      };
    }
  },
});
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
