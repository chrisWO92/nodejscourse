// import { MovieModel } from "../models/local-file-system/movie.js"
// import { MovieModel } from "../models/mysql/movie.js"
import { MovieModel } from "../models/turso/movie.js"

import { validateMovie, validatePartialMovie } from '../schemas/movies.js'


export class MovieController {

    static async getAll(req, res) {
        const { genre } = req.query
        const movies = await MovieModel.getAll({ genre })
        res.json(movies)
    }

    static async getById(req, res) {
        const { id } = req.params
        const movie = await MovieModel.getByID({ id })

        if (movie) return res.json(movie)

        res.status(404).json({ message: 'Movie not found' })
    }

    static async create(req, res) {
        const result = validateMovie(req.body)

        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        const newMovie = await MovieModel.create({ input: result.data })

        res.status(201).json(newMovie)
    }

    static async delete(req, res) {
        const { id } = req.params
        const movieIndex = await MovieModel.delete({ id })

        if (!movieIndex) {
            return res.status(404).json({ message: 'Movie not found' })
        }

        return res.json({ message: 'Movie deleted' })
    }

    static async update(req, res) {
        const result = validatePartialMovie(req.body)

        // validar di existe error de validación
        if (result.error) {
            return res.status(400).json({
                error: JSON.parse(result.error.message)
            })
        }

        // validad que el id existe
        const { id } = req.params
        const updateMovie = await MovieModel.update({
            id,
            input: result.data
        })

        return res.json(updateMovie)
    }

}