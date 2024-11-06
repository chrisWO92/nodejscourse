const fs = require('node:fs')
const { promisify } = require('node:util')

const readFilePromise = promisify(fs.readFile)

// leyendo un archivo txt
console.log('Leyendo el primer archivo')
/* fs.readFilePromise('./archivo.txt', 'utf-8', (err, text) => {
    console.log(text)
})

console.log('Hacer cosas mientras lee el archivo...')

console.log('Leyendo el segundo archivo...')
fs.readFilePromise('./archivo2.txt', 'utf-8', (err, text) => {
    console.log(text)
}) */

readFilePromise('./archivo.txt', 'utf-8')
    .then(text => {
        console.log('primer texto: ', text)
    })

console.log('Hacer cosas mientras lee el archivo...')

console.log('Leyendo el segundo archivo...')
readFilePromise('./archivo2.txt', 'utf-8')
    .then(text => {
        console.log('segundo texto: ', text)
})