// Разовый скрипт: конвертирует src/data/trends.ts -> trends.json
const fs = require('fs')
const s = fs.readFileSync('src/data/trends.ts', 'utf8')
let body = s.split('export const trends: Trend[] =')[1].split('export const categories')[0].trim()
if (body.endsWith(';')) body = body.slice(0, -1).trim()
body = body.replace(/'/g, '"').replace(/([{,]\s*)(\w+):\s/g, (x, a, b) => a + '"' + b + '": ').replace(/,(\s*[\]}])/g, '$1')
const arr = JSON.parse(body)
fs.writeFileSync('src/data/trends.json', JSON.stringify({ trends: arr }, null, 2))
console.log('ok', arr.length)
