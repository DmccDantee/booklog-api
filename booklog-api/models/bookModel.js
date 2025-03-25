
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book must have a title']
  },
  author: {
    type: String,
    required: [true, 'Book must have an author']
  },
  pages: {
    type: Number,
    required: [true, 'Book must have a page count']
  },
  summary: {
    type: String
  }
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
