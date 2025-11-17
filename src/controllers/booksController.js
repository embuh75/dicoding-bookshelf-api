const books = [];
const { nanoid } = require('nanoid');


//Main routes
const main = (req, res) => {
    res.status(200).json({
        application: "Bookshelf API",
        version: "1.0.0",
        author: "FUN",
        message: "Welcome to Bookshelf API FUN 📚",
        endpoints: {
            addBook: "/books (POST)",
            getAllBooks: "/books",
            getBookById: "/books/:bookId",
            updataBook: "/books/:bookId (PUT)",
            deleteBook: "/books/:bookId (DELETE)"
        }
    });
};

//Add Book
const addBook = (req, res) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body;
    const id = nanoid(10);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    if (!name) {
        res.status(400).json({
            "status": "fail",
            "message": "Gagal menambahkan buku. Mohon isi nama buku"
        });
    }

    else if (pageCount < readPage) {
        res.status(400).json({
            "status": "fail",
            "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        });
    }

    else {
        const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt };
        books.push(newBook);

        res.status(201).json({
            "status": "success",
            "message": "Buku berhasil ditambahkan",
            "data": {
                "bookId": id
            }
        });
    }
};

//Get by name/?finished/?reading/all
const getBook = (req, res) => {
    const { name, reading, finished } = req.query;
    let filtered = books;


    if (name) {
        filtered = filtered.filter((books) => books.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (reading !== undefined) {
        filtered = filtered.filter((books) => Number(books.reading) === Number(reading));
    }

    if (finished !== undefined) {
        filtered = filtered.filter((books) => Number(books.finished) === Number(finished));
    }
    

    const response = filtered.map((books) => ({
        id: books.id,
        name: books.name,
        publisher: books.publisher
    }));

    res.status(200).json({
        status: 'success',
        data: { books: response },
    });
};

//Get book by id
const getBookId = (req, res) => {
    const book = books.find((book) => book.id === req.params.bookId);

    if (!book) {
        return res.status(404).json({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        });
    }

    else {
        res.status(200).json({
            status: 'success',
            data: { book }
        });
    }
};

//Update Book
const updateBook = (req, res) => {
    const { bookId } = req.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body;
    const findBooks = books.findIndex((book) => book.id === bookId);

    if (findBooks === -1) {
        res.status(404).json({
            "status": "fail",
            "message": "Gagal memperbarui buku. Id tidak ditemukan"
        });
    }

    else if (!name) {
        res.status(400).json({
            "status": "fail",
            "message": "Gagal memperbarui buku. Mohon isi nama buku"
        });
    }

    else if (readPage > pageCount) {
        res.status(400).json({
            "status": "fail",
            "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        });
    }

    else {
        const updatedAt = new Date().toISOString();
        const finished = pageCount === readPage;

        books[findBooks] = {
            ...books[findBooks],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt
        }

        res.status(200).json({
            "status": "success",
            "message": "Buku berhasil diperbarui"
        });
    }
};

//Delete Book
const deleteBook = (req, res) => {
    const { bookId } = req.params;
    const findBooks = books.findIndex((book) => book.id === bookId);

    if (findBooks === -1) {
        res.status(404).json({
            "status": "fail",
            "message": "Buku gagal dihapus. Id tidak ditemukan"
        });
    }

    else {
        books.splice(findBooks, 1);
        res.status(200).json({
            "status": "success",
            "message": "Buku berhasil dihapus"
        });
    }
};


module.exports = { main, addBook, getBook, getBookId, updateBook, deleteBook };