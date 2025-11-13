const db = require('../db/connection');
const { nanoid } = require('nanoid');


//Main routes
const main = (req, res) => {
    res.status(200).json({
        application: "Bookshelf API",
        version: "1.0.0",
        author: "FUN",
        message: "Welcome to Bookshelf API SAIA 📚",
        endpoints: {
            getAllBooks: "/books",
            addBook: "/books (POST)",
            getBookById: "/books/:bookId",
        }
    });
};

//Add Book
const addBook = (req, res) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body;
    const id = nanoid(10);
    const timestamp = new Date().toISOString();
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
        const column = "id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt";
        const values = `'${id}', '${name}', ${year}, '${author}', '${summary}', '${publisher}', ${pageCount}, ${readPage}, ${finished}, ${reading}, '${timestamp}', '${timestamp}'`;
        const query = `INSERT INTO books (${column}) VALUES (${values})`;

        db.query(query, (error, result) => {
            if (error) console.log(error);
            else {
                console.log(result);
                res.status(201).json({
                    "status": "success",
                    "message": "Buku berhasil ditambahkan",
                    "data": {
                        "bookId": id
                    }
                });
            }
        });
    }
};

//Get by name/?finished/?reading/all
const getBook = (req, res) => {
    const queryName = req.query.name;
    const queryFinished = req.query.finished;
    const queryReading = req.query.reading;
    const sqlName = `SELECT id, name, publisher FROM books WHERE name LIKE '%${queryName}%'`;
    const sqlFinished = `SELECT id, name, publisher FROM books WHERE finished = ${queryFinished}`;
    const sqlReading = `SELECT id, name, publisher FROM books WHERE reading = ${queryReading}`;
    const sqlBooks = `SELECT id, name, publisher FROM books`;

    //get book name
    if (queryName) {
        db.query(sqlName, (error, result) => {
            if (error) {
                console.log(error);
            }
            else {
                res.status(200).json({
                    "status": "success",
                    "data": {
                        "books": result
                    }
                });
            }
        });
    }

    //get book by ?finished
    else if (queryFinished == 1) {
        db.query(sqlFinished, (error, result) => {
            if (error) {
                console.log(error);
            }
            else {
                res.status(200).json({
                    "status": "success",
                    "data": {
                        "books": result
                    }
                });
            }
        });
    }

    else if (queryFinished == 0) {
        db.query(sqlFinished, (error, result) => {
            if (error) {
                console.log(error);
            }
            else {
                res.status(200).json({
                    "status": "success",
                    "data": {
                        "books": result
                    }
                });
            }
        });
    }

    //get book by ?finished
    else if(queryReading == 1) {
        db.query(sqlReading, (error, result) => {
            if (error) {
                console.log(error);
            }
            else {
                res.status(200).json({
                    "status": "success",
                    "data": {
                        "books": result
                    }
                });
            }
        });
    }

    else if (queryReading == 0) {
        db.query(sqlReading, (error, result) => {
            if (error) {
                console.log(error);
            }
            else {
                res.status(200).json({
                    "status": "success",
                    "data": {
                        "books": result
                    }
                });
            }
        });
    }

    else {
        db.query(sqlBooks, (error, result) => {
            if (error) {
                console.log(error);
            }
            else {
                res.status(200).json({
                    "status": "success",
                    "data": {
                        "books": result
                    }
                });
            }
        });
    }
};

//Get book by id
const getBookId = (req, res) => {
    const bookId = req.params.bookId;
    const sql = `SELECT * FROM books WHERE id = '${bookId}'`;

    db.query(sql, (error, result) => {
        if (error) console.log(error);

        if (result.length === 0) {
            res.status(404).json({
                "status": "fail",
                "message": "Buku tidak ditemukan"
            });
        }
        else {
            const book = result[0];
            book.finished = Boolean(book.finished);
            book.reading = Boolean(book.reading);
            res.status(200).json({
                "status": "success",
                "data": {
                    "book": book,
                }
            });
        }
    });
};

//Update Book
const updateBook = (req, res) => {
    const bookId = req.params.bookId;
    const timestamp = new Date().toISOString();
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body;
    const query = `UPDATE books SET name = '${name}', year = ${year}, author = '${author}', summary = '${summary}', publisher = '${publisher}', pageCount = ${pageCount}, readPage = ${readPage}, reading = ${reading}, updatedAt = '${timestamp}'  WHERE id = '${bookId}'`;

    if (!name) {
        res.status(400).json({
            "status": "fail",
            "message": "Gagal memperbarui buku. Mohon isi nama buku"
        });
    }

    else if (pageCount < readPage) {
        res.status(400).json({
            "status": "fail",
            "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        });
    }

    else {
        db.query(query, (error, result) => {
            if (error) console.log(error);

            if (result.affectedRows === 0) {
                res.status(400).json({
                    "status": "fail",
                    "message": "Gagal memperbarui buku. Id tidak ditemukan"
                });
            }
            else {
                res.status(200).json({
                    "status": "success",
                    "message": "Buku berhasil diperbarui"
                });
            }
        });
    }
};

//Delete Book
const deleteBook = (req, res) => {
    const params = req.params.bookId;
    const query = `DELETE FROM books WHERE id = "${params}"`;

    db.query(query, (error, result) => {
        if (error) console.log(error);
        if (result.affectedRows === 0) {
            res.status(404).json({
                "status": "fail",
                "message": "Buku gagal dihapus. Id tidak ditemukan"
            });
        }
        else {
            res.status(200).json({
                "status": "success",
                "message": "Buku berhasil dihapus"
            })
        }
    });
};


module.exports = { main, addBook, getBook, getBookId, updateBook, deleteBook };