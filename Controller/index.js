import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { readJSON } from '../config/require.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Función que carga todos los JSON de una tienda
const cargarDatosPorTienda = nombreTienda => {
  const tiendaPath = path.join(__dirname, `../data/${nombreTienda}`)
  const archivos = fs.readdirSync(tiendaPath)
  const datos = {}

  archivos.forEach(archivo => {
    if (archivo.endsWith('.json')) {
      const [_, marcaRaw] = archivo.split('-') // claro-Apple.json
      const marca = marcaRaw.replace('.json', '')
      const json = readJSON(path.join(tiendaPath, archivo))
      datos[marca] = json
    }
  })

  return datos
}

export const renderHome = (req, res) => {
  const tiendas = {
    claro: cargarDatosPorTienda('claro'),
    entel: cargarDatosPorTienda('entel'),
    movistar: cargarDatosPorTienda('movistar')
  }

  res.render('index', { tiendas })
}
