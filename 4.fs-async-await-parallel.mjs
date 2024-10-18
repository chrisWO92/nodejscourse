import { readFile } from "node:fs/promises";

Promise.all([
    readFile('./archivo.txt', 'utf-8'),
    readFile('./archivo2.txt', 'utf-8'),
]).then(([text, secondText]) => {
    console.log('primer archivo: ', text)
    console.log('secungo archivo: ', secondText)
})