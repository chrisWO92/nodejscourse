import { createClient } from "@libsql/client";
import dotenv from 'dotenv';
import { randomUUID } from 'crypto'

dotenv.config();

export const turso = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export class MovieModel {

    static async getAll({ genre }) {
        const result = await turso.execute(`SELECT * FROM movie;`);

        if (genre) {
            const { rows } = await turso.execute({
                sql: 'SELECT id FROM genre WHERE LOWER(genre_name) = ?;',
                args: [genre.toLowerCase()]
            });

            const genreId1 = rows[0]?.id;
            const genreId2 = `${rows[0]?.id}`
            const formattedRate = genreId1.toFixed(1);

            const moviesIds = await turso.execute({
                sql: `SELECT * FROM movie_genres LEFT JOIN movie ON movie.id = movie_genres.movie_id WHERE genre_id = ?;`,
                args: [genreId2]
            });
            return moviesIds.rows
        }

        return result.rows

    }

    static async getByID({ id }) {

        const { rows } = await turso.execute({
            sql: `
              SELECT 
                movie_title, 
                year, 
                director, 
                duration, 
                poster, 
                rate, 
                id 
              FROM movie 
              WHERE id = ?;
            `,
            args: [id],
        });

        return rows[0];

    }


    static async create({ input }) {
        const {
            movie_title,
            year,
            director,
            duration,
            rate,
            poster
        } = input;

        // Generar UUID directamente en Node.js
        const uuid = randomUUID();

        // Insertar en la base de datos
        await turso.execute({
            sql: `
            INSERT INTO movie (id, movie_title, year, director, duration, poster, rate)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `,
            args: [uuid, movie_title, year, director, duration, poster, rate],
        });

        // Consultar la película recién insertada
        const { rows } = await turso.execute({
            sql: `
            SELECT movie_title, year, director, duration, poster, rate, id
            FROM movie
            WHERE id = ?;
        `,
            args: [uuid],
        });

        return rows[0];
    }


    static async delete({ id }) {
        // Obtener los datos de la película antes de eliminarla
        const { rows } = await turso.execute({
            sql: `
                SELECT movie_title, year, director, duration, poster, rate, id
                FROM movie
                WHERE id = ?;
            `,
            args: [id],
        });

        // Eliminar la película
        await turso.execute({
            sql: `DELETE FROM movie WHERE id = ?;`,
            args: [id],
        });

        return rows[0]; // Devuelve la película eliminada
    }


    static async update({ id, input }) {

        const fields = [];
        const values = [];

        for (let data in input) {
            console.log(input[data])

            if (data !== undefined) {
                fields.push(`${data} = ?`);
                values.push(input[data]);
            }
        }


        // ... repite para los demás campos

        if (fields.length === 0) {
            throw new Error("No fields to update");
        }

        values.push(id); // al final va el ID para el WHERE

        await turso.execute({
            sql: `UPDATE movie SET ${fields.join(', ')} WHERE id = ?;`,
            args: values,
        });

        const { rows } = await turso.execute({
            sql: `
                SELECT movie_title, year, director, duration, poster, rate, id
                FROM movie
                WHERE id = ?;
            `,
            args: [id],
        });

        return rows[0];
    }

}