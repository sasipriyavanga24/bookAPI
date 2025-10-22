const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

const FILE_PATH = path.join(__dirname, 'books.json');

app.get('/books', (req, res) => {
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read file' });
        res.json(JSON.parse(data));
    });
});

app.get('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read file' });
        const book = JSON.parse(data).find(b => b.id === id);
        if (!book) return res.status(404).json({ error: 'Book not found' });
        res.json(book);
    });
});

app.post('/books', (req, res) => {
    const newBook = req.body;
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read file' });
        const books = JSON.parse(data);
        books.push(newBook);
        fs.writeFile(FILE_PATH, JSON.stringify(books, null, 2), err => {
            if (err) return res.status(500).json({ error: 'Failed to write file' });
            res.status(201).json(newBook);
        });
    });
});

app.put('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedBook = req.body;
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read file' });
        const books = JSON.parse(data);
        const index = books.findIndex(b => b.id === id);
        if (index === -1) return res.status(404).json({ error: 'Book not found' });
        books[index] = updatedBook;
        fs.writeFile(FILE_PATH, JSON.stringify(books, null, 2), err => {
            if (err) return res.status(500).json({ error: 'Failed to write file' });
            res.json(updatedBook);
        });
    });
});

app.delete('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read file' });
        let books = JSON.parse(data);
        const initialLength = books.length;
        books = books.filter(b => b.id !== id);
        if (books.length === initialLength) return res.status(404).json({ error: 'Book not found' });
        fs.writeFile(FILE_PATH, JSON.stringify(books, null, 2), err => {
            if (err) return res.status(500).json({ error: 'Failed to write file' });
            res.json({ message: 'Book deleted successfully' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
