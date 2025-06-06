import express, { json } from 'express'
import { createMovieRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

//import { MovieModel } from "./models/mysql/movie.js"
import { MovieModel } from "./models/turso/movie.js"

export const createApp = ({ movieModel }) => {
    const app = express()

    app.use(corsMiddleware())

    app.use(json()) // middleware para poder recibir con req.body lo que enviemos en el body
    app.disable('x-powered-by')
    app.get('/', (req, res) => {
        res.json({ message: 'hola mundo' })
    })
    app.use('/movies', createMovieRouter({ movieModel }))

    const PORT = process.env.PORT ?? 1234

    app.listen(PORT, () => {
        console.log(`server listening on port http://localhost:${PORT}`)
    })
}
