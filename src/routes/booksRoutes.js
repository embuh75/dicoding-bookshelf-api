const express = require('express');
const { main, addBook, getBook, getBookId, updateBook, deleteBook} = require('../controllers/booksController');

const route = express.Router();

//Routes
route.get('/', main); //Main route
route.post('/books', addBook); //Add book
route.get('/books', getBook); //Get * books
route.get('/books/:bookId', getBookId); //Get book by id
route.put('/books/:bookId', updateBook); //Update book
route.delete('/books/:bookId', deleteBook); //Delete book

module.exports = route;