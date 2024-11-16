import express, { json } from 'express'
import { moviesRouter } from './routes/movies'
import { corsMiddleware } from './middlewares/cors'

// en el futuro lo anterior será como sigue
/* 
import { movies } from './movies.json' with { type: 'json' }
*/

const app = express()

app.use(corsMiddleware())

app.use(json()) // middleware para poder recibir con req.body lo que enviemos en el body
app.disable('x-powered-by')
app.get('/', (req, res) => {
    res.json({ message: 'hola mundo' })
})
app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
})