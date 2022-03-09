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
        const result = await client.query('SELECT "id", "email", "first_name", "last_name", "image" FROM "user" WHERE id = $1', [id]);
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
        const updatedUser = await client.query(
            'UPDATE "user" SET email = $1, first_name = $2, last_name = $3 WHERE id = $4 RETURNING id, email, first_name, last_name, image',
            [
                newUser.email,
                newUser.first_name,
                newUser.last_name,
                id,
            ],
        );
        return updatedUser.rows[0];
    },

    async updateImage(id, image) {
        // const result = await client.query('SELECT * FROM "user" WHERE id = $1', [id]);
        // if (result.rowCount === 0) {
        //     throw new ApiError(400, 'This user does not exists');
        // }
        const newUser = await client.query(
            'UPDATE "user" SET "image" = $1 WHERE id = $2 RETURNING id, email, first_name, last_name, image',
            [
                image,
                id,
            ],
        );
        return newUser.rows[0];
    },

    async deleteByPk(id) {
        const user = await client.query('SELECT * FROM "user" WHERE id = $1', [id]);
        if (user.rowCount === 0) {
            throw new ApiError(400, 'This user does not exists');
        }
        const result = await client.query('DELETE FROM "user" WHERE id = $1 RESTART IDENTITY', [id]);

        return !!result.rowCount;
    },

};
