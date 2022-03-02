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
    async findCardsByUserPk(userId) {
        const result = await client.query('SELECT * FROM "card" WHERE "user_id" = $1 ORDER BY "created_at" DESC LIMIT 2', [userId]);
        if (result.rowCount === 0) {
            return null;
        }

        return result.rows;
    },
    async selectAllCardsMood(userId) {
        const result = await client.query('SELECT card.id, user_id, mood.label, card.created_at FROM "card" INNER JOIN "mood" ON card.mood_id = mood.id WHERE "user_id" = $1 ORDER BY "created_at"', [userId]);
        if (result.rowCount === 0) {
            return null;
        }
        return result.rows;
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

};
