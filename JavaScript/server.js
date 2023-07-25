import {
    translateText
} from './APIs/googleTranslate.js'

console.log('server starts');
await translateText()
console.log('server stops');