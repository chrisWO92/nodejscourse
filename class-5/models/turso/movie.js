import { createClient } from "@libsql/client";
import dotenv from 'dotenv';
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

            console.log(rows[0]?.id)
            const genreId = rows[0]?.id;
            const formattedRate = genreId.toFixed(1);
            console.log(formattedRate)

            /* const moviesIds = await turso.execute({
                sql: `
                  SELECT 
                    movie_id,
                    movie.movie_title, 
                    movie.year, 
                    movie.director, 
                    movie.duration, 
                    movie.rate, 
                    movie.poster
                  FROM movie_genres
                  JOIN movie ON movie.id = movie_genres.movie_id
                  WHERE genre_id = ?;
                `,
                args: [formattedRate] // Asegúrate que genreId esté estructurado correctamente
            }); */

            const moviesIds = await turso.execute({
                sql: `
                  SELECT movie.movie_title, movie.year FROM movie_genres JOIN movie ON movie.id = movie_genres.movie_id WHERE genre_id = ?;
                `,
                args: [formattedRate] // Asegúrate que genreId esté estructurado correctamente
            });

            /* const movie_genres = await turso.execute({
                sql: `SELECT movie_id, ROUND(genre_id) as genre_id FROM movie_genres;`
            }); */
            console.log(moviesIds.rows)


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



    }

    static async delete({ id }) {



    }

    static async update({ id, input }) {



    }

}