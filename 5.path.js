const path = require('node:path')

// barra separadora de carpetas según SO
console.log(path.sep)

// unir rutas con path.join
const filePath = path.join('content', 'subfolder', 'text.txt')
console.log(filePath)

const base = path.basename(filePath)
console.log(base)

const filename = path.basename(filePath, '.txt')
console.log(filename)

const extension = path.extname('image.jpg')
console.log(extension)