const client = require('../config/db');

module.exports = {

    async findByPk(cardId) {
        const result = await client.query('SELECT * FROM "card" WHERE id = $1', [cardId]);
        if (result.rowCount === 0) {
            return null;
        }

        return result.rows[0];
    },

    // async findByDateAndUser(timestamp, userId) {
    //     const result =
    // },

    async create(text, video, audio, image, userId) {
        const savedCard = await client.query(
            'INSERT INTO "card" ("text", "video", "audio", "image", "user_id") VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [
                text,
                video,
                audio,
                image,
                userId,
            ],
        );

        return savedCard.rows[0];
    },

};
