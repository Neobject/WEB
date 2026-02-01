const BookModel = require('../models/book.model');

const BookController = {
    getAll: async (req, res) => {
        try {
            const books = await BookModel.findAll();
            res.json(books);
        } catch (e) {
            res.status(500).json({ error: 'Database error' });
        }
    },

    getOne: async (req, res) => {
        try {
            const book = await BookModel.findById(+req.params.id);
            if (!book) return res.sendStatus(404);
            res.json(book);
        } catch (e) {
            res.status(500).json({ error: 'Database error' });
        }
    },

    create: async (req, res) => {
        try {
            await BookModel.save(req.body);
            res.sendStatus(201);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    delete: async (req, res) => {
        try {
            await BookModel.remove(+req.params.id);
            res.sendStatus(204);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
};

module.exports = BookController;
