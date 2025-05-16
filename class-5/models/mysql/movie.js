import { randomUUID } from 'node:crypto'
import mysql from 'mysql2/promise'

const config = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '200030208Cps*',         // ← aquí actualizas la contraseña
    database: 'moviesdb'
}

const connection = await mysql.createConnection(config)

export class MovieModel {

    static async getAll({ genre }) {

        const result = await connection.query(
            'SELECT movie_title, year, director, duration, poster, rate, BIN_TO_UUID(id) as id FROM movie;'
        )

        if (genre) {
            const genreId = await connection.query(
                'SELECT id FROM genre WHERE LOWER(genre_name) = ?;', [genre.toLowerCase()]
            )

            const moviesIds = await connection.query(
                `SELECT BIN_TO_UUID(movie_id) as movie_id, movie.movie_title, movie.year, movie.director, movie.duration, movie.rate, movie.poster FROM movie_genres JOIN movie ON movie.id = movie_genres.movie_id WHERE genre_id = ?;`, [genreId[0][0].id]
            )

            return moviesIds[0];

        }

        return result[0]
    }

    static async getByID({ id }) {

        const result = await connection.query(
            'SELECT movie_title, year, director, duration, poster, rate, BIN_TO_UUID(id) as id FROM movie WHERE id = UUID_TO_BIN(?);', [id]
        )
        return result[0][0]
    }

    static async create({ input }) {
        const {
            movie_title,
            year,
            director,
            duration,
            rate,
            poster
        } = input

        const [uuidResult] = await connection.query(`SELECT UUID() AS uuid;`)
        const [{ uuid }] = uuidResult
        console.log(uuid);

        await connection.query(
            `INSERT INTO movie (id, movie_title, year, director, duration, poster, rate) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)`, [uuid, movie_title, year, director, duration, poster, rate]
        )

        const result = await connection.query(
            'SELECT movie_title, year, director, duration, poster, rate, BIN_TO_UUID(id) as id FROM movie WHERE BIN_TO_UUID(id) = ?;', [uuid]
        )

        return result[0];

    }

    static async delete({ id }) {

        const result = await connection.query(
            'SELECT movie_title, year, director, duration, poster, rate, BIN_TO_UUID(id) as id FROM movie WHERE BIN_TO_UUID(id) = ?;', [id]
        )

        await connection.query(
            `DELETE FROM movie WHERE id = UUID_TO_BIN(?);`, [id]
        )

        return result[0]

    }

    static async update({ id, input }) {
        const {
            movie_title,
            year,
            director,
            duration,
            poster,
            rate
        } = input

        await connection.query(
            `UPDATE movie SET movie_title = ?, year = ?, director = ?, duration = ?, poster = ?, rate = ? WHERE id = UUID_TO_BIN(?);`, [movie_title, year, director, duration, , poster, rate, id]
        )

        const updatedMovie = await connection.query(
            'SELECT movie_title, year, director, duration, poster, rate, BIN_TO_UUID(id) as id FROM movie WHERE BIN_TO_UUID(id) = ?;', [id]
        )

        return updatedMovie[0]
    }

}