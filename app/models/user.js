const client = require('../config/db');
const { ApiError } = require('../helpers/errorHandler');

module.exports = {

    /**
     * find user by email
     * @param {string} email - Email of user
     * @returns {User} - Return User
     */
    async findByEmail(email) {
        const result = await client.query('SELECT * FROM "user" WHERE email = $1', [email]);
        if (result.rowCount === 0) {
            return null;
        }

        return result.rows[0];
    },

    async insert(
        email,
        firstName,
        lastName,
        encryptedPassword,
    ) {
        const savedUser = await client.query(
            'INSERT INTO "user" ("email", "first_name", "last_name", password) VALUES ($1, $2, $3, $4) RETURNING *',
            [
                email,
                firstName,
                lastName,
                encryptedPassword,
            ],
        );
        return savedUser.rows[0];
    },

    async findByPk(id) {
        const result = await client.query('SELECT * FROM "user" WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return null;
        }

        return result.rows[0];
    },

};
