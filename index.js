const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const FILE_PATH = path.join(__dirname, 'books.json');

app.get('/', (req, res) => {
    res.send('Welcome to the Book API! Use /books to see all books.');
});

function readBooks() {
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

function writeBooks(books) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(books, null, 2));
}

app.get('/books', (req, res) => {
    const books = readBooks();
    res.json(books);
});

app.get('/books/available', (req, res) => {
    const books = readBooks();
    const availableBooks = books.filter(b => b.available);
    res.json(availableBooks);
});

app.post('/books', (req, res) => {
    const { title, author, available } = req.body;
    if (!title || !author || available === undefined) {
        return res.status(400).json({ error: 'Invalid book data' });
    }

    const books = readBooks();
    const newBook = {
        id: books.length > 0 ? books[books.length - 1].id + 1 : 1,
        title,
        author,
        available
    };
    books.push(newBook);
    writeBooks(books);
    res.status(201).json(newBook);
});

app.put('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const { title, author, available } = req.body;

    const books = readBooks();
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    if (title !== undefined) books[bookIndex].title = title;
    if (author !== undefined) books[bookIndex].author = author;
    if (available !== undefined) books[bookIndex].available = available;

    writeBooks(books);
    res.json(books[bookIndex]);
});

app.delete('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    let books = readBooks();
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const deletedBook = books.splice(bookIndex, 1)[0];
    writeBooks(books);
    res.json(deletedBook);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
