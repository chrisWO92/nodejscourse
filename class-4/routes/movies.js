import { Router } from "express";
import { readJSON } from "../utils";
import { randomUUID } from 'node:crypto'
import { validateMovie, validatePartialMovie } from '../schemas/movies'

const movies = readJSON('../movies.json')
export const moviesRouter = Router()

moviesRouter.get('/', (req, res) => {
    const { genre } = req.query
    if (genre) {
        // filtrar por género sin sensibilidad a las mayúsculas
        const filteredMovies = filter(
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLocaleLowerCase())
        )
        return res.json(filteredMovies)
    }
    res.json(movies)
})

moviesRouter.get('/:id', (req, res) => {
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)

    if (movie) return res.json(movie)

    res.status(404).json({ message: 'Movie not found' })
})

moviesRouter.post('/', (req, res) => {
    const result = validateMovie(req.body)

    if (result.error) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = {
        id: randomUUID(), // uuid v4
        ...result.data // no es lo mismo que req.body ya que esta no tiene las validaciones
    }

    movies.push(newMovie)

    res.status(201).json(newMovie) // Actualizar caché del cliente
})

moviesRouter.delete('/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movie not found' })
    }

    movies.splice(movieIndex, 1)

    return res.json({ message: 'Movie deleted' })
})

moviesRouter.patch('/', (req, res) => {
    const result = validatePartialMovie(req.body)

    // validar di existe error de validación
    if (result.error) {
        return res.status(400).json({
            error: JSON.parse(result.error.message)
        })
    }

    // validad que el id existe
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movie not found' })
    }

    // traemos todas las variables del objeto que no se van a modificar y le actualizamos todas las que si se van a actualizar
    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }

    // Reemplazamos el objeto actualizado
    movies[movieIndex] = updateMovie
    return res.json(updateMovie)
})