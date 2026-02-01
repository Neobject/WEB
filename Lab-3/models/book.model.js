const pool = require('../db');

const BookModel = {
    findAll: async () => {
        const [rows] = await pool.query('CALL sp_get_books(-1)');
        return rows[0];
    },

    findById: async (id) => {
        const [rows] = await pool.query('CALL sp_get_books(?)', [id]);
        return rows[0][0];
    },

    save: async (data) => {
        await pool.query(
            'CALL sp_save_book(?, ?, ?, ?, ?, ?, ?, ?)',
            [
                data.id ?? -1,
                data.title,
                data.author_first_name,
                data.author_last_name,
                data.genre_name,
                data.publisher_name,
                data.pages,
                data.year
            ]
        );
    },

    remove: async (id) => {
        await pool.query('CALL sp_delete_book(?)', [id]);
    }
};

module.exports = BookModel;
