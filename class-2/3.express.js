const ditto = require('./pokemon/ditto.json')
const express = require('express')
const app = express()

const PORT = process.env.PORT ?? 1234

app.disable('x-powered-by')

app.use(express.json())

/* app.use((req, res, next) => {
    if (req.method !== 'POST') return next()
    if (req.headers['content-type'] !== 'application/json') return next()

    let body = ''

    req.on('data', chunk => {
        body += chunk.toString()
    })

    req.on('end', () => {
        const data = JSON.parse(body)
        data.timestamp = Date.now()
        req.body = data
        next()
    })
}) */

app.get('/pokemon/ditto', (req, res) => {
    res.json(ditto)
})

app.post('/pokemon', (req, res) => {
    res.status(201).json(req.body)
})

app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
})

// la aplicación llega aquí sino usa ninguna de las anteriores
app.use((req, res) => {
    res.status(404).send(`<h1>404 not found</h1>`)
})