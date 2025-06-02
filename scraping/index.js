import { scrapeClaro } from '../Model/claro.js'
import { scrapeEntel } from '../Model/entel.js'
import { scrapeMovistar } from '../Model/movistar.js'
import { scrapeFalabella } from '../Model/falebella.js'

await scrapeFalabella({ marca: 'Apple' })

// const marcasClaro = ['Apple', 'Samsung', 'Xiaomi']
// const marcasEntel = ['Apple', 'Samsung', 'Xiaomi']
// const marcasMovistar = ['Apple', 'Samsung', 'Xiaomi']
// const marcasFalabella = ['Apple', 'Samsung', 'Xiaomi']

// for (const marca of marcasClaro) {
//   await scrapeClaro({ marca })
// }
// for (const marca of marcasEntel) {
//   await scrapeEntel({ marca })
// }
// for (const marca of marcasMovistar) {
//   await scrapeMovistar({ marca })
// }

// for (const marca of marcasFalabella) {
//   await scrapeFalabella({ marca })
// }
