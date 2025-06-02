import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

// Importamos el controlador
import { renderHome } from './Controller/index.js'

// Configuración básica
const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Motor de vistas
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'View'))

// Archivos estáticos (por si en el futuro agregas estilos, scripts, imágenes)
app.use(express.static(path.join(__dirname, 'public')))

// Rutas
app.get('/', renderHome)

// Puerto
const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
