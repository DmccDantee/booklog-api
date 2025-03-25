
const Book = require('../models/bookModel');

exports.getAllBooks = async (req, res) => {
  const books = await Book.find();
  res.status(200).json({
    status: 'success',
    results: books.length,
    data: { books }
  });
};

exports.createBook = async (req, res) => {
  const newBook = await Book.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { book: newBook }
  });
};

exports.getBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: { book }
  });
};

exports.updateBook = async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    data: { book }
  });
};

exports.deleteBook = async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.status(204).json({ status: 'success', data: null });
};
