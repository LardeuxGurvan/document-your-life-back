const client = require('../config/db');
const ApiError = require('../errors/apiError');

module.exports = {

    // Find card by id
    async findByPk(cardId) {
        const result = await client.query('SELECT * FROM "card" WHERE id = $1', [cardId]);
        if (result.rowCount === 0) {
            return null;
        }

        return result.rows[0];
    },

    // Find the last inserted by user
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

    // Create card
    async create(text, video, audio, image, moodLabel, userId) {
        // check if user insert a mood
        if (!moodLabel) {
            const moodId = 1;
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
        }

        // if user insert a mood
        const result = await client.query('SELECT "id" FROM "mood" WHERE "label" = $1', [moodLabel]);
        if (result.rowCount === 0) {
            throw new ApiError(403, 'there is no mood with this name');
        }
        const savedCard = await client.query(
            'INSERT INTO "card" ("text", "video", "audio", "image", "mood_id", "user_id") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [
                text,
                video,
                audio,
                image,
                result.rows[0].id,
                userId,
            ],
        );

        return savedCard.rows[0];
    },

    // Update card
    async update(id, card) {
        const result = await client.query('SELECT * FROM card WHERE id = $1', [id]);

        const oldCard = result.rows[0];
        const newCard = { ...oldCard, ...card };
        if (!newCard.moodLabel) {
            const savedCard = await client.query('SELECT * FROM update_card_without_mood($1)', [newCard]);
            return savedCard.rows[0];
        }

        const savedCard = await client.query('SELECT * FROM update_card($1)', [newCard]);

        return savedCard.rows[0];
    },

    async deleteOne(id, element, todayDate) {
        console.log('todayDate', todayDate);
        console.log('element', element);
        console.log('id', id);
        const result = await client.query('SELECT * FROM "card" WHERE "user_id" = $1 ORDER BY "created_at" DESC LIMIT 1', [id]);
        const idTodayCard = result.rows[0].id;

        const deletedElementCard = await client.query(
            `UPDATE "card" SET ${element.element} = NULL WHERE id = $1 RETURNING *`, [idTodayCard]);
        console.log('carte modifier : ', deletedElementCard.rows[0]);
    },

    async delete(id, card) {
        console.log('user id : ', id, 'card id : ', card);
        const user = await client.query('SELECT * FROM "user" WHERE id = $1', [id]);
        if (user.rowCount === 0) {
            throw new ApiError(400, 'This user does not exists');
        }
        const findCard = await client.query('SELECT * FROM "card" WHERE id = $1', [card]);
        if (findCard.rowCount === 0) {
            throw new ApiError(400, 'This card does not exists');
        }
        const result = await client.query('DELETE FROM "card" WHERE id = $1', [card]);

        return !!result.rowCount;
    },
};
