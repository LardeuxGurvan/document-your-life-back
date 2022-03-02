const client = require('../config/db');

module.exports = {

    async findByPk(cardId) {
        const result = await client.query('SELECT * FROM "card" WHERE id = $1', [cardId]);
        if (result.rowCount === 0) {
            return null;
        }

        return result.rows[0];
    },

    async findLatestByUserPk(userId) {
        const result = await client.query('SELECT * FROM "card" WHERE "user_id" = $1 ORDER BY "created_at" DESC LIMIT 1', [userId]);
        if (result.rowCount === 0) {
            return null;
        }

        return result.rows[0];
    },

    async create(text, video, audio, image, moodId, userId) {
        const savedCard = await client.query(
            'INSERT INTO "card" ("text", "video", "audio", "image", "mood_id", "user_id") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [
                text,
                video,
                audio,
                image,
                moodId,
                userId,
            ],
        );

        return savedCard.rows[0];
    },

    async update(text, video, audio, image, moodId, userId) {
        const savedCard = await client.query(
            'INSERT INTO "card" ("text", "video", "audio", "image", "mood_id", "user_id") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [
                text,
                video,
                audio,
                image,
                moodId,
                userId,
            ],
        );

        return savedCard.rows[0];
    },
};
