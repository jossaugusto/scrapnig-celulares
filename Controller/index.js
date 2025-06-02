// Controller/index.js
import path from 'path'
import { readJSON } from '../config/require.js'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

// Necesario en ESModules para usar __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const renderHome = (req, res) => {
  const claro = readJSON(path.join(__dirname, '../data/claro/claro.json'))
  const entel = readJSON(path.join(__dirname, '../data/entel/entel.json'))
  const movistar = readJSON(path.join(__dirname, '../data/movistar/movistar.json'))

  res.render('index', { claro, entel, movistar })
}
