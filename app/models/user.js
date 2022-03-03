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
        password,
    ) {
        const savedUser = await client.query(
            'INSERT INTO "user" ("email", "first_name", "last_name", password) VALUES ($1, $2, $3, $4) RETURNING *',
            [
                email,
                firstName,
                lastName,
                password,
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

    async update(id, user, password) {
        const result = await client.query('SELECT * FROM "user" WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            throw new ApiError(400, 'This user does not exists');
        }

        const oldUser = result.rows[0];
        const newUser = { ...oldUser, ...user };
        if (!password) {
            password = newUser.password;
        }
        console.log(password);
        console.log('mail ancien : ', oldUser.email);
        console.log('mail nouveau : ', newUser.email);
        const updatedUser = await client.query(
            'UPDATE "user" SET email = $1, first_name = $2, last_name = $3, password = $4 WHERE id = $5 RETURNING *',
            [
                newUser.email,
                newUser.first_name,
                newUser.last_name,
                password,
                id,
            ],
        );
        console.log('dans le model : ', updatedUser.rows[0]);
        return newUser.rows[0];
    },

};
